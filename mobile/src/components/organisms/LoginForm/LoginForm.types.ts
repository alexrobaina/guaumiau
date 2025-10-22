export interface ILoginFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
  error?: string;
}

export interface ILoginFormState {
  email: string;
  password: string;
  errors: {
    email?: string;
    password?: string;
  };
}
