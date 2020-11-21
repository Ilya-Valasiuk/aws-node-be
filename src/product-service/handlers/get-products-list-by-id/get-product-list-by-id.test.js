import { createErrorResponse, createSuccessResponse } from '../../utils/api-response';
import { BadRequestError, NotFoundRequestError } from '../../helpers/errors';

import { handler } from './get-products-list-by-id';

import { CAR_PRODUCTS } from "../../mocks/products";

jest.mock('../../utils/api-response', () => ({
  createSuccessResponse: jest.fn(),
  createErrorResponse: jest.fn(),
}));

describe('get-products-list-by-id', () => {
  test('should return specific item', async () => {
    await handler({ pathParameters: { id: 1 } });

    expect(createSuccessResponse).toHaveBeenCalledWith({ product: CAR_PRODUCTS.find(item => item.id === 1) });
  });

  test('should return 404 error if item not found', async () => {
    await handler({ pathParameters: { id: 30 } });

    expect(createErrorResponse).toHaveBeenCalledWith(new NotFoundRequestError('Product with 30 not found'));
  });

  test('should return 400 error if bad requests params', async () => {
    await handler({ pathParameters: { id: 'NaN' } });

    expect(createErrorResponse).toHaveBeenCalledWith(new BadRequestError('Invalid id params'));
  });
});
