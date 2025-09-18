export interface UserJwtPayload {
  id: string;
  email: string;
  username: string;
  roles: string[];
  refreshToken: string;
  iat?: number;
  exp?: number;
}
