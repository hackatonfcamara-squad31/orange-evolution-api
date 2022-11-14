export interface UserPayload {
  sub: string;
  email: string;
  name: string;
  is_admin: boolean;
  avatar: string;
  iat?: number;
  exp?: number;
}
