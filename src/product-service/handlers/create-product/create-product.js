import { v4 as uuidv4 } from 'uuid';
import { createSuccessResponse, createErrorResponse } from '../../../utils/api-response';
import { BadRequestError, InternalServerRequestError } from '../../../helpers/errors';
import { pool } from './../../service/postgres';

let client;

export const handler = async (event) => {
  console.log(`Event body: ${event.body}`);

  const data = JSON.parse(event.body);

  if (!data) {
    return createErrorResponse(new BadRequestError('Empty body'))
  }

  client = await pool.connect();

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

    return createSuccessResponse({ succcess: true })
  } catch (error) {
    await client.query('ROLLBACK');

    console.log(error);

    return createErrorResponse(new InternalServerRequestError('Something failed. Take a look at logs.'))
  } finally {
    client.release();
  }
}
