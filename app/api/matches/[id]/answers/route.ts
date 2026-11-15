import { sql } from '@/lib/db';

export async function POST(request: Request, { params }: { params: Promise<{ id: string}>}) 
{
    const { id } = await params;

    //body = callers values
    const body = await request.json(); // {player_id: 1, choice_id: 4}

    // 1. the match: who's playing, and which passage.
    //matches = db values.
    const matches = await sql`SELECT * FROM match WHERE id = ${id}`;

    if (matches.length === 0) {
        return Response.json({ error: 'Match not found.'}, { status: 404});
    }
    const match = matches[0];

    // 2. is this player in this match?
    if (body.player_id !== match.player1_id && body.player_id !== match.player2_id) {
        return Response.json({ error: 'Player is not in this match.'}, { status: 403});
    }

    // 3. the choice: its question, whether it's correct, and its passage
    const choices = await sql `
        SELECT ac.question_id, ac.correct, q.passage_id
        FROM answer_choices ac
        JOIN questions q ON q.id = ac.question_id
        WHERE ac.id = ${body.choice_id}
    `;

    if (choices.length === 0 || choices[0].passage_id !== match.passage_id) {
        return Response.json({ error: 'Invalid choice.'}, { status: 400 });
    }

    // 4. save the answer.
    const choice = choices[0];

    try {
        await sql`INSERT INTO player_answers (match_id, player_id, question_id, choice_id)
            VALUES (${id}, ${body.player_id}, ${choice.question_id}, ${body.choice_id})`
    } catch (err: any) {
        
        if (err.code === '23505') {
            return Response.json({ error: 'Question already answered.'}, { status: 409})
        }
        throw err;
    }

    //5. if correct, add a point to the right player's score.
    if (choice.correct) {
        if (body.player_id === match.player1_id) {
            await sql`UPDATE match SET player1_score = player1_score + 1 WHERE id = ${id}`;
        } else {
            await sql`UPDATE match SET player2_score = player2_score + 1 WHERE id = ${id}`;
        }
    }

    return Response.json({ correct: choice.correct });

}
