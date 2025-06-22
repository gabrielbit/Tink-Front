import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
}: ButtonProps) => {
  const theme = useTheme<Theme>();

  const backgroundColor = 
    variant === 'primary' 
      ? theme.colors.primary
      : 'transparent';
  
  const textColor = 
    variant === 'primary'
      ? theme.colors.white
      : theme.colors.primary;

  const buttonStyle = [
    styles.button,
    { backgroundColor },
    variant === 'secondary' && { borderColor: theme.colors.primary, borderWidth: 1 },
    disabled && styles.disabledButton,
  ];

  const textStyle = [
    styles.text,
    { color: textColor },
    disabled && styles.disabledText,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    opacity: 0.5,
  },
}); 