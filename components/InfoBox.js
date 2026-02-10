import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, fontSize, fontWeight, borderRadius, spacing } from "../theme";

const InfoBox = ({ message, type = "info" }) => {
   const getBackgroundColor = () => {
      switch (type) {
         case "warning":
            return "#FFF9E6";
         case "error":
            return "#FFEBEE";
         case "success":
            return "#E8F5E9";
         default:
            return "#E3F2FD";
      }
   };

   const getIconColor = () => {
      switch (type) {
         case "warning":
            return colors.warning;
         case "error":
            return colors.error;
         case "success":
            return colors.success;
         default:
            return colors.info;
      }
   };

   const getIconName = () => {
      switch (type) {
         case "warning":
            return "warning";
         case "error":
            return "error";
         case "success":
            return "check-circle";
         default:
            return "info";
      }
   };

   return (
      <View style={[styles.box, { backgroundColor: getBackgroundColor() }]}>
         <MaterialIcons name={getIconName()} size={24} color={getIconColor()} />
         <Text style={styles.message}>{message}</Text>
      </View>
   );
};

const styles = StyleSheet.create({
   box: {
      width: "90%",
      minHeight: 50,
      alignSelf: "center",
      flexDirection: "row",
      alignItems: "center",
      padding: spacing.md,
      marginVertical: spacing.sm,
      borderRadius: borderRadius.md,
      borderLeftWidth: 4,
      borderLeftColor: colors.info,
   },
   message: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.textPrimary,
      marginLeft: spacing.sm,
      flex: 1,
   },
});

export default InfoBox;
