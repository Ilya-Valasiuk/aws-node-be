import { S3 } from 'aws-sdk';

import { createSuccessResponse, createErrorResponse } from '../../../utils/api-response';
import { BadRequestError, InternalServerRequestError } from '../../../helpers/errors';


export const handler = async (event) => {
  const queryParams = event.queryStringParameters;

  if (!queryParams.name) {
    return createErrorResponse(new BadRequestError('Name was not passed.'))
  }

  const s3 = new S3({ apiVersion: '2006-03-01', signatureVersion: 'v4' });

  try {
    const params = {
      Bucket: process.env.UPLOAD_BUCKET_NAME,
      Key: `uploaded/${queryParams.name}`,
    };

    await s3.putObject(params).promise();

    const url = await s3.getSignedUrlPromise('putObject', { ...params, Expires: 60 });

    return createSuccessResponse({ url })
  } catch (error) {
    console.log(error);
    return createErrorResponse(new InternalServerRequestError('Something failed. Take a look at logs.'))
  }
}
