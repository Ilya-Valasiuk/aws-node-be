import { S3 } from 'aws-sdk';

import { createSuccessResponse, createErrorResponse } from '../../../utils/api-response';
import { BadRequestError, InternalServerRequestError } from '../../../helpers/errors';

const s3 = new S3({ apiVersion: '2006-03-01', signatureVersion: 'v4' });

export const handler = async (event) => {
  const queryParams = event.queryStringParameters;

  if (!queryParams.name) {
    return createErrorResponse(new BadRequestError('Name was not passed.'))
  }

  try {
    const params = {
      Bucket: process.env.UPLOAD_BUCKET_NAME,
      Key: `uploaded/${queryParams.name}`,
    };

    await s3.putObject(params).promise();

    const url = s3.getSignedUrl('putObject', { ...params, Expires: 60 });

    return createSuccessResponse({ url })
  } catch (error) {
    return createErrorResponse(new InternalServerRequestError('Something failed. Take a look at logs.'))
  }
}
