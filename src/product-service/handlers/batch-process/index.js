import { SNS } from 'aws-sdk';
import { pool } from './../../service/postgres';
import { createProduct } from './../../service/product';

export const handler = async (event) => {
  const sns = new SNS();

  const client = await pool.connect();

  try {
    for (const record of event.Records) {
      console.log(record);
      const data = JSON.parse(record.body);

      const newProduct = await createProduct(data, client);

      if (newProduct) {
        sns.publish({
          Subject: 'New product created',
          Message: JSON.stringify(data),
          MessageAttributes: {
            title: {
              DataType: 'String',
              StringValue: data.title
            }
          },
          TopicArn: process.env.SNS_ARN
        }, (error, data) => {
          if (error) {
            console.log(`Error for send email: ${error}`);
          } else {
            console.log(`Send email for ${data.title}`);
          }
        })
      }
    }

    return { statusCode: 202 };
  } catch (error) {
    console.log(error);

    return { statusCode: 500 };
  } finally {
    client.release();
  }
}
