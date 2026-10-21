export class ServerActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ServerActionError";
  }
}

export class AuthorizationError extends ServerActionError {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}
