import httpStatus from 'http-status';

export class APIError extends Error {
  isPublic: boolean;
  status: number;

  constructor(message: string, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    this.isPublic = isPublic;
  }
}
