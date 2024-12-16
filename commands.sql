CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url text NOT NULL,
    title text NOT NULL,
    likes INT DEFAULT 0,
    date TIMESTAMP WITH TIME ZONE
);

INSERT INTO blogs (author, url, title, likes) VALUES ('Axel', 'sey.com', 'Book ko', 23);
INSERT INTO blogs (author, url, title, likes) VALUES ('Elknirk', 'krinkle.com', 'Book ni Elkrnirk', 1);