export type UserRole = 'PET_OWNER' | 'SERVICE_PROVIDER';

export interface IRegisterFormProps {
  onSubmit: (
    email: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    userRole: UserRole,
    termsAccepted: boolean,
    address?: string,
    latitude?: number,
    longitude?: number,
    city?: string,
    country?: string,
  ) => void;
  isLoading?: boolean;
  error?: string;
}

export interface IRegisterFormState {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  userRole: UserRole | null;
  termsAccepted: boolean;
  address: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
  errors: {
    email?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
    userRole?: string;
    termsAccepted?: string;
    address?: string;
  };
}
