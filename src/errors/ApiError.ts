export class ApiError<T = any> extends Error {
  public status?: number;
  public data?: T;

  constructor(message: string, status?: number, data?: T) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}
