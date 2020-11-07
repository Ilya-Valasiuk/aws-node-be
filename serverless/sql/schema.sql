CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY,
  title text NOT NULL,
  description text,
  price integer
);

CREATE TABLE IF NOT EXISTS stocks (
  product_id uuid REFERENCES products,
  count integer
);