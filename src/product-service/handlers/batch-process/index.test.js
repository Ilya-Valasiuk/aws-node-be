import * as AWSMock from 'aws-sdk-mock';
import { createProduct } from './../../service/product';
import { handler } from './index';

jest.mock('./../../service/product', () => ({
  createProduct: jest.fn(),
}))

jest.mock('./../../service/postgres', () => ({
  pool: {
    connect: () => ({ release: jest.fn() })
  }
}))

describe('batch-process', () => {
  test('should notify sns if product created', async () => {
    AWSMock.mock('SNS', 'publish', () => console.log('message was published'));

    const result = await handler({ Records: [{ body: '{"a": 1}' }, { body: '{"a": 2}' }] });

    expect(createProduct).toHaveBeenCalledTimes(2);

    expect(result.statusCode).toEqual(202);
  });
});
