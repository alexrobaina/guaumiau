export interface IForgotPasswordFormProps {
  onSubmit: (email: string) => void;
  isLoading?: boolean;
  error?: string;
  success?: boolean;
}

export interface IForgotPasswordFormState {
  email: string;
  errors: {
    email?: string;
  };
}
