-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS publisher CASCADE;
DROP TABLE IF EXISTS author CASCADE;
DROP TABLE IF EXISTS reviewer CASCADE;
DROP TABLE IF EXISTS review CASCADE;
DROP TABLE IF EXISTS book CASCADE;
DROP TABLE IF EXISTS author_book CASCADE;

CREATE TABLE publisher (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255),
    state VARCHAR(255),
    country VARCHAR(255)
);

INSERT INTO publisher (name, city, state, country)
    VALUES (
        'Elijah Prosperie',
        'Seattle',
        'Washington',
        'United States'
    );

CREATE TABLE book (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    released INT NOT NULL,
    publisher_id BIGINT NOT NULL,
    FOREIGN KEY (publisher_id) REFERENCES publisher(id)
);

INSERT INTO book (title, publisher_id, released)
VALUES
    ('Coffee Memoirs', (SELECT id FROM publisher WHERE name = 'Elijah Prosperie'), 2021);

CREATE TABLE author (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dob DATE,
    pob VARCHAR(255)
    
);

CREATE TABLE author_book (
    book_id BIGINT REFERENCES book(id),
    author_id BIGINT REFERENCES author(id)
);

CREATE TABLE reviewer(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255),
    company VARCHAR(255)

);

INSERT INTO reviewer (name, company) VALUES('Dano', 'Destruction');


CREATE TABLE review (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  rating INT CHECK (rating > 0 AND rating < 6),
  reviewer INT REFERENCES reviewer (id),
  review varchar(140) NOT NULL,
  book INT REFERENCES book (id)
);

INSERT INTO review (rating, reviewer, review, book) 
VALUES
  (4, 1, 'sample review', 1);