import axios from 'axios';
import * as AWSMock from 'aws-sdk-mock';
import { handler } from './index';

jest.mock('axios')

describe('batch-process', () => {
  test('should notify sns if product created', async () => {
    const data = { success: true };
    axios.post.mockImplementationOnce(() => Promise.resolve(data));

    AWSMock.mock('SNS', 'publish', () => console.log('message was published'));

    const result = await handler({ Records: [{ body: '{"a": 1}' }, { body: '{"a": 2}' }] });

    expect(result.statusCode).toEqual(202);
  });
});
