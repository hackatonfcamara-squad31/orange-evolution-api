export interface UserPayload {
  sub: string;
  email: string;
  name: string;
  is_admin: boolean;
  iat?: number;
  exp?: number;
}
