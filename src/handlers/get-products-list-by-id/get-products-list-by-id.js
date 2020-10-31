import { BadRequestError, NotFoundRequestError } from '../../helpers/errors';
import { createErrorResponse, createSuccessResponse } from '../../utils/api-response';

import { CAR_PRODUCTS } from "../../mocks/products";

export const handler = async (event) => {
  const { id } = event.pathParameters;

  if (isNaN(id) || id < 0) { // simple check for sandbox project.
    return createErrorResponse(new BadRequestError('Invalid id params'));
  }

  const product = CAR_PRODUCTS.find(product => product.id === +id);

  if (!product) {
    return createErrorResponse(new NotFoundRequestError(`Product with ${id} not found`));
  }


  return createSuccessResponse({ product })
};
