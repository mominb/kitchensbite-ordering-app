import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, fontSize, fontWeight, spacing } from "../theme";

const OtpTimer = ({ sendOTP }) => {
   const [seconds, setSeconds] = useState(0);

   const handleButtonPress = () => {
      setSeconds(30);
      sendOTP();
   };

   useEffect(() => {
      if (seconds === 0) return;
      const timer = setTimeout(() => {
         setSeconds(seconds - 1);
      }, 1000);

      return () => clearTimeout(timer);
   }, [seconds]);

   return (
      <View style={styles.container}>
         {seconds > 0 ? (
            <Text style={styles.resendText}>
               Resend OTP in ({seconds}) seconds
            </Text>
         ) : (
            <TouchableOpacity onPress={handleButtonPress}>
               <Text style={styles.sendText}>Send OTP</Text>
            </TouchableOpacity>
         )}
      </View>
   );
};

export default OtpTimer;

const styles = StyleSheet.create({
   container: {
      alignSelf: "center",
      marginBottom: spacing.sm,
   },
   sendText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.primary,
   },
   resendText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.textSecondary,
   },
});
