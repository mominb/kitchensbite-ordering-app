import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fontSize, fontWeight, spacing } from "../theme";

const PageHeader = ({ navigator, heading }) => {
   return (
      <View style={styles.header}>
         <TouchableOpacity onPress={() => navigator.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={colors.textPrimary} />
         </TouchableOpacity>
         <Text style={styles.heading}>{heading}</Text>
      </View>
   );
};

const styles = StyleSheet.create({
   header: {
      justifyContent: "flex-start",
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      minHeight: 60,
   },
   backButton: {
      width: 48,
      height: 48,
      alignItems: "center",
      justifyContent: "center",
   },
   heading: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.textPrimary,
      marginLeft: spacing.sm,
   },
});

export default PageHeader;
