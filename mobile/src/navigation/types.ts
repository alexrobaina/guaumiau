export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  VerifyEmail: { email: string };
  ResetPassword?: { token: string };
};

export type MainStackParamList = {
  WalkerHome: undefined;
  Schedule: undefined;
  Achievements: undefined;
  Profile: undefined;
  MyPets: undefined;
  Settings: undefined;
  MyAccount: undefined;
  ProviderProfile: { providerId: string };
  SearchWalkers: undefined;
  PetProfile: { petId: string };
};
