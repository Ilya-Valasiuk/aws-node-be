
const generateResponse = (principalId, effect, resource) => ({
  principalId,
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: resource
      }
    ]
  }
})

export const handler = (event, context, callback) => {
  console.log(event);

  if (event.type !== 'TOKEN') {
    callback('Error: Token type missed.');
  }

  const encodedToken = event.authorizationToken.split('Basic ')[1];
  
  if (!encodedToken) {
    callback(null, generateResponse('user', 'Deny', event.methodArn))
  }
  
  const token = Buffer.from(encodedToken, 'base64').toString();
  const [user, password] = token.split(':');

  console.log(token);

  if (user === 'ilyavalasiuk' && password === process.env['ilyavalasiuk']) {
    callback(null, generateResponse('user', 'Allow', event.methodArn))
  } else {
    callback(null, generateResponse('user', 'Deny', event.methodArn))
  }
}
