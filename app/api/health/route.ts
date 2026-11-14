import { sql } from '@/lib/db';                 // the query function you exported

export async function GET() {                   // runs when /api/health is visited
  const rows = await sql`SELECT now()`;         // ask Neon for the current time
  return Response.json(rows);                   // send the answer to the browser
}
