import { SNS } from 'aws-sdk';
import axios from 'axios';

export const handler = async (event) => {
  const sns = new SNS();

  try {
    for (const record of event.Records) {
      console.log(record);
      const body = JSON.parse(record.body);

      const response = await axios.post('https://rm4cc318y5.execute-api.us-east-1.amazonaws.com/dev/product', body)

      console.log('Product created.');

      sns.publish({
        Subject: 'New product created',
        Message: JSON.stringify(body),
        MessageAttributes: {
          title: {
            DataType: 'String',
            StringValue: body.title
          }
        },
        TopicArn: process.env.SNS_ARN
      }, (error, data) => {
        if (error) {
          console.log(`Error for send email: ${error}`);
        } else {
          console.log(`Send email with ${body}`);
          console.log(data);
        }
      })
    }

    return { statusCode: 202 };
  } catch (error) {
    console.log(error);

    return { statusCode: 500 };
  }
}
