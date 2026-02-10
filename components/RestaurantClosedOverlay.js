import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, fontSize, fontWeight, borderRadius, spacing } from "../theme";

const RestaurantClosedOverlay = ({ visible }) => {
   if (!visible) return null;

   return (
      <View style={styles.overlay} pointerEvents="auto">
         <View style={styles.card}>
            <MaterialCommunityIcons 
               name="store-off-outline" 
               size={64} 
               color={colors.error} 
               style={styles.icon}
            />
            <Text style={styles.title}>Restaurant is Closed</Text>
            <Text style={styles.message}>
               Ordering is currently unavailable. Please check back later or contact us on WhatsApp.
            </Text>
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
   },
   card: {
      width: "85%",
      maxWidth: 400,
      backgroundColor: colors.background,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      alignItems: "center",
      ...{
         shadowColor: "#000",
         shadowOffset: { width: 0, height: 4 },
         shadowOpacity: 0.3,
         shadowRadius: 6,
         elevation: 10,
      },
   },
   icon: {
      marginBottom: spacing.md,
   },
   title: {
      fontSize: fontSize.xxl,
      fontWeight: fontWeight.bold,
      color: colors.textPrimary,
      textAlign: "center",
      marginBottom: spacing.sm,
   },
   message: {
      fontSize: fontSize.md,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
   },
});

export default RestaurantClosedOverlay;
