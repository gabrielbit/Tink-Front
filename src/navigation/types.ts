import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

export type Props = NativeStackScreenProps<RootStackParamList>; 