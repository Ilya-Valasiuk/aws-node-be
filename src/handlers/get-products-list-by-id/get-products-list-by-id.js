import { validate as uuidValidate } from 'uuid';
import { BadRequestError, NotFoundRequestError, InternalServerRequestError } from '../../helpers/errors';
import { createErrorResponse, createSuccessResponse } from '../../utils/api-response';
import { CAR_PRODUCTS } from "../../mocks/products";
import { pool } from './../../service/postgres';

let client;

const PRODUCT_BY_ID_SQL = 'SELECT id, title, description, price, count FROM products INNER JOIN stocks ON id = product_id WHERE id = $1'

export const handler = async (event) => {
  const { id } = event.pathParameters;

  console.log(`Requested product id ${id}`);

  if (!uuidValidate(id)) {
    return createErrorResponse(new BadRequestError('Invalid id params'));
  }

  client = await pool.connect();

  try {
    const query = await client.query({ text: PRODUCT_BY_ID_SQL, values: [id] });

    if (!query.rowCount) {
      return createErrorResponse(new NotFoundRequestError(`Product with ${id} not found`));
    }

    return createSuccessResponse({ product: query.rows[0] });

  } catch (error) {
    return createErrorResponse(new InternalServerRequestError('Something failes.'))
  } finally {
    client.release();
  }
};
