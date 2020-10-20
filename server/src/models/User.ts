export type User = {
  authId: string,
  userId: string,
  email: string,
  lastLogin: number,
  [x: string]: any // allow any number of additional properties
}