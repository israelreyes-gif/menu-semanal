export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const badRequest = (message) => new HttpError(400, message);
export const notFound = (message = 'No encontrado') => new HttpError(404, message);
export const conflict = (message) => new HttpError(409, message);
export const methodNotAllowed = () => new HttpError(405, 'Método no permitido');
