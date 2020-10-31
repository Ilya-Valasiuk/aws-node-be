import { createSuccessResponse } from '../../utils/api-response';
import { handler } from './get-products-list';

import { CAR_PRODUCTS } from "../../mocks/products";

jest.mock('../../utils/api-response', () => ({
  createSuccessResponse: jest.fn(),
}));

describe('get-products-list', () => {
  test('should return all items', async () => {
    await handler();

    expect(createSuccessResponse).toHaveBeenCalledWith({ products: CAR_PRODUCTS });
  });
});
