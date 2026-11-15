-- Four dog passages, one question each, four choices each.
-- Each block inserts a passage, its question, and its choices in one statement,
-- so no ids are hard-coded. Run this whole file once in the Neon SQL Editor.

-- 1. Basenji: trap = taking the nickname literally
WITH p AS (
  INSERT INTO passages (content, source) VALUES (
    'The Basenji is a breed of hunting dog created from stock that originated in Central Africa, including in the Republic of the Congo and other adjacent tropical African countries. The breed does not bark in the traditional manner of most dogs, rather vocalising in an unusual, yodel-like "talking" sound, due to its unusually-shaped larynx. This trait earns the Basenji its nickname of "barkless" dog, a similar feature seen and heard in the New Guinea singing dog.',
    'https://en.wikipedia.org/wiki/Basenji'
  ) RETURNING id
), q AS (
  INSERT INTO questions (content, passage_id)
  SELECT 'Based on the passage, the nickname "barkless" is best described as:', id FROM p
  RETURNING id
)
INSERT INTO answer_choices (content, correct, question_id)
SELECT c.content, c.correct, q.id FROM q, (VALUES
  ('A literal description, since the Basenji cannot make vocal sounds', false),
  ('Fitting in spirit but literally misleading, since the Basenji still vocalises', true),
  ('A trait the Basenji inherited from the New Guinea singing dog', false),
  ('A reference to the breed''s origins in Central Africa', false)
) AS c(content, correct);

-- 2. Dalmatian: trap = assuming the famous firehouse role was its original purpose
WITH p AS (
  INSERT INTO passages (content, source) VALUES (
    'The Dalmatian is a breed of dog with a white coat marked with dark-coloured spots. Originally bred as a hunting dog, it was also used as a carriage dog by firefighters in the days of horse-drawn firehouse carriages. The origins of this breed can be traced to Croatia and the historical region of Dalmatia.',
    'https://en.wikipedia.org/wiki/Dalmatian_dog'
  ) RETURNING id
), q AS (
  INSERT INTO questions (content, passage_id)
  SELECT 'Which statement is best supported by the passage?', id FROM p
  RETURNING id
)
INSERT INTO answer_choices (content, correct, question_id)
SELECT c.content, c.correct, q.id FROM q, (VALUES
  ('The Dalmatian was originally bred to run alongside firehouse carriages', false),
  ('The breed takes its name from its spotted coat', false),
  ('The Dalmatian worked with firefighters in addition to the purpose it was first bred for', true),
  ('Firefighters chose Dalmatians because their spots were easy to see at night', false)
) AS c(content, correct);

-- 3. Border Collie: trap = treating "some have claimed" as fact
WITH p AS (
  INSERT INTO passages (content, source) VALUES (
    'The Border Collie is a breed of British herding dog of the collie type of medium size. It competes with success in sheepdog trials. Some have claimed that it is the most intelligent breed of dog.',
    'https://en.wikipedia.org/wiki/Border_Collie'
  ) RETURNING id
), q AS (
  INSERT INTO questions (content, passage_id)
  SELECT 'How does the passage treat the idea that the Border Collie is the most intelligent breed?', id FROM p
  RETURNING id
)
INSERT INTO answer_choices (content, correct, question_id)
SELECT c.content, c.correct, q.id FROM q, (VALUES
  ('It presents the idea as an established fact', false),
  ('It offers success in sheepdog trials as proof of the idea', false),
  ('It dismisses the idea as an exaggeration', false),
  ('It reports the idea as a claim some people make, without endorsing it', true)
) AS c(content, correct);

-- 4. Newfoundland: trap = ignoring the "However"
WITH p AS (
  INSERT INTO passages (content, source) VALUES (
    'The Newfoundland is a large breed of working dog. They can be black, grey, brown, or black and white. However, in the Dominion of Newfoundland, before it became part of Canada, only black and Landseer (white-and-black) coloured dogs were considered to be proper members of the breed.',
    'https://en.wikipedia.org/wiki/Newfoundland_dog'
  ) RETURNING id
), q AS (
  INSERT INTO questions (content, passage_id)
  SELECT 'According to the passage, a grey Newfoundland in the Dominion of Newfoundland would have been:', id FROM p
  RETURNING id
)
INSERT INTO answer_choices (content, correct, question_id)
SELECT c.content, c.correct, q.id FROM q, (VALUES
  ('Accepted as a proper member, since the breed can be grey', false),
  ('Not considered a proper member of the breed', true),
  ('Classified as a Landseer', false),
  ('More common there than after Newfoundland joined Canada', false)
) AS c(content, correct);
