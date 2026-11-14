import { sql } from '@/lib/db';                 

export async function GET() {                   
  const rows = await sql`SELECT p.content AS passage,
q.content AS question,
q.id AS question_id,
ac.content AS answer_choice,
ac.id AS choice_id
FROM passages p
JOIN questions q ON p.id = q.passage_id
JOIN answer_choices ac ON q.id = ac.question_id
WHERE p.id = 1`;


if (rows.length === 0) {
    return Response.json({ error: 'not found'}, { status: 404})

}

const questions = new Map();         

  for (const row of rows) {

    if (!questions.has(row.question_id)) {
      // first time seeing this question: create it
      questions.set(row.question_id, {
        id: row.question_id,
        content: row.question,
        choices: [],
      });
    }
    // add this row's choice to its question
    questions.get(row.question_id).choices.push({
      id: row.choice_id,
      content: row.answer_choice
    });
  }

  return Response.json(
    {
        passage: rows[0].passage,
        questions: [...questions.values()],
    }
  );                  
}



