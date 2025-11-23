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
  MyBookings: undefined;
  BookingDetail: { bookingId: string };
  Settings: undefined;
  MyAccount: undefined;
  EditProfile: undefined;
  ProviderProfile: { providerId: string };
  SearchWalkers: undefined;
  PetProfile: { petId: string };
  Booking: { providerId: string };
  Payment: { booking: any };
};

export type RootStackParamList = MainStackParamList & AuthStackParamList;
