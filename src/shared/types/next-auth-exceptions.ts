import {CredentialsSignin} from 'next-auth';

export class CouldNotParseError extends CredentialsSignin {
  code = "CouldNotParseError";
}

export class InvalidPasswordError extends CredentialsSignin {
  code = "InvalidPasswordError";
}