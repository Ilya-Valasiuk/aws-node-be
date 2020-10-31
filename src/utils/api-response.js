export const createSuccessResponse = (data) => ({
  statusCode: 200,
  body: JSON.stringify(
    data,
    null,
    2
  ),
});


export const defaultErrorStatusCode = 500;
export const defaultErrorName = 'Error';
export const defaultErrorMessage = 'Error has happened';

export const createErrorResponse = (error) => {
  const statusCode = error.statusCode || defaultErrorStatusCode;
  const errorName = error.name || defaultErrorName;
  const errorMessage = error.message || defaultErrorMessage;

  const body = {
    statusCode, // left here just to be comfortable
    error: {
      name: errorName,
      message: errorMessage,
    },
  };

  return {
    statusCode,
    body: JSON.stringify(body, null, 2),
  };
};