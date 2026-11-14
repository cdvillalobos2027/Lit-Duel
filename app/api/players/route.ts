import { sql } from '@/lib/db'; 

export async function POST(request: Request)

{
  const body = await request.json();   // the data sent, e.g. { "user_name": "chris" }
  
  try {
      const rows = await sql`INSERT INTO player (user_name) VALUES (${body.user_name}) RETURNING *`;
      return Response.json(rows[0]);
    }
  catch (err: any) {
      
     if (err.code === '23505') {
        return Response.json({ error: 'That username is already taken.'}, { status: 409})
      }
      throw err;

  }
  


  

}
