export class GlobalError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'GlobalError';
    this.statusCode = statusCode;
  }
}
