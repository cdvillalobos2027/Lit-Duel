INSERT INTO passages (content, source)
VALUES ('The Golden Retriever is a British breed of retriever dog of medium-large size. It is characterised by a gentle and affectionate nature and a striking golden coat.', 'https://en.wikipedia.org/wiki/Golden_Retriever')
RETURNING id;

INSERT INTO questions (content, passage_id)
VALUES ('Which best summarizes what the passage describes about the Golden Retriever?', 1)
RETURNING id;

INSERT INTO answer_choices (content, correct, question_id)
VALUES 
('Its origin, size, temperament, and coat', true, 1),
('Its lineage of breeding and process of domestication', false, 1),
('Where it came from and the origin of its name', false, 1),
('Its patterns of behavior when in groups', false, 1)
RETURNING id;







