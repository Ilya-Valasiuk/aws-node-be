import { S3, SQS } from 'aws-sdk';
import stream from 'stream';
import util from 'util';
import csv from 'csv-parser';

const finished = util.promisify(stream.finished);
const s3 = new S3({ apiVersion: '2006-03-01' });
const sqs = new SQS();

export const handler = async (event) => {
  try {
    for (const record of event.Records) {
      const results = [];
      const params = { Bucket: process.env.UPLOAD_BUCKET_NAME, Key: record.s3.object.key };

      const s3Stream = s3.getObject(params).createReadStream();

      await finished(s3Stream
        .pipe(csv())
        .on('data', (data) => results.push(data))
      )
      console.log(`Data for ${record.s3.object.key}:`)
      console.log(results);

      results.map(item => {
        sqs.sendMessage({
          QueueUrl: process.env.SQS_URL,
          MessageBody: JSON.stringify(item),
        }, (error, data) => {
          if (error) {
            console.log(`Error for Send: ${error}`);
          } else {
            console.log(`Send for:`);
            console.log(item);
            console.log(data);
          }
        })
      })

      await s3.copyObject({
        Bucket: process.env.UPLOAD_BUCKET_NAME,
        CopySource: process.env.UPLOAD_BUCKET_NAME + '/' + record.s3.object.key,
        Key: record.s3.object.key.replace('uploaded', 'parsed')
      }).promise();

      console.log(`${record.s3.object.key} copied`);

      await s3.deleteObject(params).promise();

      console.log(`${record.s3.object.key} deleted`);
    }

    return { statusCode: 202 };
  } catch (error) {
    return { statusCode: 500 };
  }
}
