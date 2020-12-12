import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Request } from 'express';

const cache = {};

const TWO_MINUTES = 120000;

@Injectable()
export class AppService {
  async handleRequest(req: Request): Promise<{statusCode: number, response: {}}> {
    console.log('original url ', req.originalUrl);
    console.log('method ', req.method);
    console.log('body ', req.body);

    const recipient = req.originalUrl.split('/')[1];
    console.log('recipient ', recipient);

    const recipientUrl = process.env[recipient];
    console.log('recipientUrl: ', recipientUrl);

    
    if (recipientUrl) {
      const axiosConfig = {
        method: req.method,
        url: `${recipientUrl}${req.originalUrl}`,
        ...(Object.keys(req.body || {}).length > 0 && { data: req.body })
      } as any;
      
      console.log(axiosConfig);
      console.log('Cache: ', cache);

      if (cache[axiosConfig.url] && axiosConfig.method === 'GET' && Date.now() < cache[axiosConfig.url].created + cache[axiosConfig.url].ttl) {
        console.log('Response from cache');
        return {
          statusCode: 304,
          response: cache[axiosConfig.url].data
        }
      }

      try {
        const response = await axios(axiosConfig);

        console.log('response from recipient: ', response.data);  

        cache[axiosConfig.url] = { data: response.data, created: Date.now(), ttl: TWO_MINUTES }

        return {
          statusCode: 200,
          response: response.data
        }
      } catch (error) {
        console.log('error from recipient: ', JSON.stringify(error));

        if (error.response) {
          const { status, data } = error.response;
  
          return {
            statusCode: status,
            response: data
          }
        }
      }
      

    } else {
      return {
        statusCode: 502,
        response: 'Cannot process request.'
      }
    }
  }
}
