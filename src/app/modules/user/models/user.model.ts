export enum UserType {
  Administrator = 'administrator',
  Driver = 'driver',
}

export interface UserModel {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  type: UserType;
  password: string;
  confirmPassword: string;
}
