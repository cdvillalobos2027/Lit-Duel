import { sql } from '@/lib/db'; 

export async function POST(request: Request)

{
  const body = await request.json();   // the data sent, e.g. { "user_name": "chris" }
  
  if (typeof body.user_name !== 'string' || body.user_name.trim() === '') {
    return Response.json({ error: 'That username is empty.'}, { status: 400})

  }

  try {
      const rows = await sql`INSERT INTO player (user_name) VALUES (${body.user_name}) RETURNING *`;
      return Response.json(rows[0]);
    }
  catch (err: any) {
      
     if (err.code === '23505') {
        const existing = await sql`SELECT * FROM player WHERE user_name = ${body.user_name}`;
        return Response.json(existing[0]);
      }
      throw err;

  }

}
