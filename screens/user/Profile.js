import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
   Alert,
   Keyboard,
   KeyboardAvoidingView,
   ScrollView,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
   Platform,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import PageHeader from "../../components/PageHeader";
import { colors, fontSize, fontWeight, borderRadius, spacing } from "../../theme";
import { getUserData, supabase, updateUserData } from "../../utils/supabase";

const Profile = ({ refreshUserInfo, deleteUserCart, session }) => {
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [phone, setPhone] = useState("");
   const [isNameFocused, setIsNameFocused] = useState(false);
   const [isEmailFocused, setIsEmailFocused] = useState(false);
   const [isPhoneFocused, setIsPhoneFocused] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   const navigator = useNavigation();

   useEffect(() => {
      if (!session) {
         navigator.navigate("Onboarding");
         return;
      }

      const loadUserData = async () => {
         setIsLoading(true);
         try {
            const userDataPromise = getUserData();
            const timeoutPromise = new Promise((resolve) =>
               setTimeout(() => resolve({ error: new Error("Timeout") }), 8000)
            );
            const userData = await Promise.race([userDataPromise, timeoutPromise]);
            
            if (!userData?.error) {
               const user = userData.data?.user;
               if (user) {
                  setName(user.user_metadata?.displayName ?? "");
                  setEmail(user.user_metadata?.email ?? "");
                  setPhone(user.user_metadata?.phone ?? "");
               }
            }
         } catch (err) {
            console.error("Error loading user data:", err);
         } finally {
            setIsLoading(false);
         }
      };
      loadUserData();
   }, [session]);

   const handleSaveInfo = async () => {
      if (!name || !phone) {
         Toast.show({
            type: "error",
            text1: "Name and phone required",
         });
         return;
      }

      setIsLoading(true);
      try {
         await updateUserData({
            phone: phone,
            email: email,
            displayName: name,
         });
         setIsLoading(false);
         Keyboard.dismiss();
         Toast.show({
            type: "success",
            text1: "Information updated",
         });
         refreshUserInfo();
      } catch (error) {
         console.log("Error saving user info:", error);
         Toast.show({
            type: "error",
            text1: "Failed to update information",
         });
      }
   };

   const handleLogout = async () => {
      setIsLoading(true);
      try {
         const { error } = await supabase.auth.signOut();
         if (error) {
            Toast.show({ type: "error", text1: "Logout failed" });
         } else {
            Toast.show({ type: "success", text1: "Logged out" });
         }
         await deleteUserCart();
      } finally {
         setIsLoading(false);
      }
   };

   const confirmLogout = () => {
      Alert.alert(
         "Log out",
         "Are you sure you want to log out?",
         [
            { text: "Cancel", style: "cancel" },
            { text: "Logout", style: "destructive", onPress: handleLogout },
         ],
         { cancelable: true }
      );
   };

   return (
      <SafeAreaView style={styles.container}>
         <Spinner
            visible={isLoading}
            textContent="Loading..."
            textStyle={{ color: colors.textLight }}
         />
         <PageHeader navigator={navigator} heading="Profile" />
         <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.content}
         >
            <ScrollView>
               <View style={styles.form}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                     onFocus={() => setIsNameFocused(true)}
                     onBlur={() => setIsNameFocused(false)}
                     style={[styles.input, isNameFocused && styles.inputFocused]}
                     value={name}
                     onChangeText={setName}
                     placeholder="Your name"
                     placeholderTextColor={colors.textMuted}
                  />

                  <Text style={styles.label}>Email</Text>
                  <TextInput
                     keyboardType="email-address"
                     autoCapitalize="none"
                     onFocus={() => setIsEmailFocused(true)}
                     onBlur={() => setIsEmailFocused(false)}
                     style={[styles.input, isEmailFocused && styles.inputFocused]}
                     value={email}
                     onChangeText={setEmail}
                     placeholder="name@example.com"
                     placeholderTextColor={colors.textMuted}
                  />

                  <Text style={styles.label}>Phone</Text>
                  <TextInput
                     keyboardType="phone-pad"
                     onFocus={() => setIsPhoneFocused(true)}
                     onBlur={() => setIsPhoneFocused(false)}
                     style={[styles.input, isPhoneFocused && styles.inputFocused]}
                     value={phone}
                     onChangeText={setPhone}
                     placeholder="+92 3XX XXXXXXX"
                     placeholderTextColor={colors.textMuted}
                  />
               </View>
            </ScrollView>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveInfo}>
               <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
         </KeyboardAvoidingView>
         <View>
            <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
               <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.background,
   },
   content: {
      flex: 1,
   },
   form: {
      padding: spacing.md,
   },
   label: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
   },
   input: {
      height: 52,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.md,
      backgroundColor: colors.background,
      color: colors.textPrimary,
   },
   inputFocused: {
      borderColor: colors.primary,
   },
   saveButton: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primary,
      marginBottom: spacing.md,
   },
   saveButtonText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.textLight,
      textAlign: "center",
   },
   logoutButton: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: colors.error,
      marginBottom: spacing.lg,
   },
   logoutButtonText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.textLight,
      textAlign: "center",
   },
});

export default Profile;
