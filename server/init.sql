CREATE TABLE papers (
  ID SERIAL PRIMARY KEY,
  uid VARCHAR(30),
  title TEXT,
  pubmed_id VARCHAR(30),
  authors TEXT,
  url TEXT,
  pub_date DATE
);
