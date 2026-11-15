'use client';
import { useState } from 'react';

export default function Home() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [players, setPlayers] = useState<any[]>([]);
  const [match, setMatch] = useState<any>(null);
  const [passage, setPassage] = useState<any>(null);
  const [turn, setTurn] = useState(0);                   // 0 = player 1, 1 = player 2
  const [answered, setAnswered] = useState<number[]>([]); // question ids answered this turn
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  async function start() {
    setError('');
    const r1 = await fetch('/api/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_name: name1 }),
    });
    const p1 = await r1.json();
    const r2 = await fetch('/api/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_name: name2 }),
    });
    const p2 = await r2.json();
    if (!r1.ok || !r2.ok) return setError(p1.error || p2.error);
    setPlayers([p1, p2]);

    const r3 = await fetch('/api/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player1_id: p1.id, player2_id: p2.id }),
    });
    setMatch(await r3.json());

    const r4 = await fetch('/api/passage');
    setPassage(await r4.json());
  }

  async function answer(questionId: number, choiceId: number) {
    await fetch(`/api/matches/${match.id}/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_id: players[turn].id, choice_id: choiceId }),
    });
    setAnswered([...answered, questionId]);
  }

  async function next() {
    if (turn === 0) {
      setTurn(1);
      setAnswered([]);
      return;
    }
    const r = await fetch(`/api/matches/${match.id}/finish`, { method: 'POST' });
    setResult(await r.json());
  }

    // SCREEN 3: results
  if (result) {
    const [a, b] = players;
    const winner =
      result.result === 1 ? a.user_name :
      result.result === 0 ? b.user_name : null;
    return (
      <main className="mx-auto max-w-md p-8 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">{winner ? `${winner} wins!` : 'Tie!'}</h1>
        <p>{a.user_name}: {a.elo} → {a.elo + result.elo_change}</p>
        <p>{b.user_name}: {b.elo} → {b.elo - result.elo_change}</p>
        <button className="bg-black text-white p-2" onClick={() => location.reload()}>
          Home
        </button>
      </main>
    );
  }


  // SCREEN 2: game
  if (match && passage) {
    const done = answered.length === passage.questions.length;
    return (
      <main className="mx-auto max-w-xl p-8 flex flex-col gap-6">
        <h2 className="text-xl font-bold">Turn: {players[turn].user_name}</h2>
        <p>{passage.passage}</p>
        {passage.questions.map((q: any) => (
          <div key={q.id} className="flex flex-col gap-2">
            <p className="font-semibold">{q.content}</p>
            {q.choices.map((c: any) => (
              <button key={c.id} disabled={answered.includes(q.id)}
                onClick={() => answer(q.id, c.id)}
                className="border p-2 text-left disabled:opacity-50">
                {c.content}
              </button>
            ))}
          </div>
        ))}
        {done && <button className="bg-black text-white p-2" onClick={next}>Next</button>}
      </main>
    );
  }

  // SCREEN 1: setup
  return (
    <main className="mx-auto max-w-md p-8 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Lit Duel</h1>
      <input className="border p-2" placeholder="Player 1"
        value={name1} onChange={(e) => setName1(e.target.value)} />
      <input className="border p-2" placeholder="Player 2"
        value={name2} onChange={(e) => setName2(e.target.value)} />
      <button className="bg-black text-white p-2" onClick={start}>Start</button>
      {error && <p className="text-red-600">{error}</p>}
    </main>
  );
}
