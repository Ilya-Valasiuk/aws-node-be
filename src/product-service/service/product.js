import { v4 as uuidv4 } from 'uuid';

export const createProduct = async (data, client) => {
  try {
    await client.query('BEGIN');
    // Products table
    const queryText = 'INSERT INTO products(id, title, description, price) VALUES($1,$2,$3,$4) RETURNING id';
    const res = await client.query(queryText, [uuidv4(), data.title, data.description || '', data.price || null]);
    // Stocks table
    const insertStocksText = 'INSERT INTO stocks(product_id, count) VALUES ($1, $2)';
    const insertStocksValues = [res.rows[0].id, data.count];
    await client.query(insertStocksText, insertStocksValues);

    await client.query('COMMIT');

    console.log('Product created.');

    return {};
  } catch (error) {
    await client.query('ROLLBACK');
    console.log(error);

    return false; // Error should be returned.
  }
}