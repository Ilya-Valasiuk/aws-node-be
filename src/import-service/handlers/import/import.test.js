import * as AWSMock from 'aws-sdk-mock';
import { createSuccessResponse, createErrorResponse } from '../../../utils/api-response';
import { BadRequestError } from '../../../helpers/errors';
import { handler } from './import';

jest.mock('../../../utils/api-response', () => ({
  createSuccessResponse: jest.fn(),
  createErrorResponse: jest.fn(),
}));

describe('import', () => {
  test('should return error if name was not passed', async () => {
    await handler({ queryStringParameters: {} });

    expect(createErrorResponse).toHaveBeenCalledWith(new BadRequestError('Name was not passed.'));
  });

  test('should return signed url', async () => {
    process.env.UPLOAD_BUCKET_NAME = 'test';
    AWSMock.mock('S3', 'putObject', function (params, callback) {
      callback(null, "successfully created object");
    });

    AWSMock.mock('S3', 'getSignedUrl', function (method, params, callback) {
      callback(null, 'https://aws:s3:test.scv');
    });

    await handler({ queryStringParameters: { name: 'test.csv' } });

    expect(createSuccessResponse).toHaveBeenCalledWith({ url: 'https://aws:s3:test.scv' });
  });
});
