import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Projects: undefined;
  ONGs: undefined;
  Home: undefined;
};

export type Props = NativeStackScreenProps<RootStackParamList>; 