export interface userRequest extends userCookie {
  isAdmin: boolean,
  isAuth: boolean,
}
export interface userCookie{
  id: number,
  role: number,
  email: string,
}