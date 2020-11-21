import { createSuccessResponse, createErrorResponse } from '../../../utils/api-response';
import { InternalServerRequestError } from './../../../helpers/errors';
import { pool } from './../../service/postgres';

let client;

const PRODUCTS_SQL = 'SELECT id, title, description, price, count FROM products INNER JOIN stocks ON id = product_id';

export const handler = async () => {
  client = await pool.connect();

  try {
    const query = await client.query(PRODUCTS_SQL);

    return createSuccessResponse({ products: query.rows })
  } catch (error) {
    return createErrorResponse(new InternalServerRequestError('Something failes.'))
  } finally {
    client.release();
  }
}
