import { useState } from "react";
import {
   KeyboardAvoidingView,
   ScrollView,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import OtpTimer from "../components/OtpTimer";
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from "../theme";
import { sendEmailOTP, verifyEmailOTP } from "../utils/supabase";
import { appStorage } from "../utils/storage";
import { appName } from "../config";

const Onboarding = () => {
   const [email, setEmail] = useState("");
   const [token, setToken] = useState("");
   const [isOTPFocused, setIsOTPFocused] = useState(false);
   const [isEmailFocused, setIsEmailFocused] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
   const isOTPValid = /^\d{6}$/.test(token);
   const isFormValid = isEmailValid && isOTPValid;

   const sendOTP = async () => {
      await appStorage.setItem("userEmail", email);
      setIsLoading(true);
      try {
         const status = await sendEmailOTP(email);
         if (status === "error") {
            Toast.show({
               type: "error",
               text1: `Unable to send OTP: ${error.message}`,
            });
         } else {
            Toast.show({
               type: "success",
               text1: "Successfully sent OTP to email",
            });
         }
      } finally {
         setIsLoading(false);
      }
   };
   const verifyOTPandLogin = async () => {
      setIsLoading(true);
      try {
         const result = await verifyEmailOTP(email, token);
         if (result.error) {
            console.log(result.error.message);
            Toast.show({
               type: "error",
               text1: `Unable to verify OTP: ${result.error.message}`,
            });
         } else {
            Toast.show({
               type: "success",
               text1: "Successfully verified OTP",
            });
         }
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <SafeAreaView style={styles.container}>
         <Spinner
            visible={isLoading}
            textContent="Loading..."
            textStyle={{ color: colors.textLight }}
         />

         <View style={styles.header}>
            <View style={styles.logoWrap}>
               <MaterialCommunityIcons
                  name="food-fork-drink"
                  size={56}
                  color={colors.textLight}
               />
            </View>
            <Text style={styles.title}>{appName}</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
         </View>

         <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.inputGroup}>
               <Text style={styles.label}>Email</Text>
               <TextInput
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  style={[styles.input, isEmailFocused && styles.inputFocused]}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="you@example.com"
                  placeholderTextColor={colors.textMuted}
               />
            </View>
            <OtpTimer sendOTP={sendOTP} />

            <View style={styles.inputGroup}>
               <Text style={styles.label}>OTP</Text>
               <TextInput
                  onFocus={() => setIsOTPFocused(true)}
                  onBlur={() => setIsOTPFocused(false)}
                  style={[styles.input, isOTPFocused && styles.inputFocused]}
                  value={token}
                  onChangeText={setToken}
                  keyboardType="number-pad"
                  placeholder="000000"
                  placeholderTextColor={colors.textMuted}
                  maxLength={6}
               />
            </View>
         </ScrollView>

         <KeyboardAvoidingView behavior="padding" style={styles.footer}>
            <TouchableOpacity
               style={[styles.button, !isFormValid && styles.buttonDisabled]}
               disabled={!isFormValid}
               onPress={() => verifyOTPandLogin(email, token)}
            >
               <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
         </KeyboardAvoidingView>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.background,
   },
   header: {
      alignItems: "center",
      paddingTop: spacing.xl,
      paddingBottom: spacing.lg,
      backgroundColor: colors.primary,
      borderBottomLeftRadius: borderRadius.xl,
      borderBottomRightRadius: borderRadius.xl,
   },
   logoWrap: {
      width: 112,
      height: 112,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.primaryDark,
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: colors.textLight,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.md,
   },
   title: {
      fontSize: fontSize.xxxl,
      fontWeight: fontWeight.bold,
      color: colors.textLight,
      marginBottom: spacing.xs,
   },
   subtitle: {
      fontSize: fontSize.md,
      color: colors.textLight,
      fontWeight: fontWeight.medium,
      opacity: 0.9,
   },
   content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
   },
   inputGroup: {
      marginBottom: spacing.md,
   },
   label: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
   },
   input: {
      height: 52,
      width: "100%",
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.card,
      fontSize: fontSize.md,
      color: colors.textPrimary,
   },
   inputFocused: {
      borderColor: colors.primary,
      ...shadows.sm,
   },
   footer: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
   },
   button: {
      width: "100%",
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 52,
      ...shadows.md,
   },
   buttonDisabled: {
      opacity: 0.5,
   },
   buttonText: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.textLight,
   },
});

export default Onboarding;
