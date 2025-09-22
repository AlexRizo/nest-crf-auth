export interface UserJwtPayload {
  id: string;
  email: string;
  username: string;
  role: string;
  refreshToken: string;
  iat?: number;
  exp?: number;
}
