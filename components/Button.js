import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors, fontSize, fontWeight, borderRadius, spacing } from "../theme";

const Button = ({ onPress, title, style, variant = "primary", disabled = false }) => {
   const buttonStyle = [
      styles.button,
      variant === "secondary" && styles.buttonSecondary,
      variant === "outline" && styles.buttonOutline,
      disabled && styles.buttonDisabled,
      style,
   ];

   const textStyle = [
      styles.text,
      variant === "outline" && styles.textOutline,
      disabled && styles.textDisabled,
   ];

   return (
      <TouchableOpacity
         style={buttonStyle}
         onPress={onPress}
         disabled={disabled}
         activeOpacity={0.7}
      >
         <Text style={textStyle}>{title}</Text>
      </TouchableOpacity>
   );
};

const styles = StyleSheet.create({
   button: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 48,
   },
   buttonSecondary: {
      backgroundColor: colors.secondary,
   },
   buttonOutline: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: colors.primary,
   },
   buttonDisabled: {
      backgroundColor: colors.textMuted,
      opacity: 0.5,
   },
   text: {
      color: colors.textLight,
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
   },
   textOutline: {
      color: colors.primary,
   },
   textDisabled: {
      color: colors.textSecondary,
   },
});

export default Button;
