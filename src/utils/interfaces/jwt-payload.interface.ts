export interface JwtPayload {
  sub: string;
  email: string;
  type: 'access' | 'refresh';
  jti: 'token-id';
}
