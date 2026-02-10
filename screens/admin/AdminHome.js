import { useState } from "react";
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-toast-message";
import { colors, fontSize, fontWeight, borderRadius, spacing } from "../../theme";
import { supabase } from "../../utils/supabase";

const AdminHome = ({ navigation }) => {
   const [isLoading, setIsLoading] = useState(false);

   const handleLogout = async () => {
      setIsLoading(true);
      try {
         const { error } = await supabase.auth.signOut();
         if (error) {
            Toast.show({ type: "error", text1: "Logout failed" });
         } else {
            Toast.show({ type: "success", text1: "Logged out" });
         }
      } finally {
         setIsLoading(false);
      }
   };

   const confirmLogout = () => {
      if (Platform.OS === "web") {
         handleLogout();
         return;
      }
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
         <View style={styles.header}>
            <MaterialIcons name="admin-panel-settings" size={28} color={colors.textLight} />
            <Text style={styles.title}>Admin Dashboard</Text>
         </View>
         <View style={styles.actions}>
            <TouchableOpacity
               style={styles.card}
               onPress={() => navigation.navigate("ManageMenu")}
            >
               <Text style={styles.cardTitle}>Manage Menu</Text>
            </TouchableOpacity>
            <TouchableOpacity
               style={styles.card}
               onPress={() => navigation.navigate("AllOrders")}
            >
               <Text style={styles.cardTitle}>All Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity
               style={styles.card}
               onPress={() => navigation.navigate("Settings")}
            >
               <Text style={styles.cardTitle}>Settings</Text>
            </TouchableOpacity>
         </View>
         <View style={styles.footer}>
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
      backgroundColor: colors.backgroundGray,
   },
   header: {
      backgroundColor: colors.primary,
      padding: spacing.lg,
      flexDirection: "row",
      alignItems: "center",
   },
   title: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.textLight,
      marginLeft: spacing.sm,
   },
   actions: {
      flex: 1,
      padding: spacing.lg,
   },
   card: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
   },
   cardTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.textPrimary,
   },
   footer: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
   },
   logoutButton: {
      width: "100%",
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
   },
   logoutButtonText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.textPrimary,
      textAlign: "center",
   },
});

export default AdminHome;
