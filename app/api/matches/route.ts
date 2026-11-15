import { sql } from '@/lib/db'

export async function POST(request: Request) {
    const body = await request.json(); // { "player1_id": 1, "player2_id": 2 }

    // 1. pick a random passage
    const passages = await sql`SELECT id FROM passages ORDER BY random() LIMIT 1`;
    
    if (passages.length === 0) {
        return Response.json({ error: 'No passages available.'}, { status: 404});
    }

    // 2. create the match
    try {
        const rows = await sql`INSERT INTO match (passage_id, player1_id, player2_id) VALUES (${passages[0].id}, ${body.player1_id}, ${body.player2_id}) RETURNING *`;
        return Response.json(rows[0]);
    } catch (err: any) {
        
        if (err.code === '23503') {
            return Response.json({ error: 'Player not found.'}, { status: 404});
        }
        if (err.code === '23514') {
            return Response.json({ error: 'A player cannot play against themselves.'}, { status: 400 });
        }
        throw err;
    }


}