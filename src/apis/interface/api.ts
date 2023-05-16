export interface IRegisterForm {
  email: string;
  password: string;
}

export interface IRegisterResponse {
  user: {
    token: string;
  };
}
