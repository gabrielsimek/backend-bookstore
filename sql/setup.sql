-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS publisher CASCADE;
DROP TABLE IF EXISTS author CASCADE;
DROP TABLE IF EXISTS reviewer CASCADE;
DROP TABLE IF EXISTS book CASCADE;
DROP TABLE IF EXISTS author_book CASCADE;

CREATE TABLE publisher (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255),
    state VARCHAR(255),
    country VARCHAR(255)
);

CREATE TABLE book (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    released INT NOT NULL,
    publisher_id BIGINT NOT NULL,
    FOREIGN KEY (publisher_id) REFERENCES publisher(id)
);



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
