CREATE TABLE IF NOT EXISTS player (
    id  SERIAL PRIMARY KEY,
    user_name   TEXT NOT NULL UNIQUE,
    elo    INTEGER NOT NULL DEFAULT 1200,
    games INTEGER NOT NULL DEFAULT 0,
    games_won INTEGER NOT NULL DEFAULT 0,
    games_lost INTEGER NOT NULL DEFAULT 0,
    games_tied INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- answer choices point to questions and question point to passages.

-- passages have no other key present.
CREATE TABLE IF NOT EXISTS passages (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    source TEXT NOT NULL
);

-- questions points to passage.
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    passage_id INTEGER NOT NULL REFERENCES passages(id)
);

-- answer_choices points to questions.
CREATE TABLE IF NOT EXISTS answer_choices (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    correct BOOLEAN NOT NULL DEFAULT false,
    question_id INTEGER NOT NULL REFERENCES questions(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS one_correct_choice
  ON answer_choices (question_id) WHERE correct = true;


-- match table
CREATE TABLE IF NOT EXISTS match (
    id SERIAL PRIMARY KEY,
    passage_id INTEGER NOT NULL REFERENCES passages(id),
    player1_id INTEGER NOT NULL REFERENCES player(id),
    player2_id INTEGER NOT NULL REFERENCES player(id),
    player1_score INTEGER NOT NULL DEFAULT 0,
    player2_score INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    CHECK (player1_id <> player2_id)
);


-- player answers
CREATE TABLE IF NOT EXISTS player_answers (
    id SERIAL PRIMARY KEY,
    match_id INTEGER NOT NULL REFERENCES match(id),
    player_id INTEGER NOT NULL REFERENCES player(id),
    question_id INTEGER NOT NULL REFERENCES questions(id),
    choice_id INTEGER NOT NULL REFERENCES answer_choices(id),
    UNIQUE (match_id, player_id, question_id)
);