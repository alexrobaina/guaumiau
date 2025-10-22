export interface IRegisterFormProps {
  onSubmit: (email: string, username: string, password: string) => void;
  isLoading?: boolean;
  error?: string;
}

export interface IRegisterFormState {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  errors: {
    email?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
  };
}
