import { sql } from '@/lib/db';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }>}

) {
    const { id } = await params;

    // 1. make sure the match has finished.
    const matches = await sql`
        UPDATE match SET finished_at = now()
        WHERE id = ${id} AND finished_at IS NULL
        RETURNING *`;

    if (matches.length === 0) {
        return Response.json({ error: 'Match already finished.'}, { status: 409});
    }
    const match = matches[0];

    // 2. Make sure elo-change is correct.
    const players = await sql`SELECT id, elo FROM player
        WHERE id IN (${match.player1_id}, ${match.player2_id})`;

    const p1 = players.find((p) => p.id === match.player1_id);
    const p2 = players.find((p) => p.id === match.player2_id);

    if (!p1 || !p2) {
        return Response.json({ error: 'Player not found.'}, { status: 404});
    }


    let s1;
    
    if (match.player1_score > match.player2_score) {
        s1 = 1;
    } else if (match.player1_score === match.player2_score) {
        s1 = 0.5;
    } else {
        s1 = 0;
    }

    const e1 = 1 / (1 + 10 ** ((p2.elo - p1.elo) / 400));
    const K = 32;
    const change = Math.round(K * (s1 - e1));

    await sql.transaction([
        sql`UPDATE player SET
                elo = elo + ${change},
                games = games + 1,
                games_won = games_won + ${s1 === 1 ? 1 : 0},
                games_tied = games_tied + ${s1 === 0.5 ? 1 :0},
                games_lost = games_lost + ${s1 === 0 ? 1 : 0}
            WHERE id = ${p1.id}`,
        sql`UPDATE player SET
                elo = elo - ${change},
                games = games + 1,
                games_won = games_won + ${1 - s1 === 1 ? 1 : 0},
                games_tied = games_tied + ${1 - s1 === 0.5 ? 1:0},
                games_lost = games_lost + ${1 - s1 === 0 ? 1 : 0}
            WHERE id = ${p2.id}`
    ]);

    return Response.json({ result: s1, elo_change: change});








}