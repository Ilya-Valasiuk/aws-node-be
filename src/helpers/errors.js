export const ERROR_NAMES = {
  BAD_REQUEST: 'BAD_REQUEST',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_SERVER: 'INTERNAL_SERVER',
}

export const ERROR_STATUS_CODES = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
}

export class CustomApiError extends Error {
  constructor(statusCode = 500, name = 'Error', message = 'Error has happened') {
    super();
    this.statusCode = statusCode;
    this.name = name;
    this.message = message;
  }
}

export class BadRequestError extends CustomApiError {
  constructor(message) {
    super(ERROR_STATUS_CODES.BAD_REQUEST, ERROR_NAMES.BAD_REQUEST, message);
  }
}

export class InternalServerRequestError extends CustomApiError {
  constructor(message) {
    super(ERROR_STATUS_CODES.INTERNAL_SERVER, ERROR_NAMES.INTERNAL_SERVER, message);
  }
}

export class NotFoundRequestError extends CustomApiError {
  constructor(message) {
    super(ERROR_STATUS_CODES.NOT_FOUND, ERROR_NAMES.NOT_FOUND, message);
  }
}
