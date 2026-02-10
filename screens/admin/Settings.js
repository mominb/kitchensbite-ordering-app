import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import PageHeader from "../../components/PageHeader";
import { colors, fontSize, fontWeight, borderRadius, spacing } from "../../theme";
import { getGlobalSettings, updateGlobalSettings } from "../../utils/supabase";

const Settings = () => {
   const [availability, setAvailability] = useState();
   const [isLoading, setIsLoading] = useState(false);
   const navigator = useNavigation();

   useFocusEffect(
      useCallback(() => {
         const fetchSettings = async () => {
            const data = await getGlobalSettings();
            setAvailability(data?.[0]?.restaurant_available);
         };
         fetchSettings();
      }, [])
   );

   const handleSaveChanges = async () => {
      setIsLoading(true);
      try {
         await updateGlobalSettings(availability);
         Toast.show({
            type: "success",
            text1: "Settings saved successfully",
         });
      } catch (error) {
         console.log("Error saving settings:", error);
         Toast.show({
            type: "error",
            text1: "Failed to save settings",
         });
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
         <View>
            <PageHeader navigator={navigator} heading="Restaurant Settings" />

            <View style={styles.dropdownContainer}>
               <Text style={styles.heading}>Restaurant Availability</Text>
               <Dropdown
                  style={styles.dropdown}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Status"
                  value={availability}
                  onChange={(item) => setAvailability(item.value)}
                  data={[
                     { label: "Open", value: true },
                     { label: "Closed", value: false },
                  ]}
               />
            </View>
         </View>

         <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
               <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flexDirection: "column",
      justifyContent: "space-between",
      flex: 1,
      backgroundColor: colors.background,
   },
   footer: {
      paddingBottom: spacing.lg,
   },
   button: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primary,
      marginTop: spacing.md,
   },
   buttonText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.textLight,
      textAlign: "center",
   },
   dropdown: {
      width: "100%",
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: colors.backgroundGray,
      borderColor: colors.border,
      borderWidth: 1,
      marginTop: spacing.xs,
      marginBottom: spacing.md,
   },
   dropdownContainer: {
      marginHorizontal: spacing.lg,
      marginVertical: spacing.md,
   },
   heading: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.textPrimary,
      alignSelf: "flex-start",
      marginBottom: spacing.sm,
   },
});

export default Settings;
