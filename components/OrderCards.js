import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, fontSize, fontWeight, borderRadius, spacing, shadows } from "../theme";

const OrderCards = ({ orders, navigator, onPressRoute = "OrderInfo" }) => {
   const formattedDate = (date) => {
      const formatted = new Date(date).toLocaleString("en-GB", {
         day: "2-digit",
         month: "2-digit",
         year: "numeric",
         hour: "2-digit",
         minute: "2-digit",
         hour12: true,
      });
      return formatted;
   };

   const getStatusIcon = (status) => {
      switch (status) {
         case "completed":
            return "check-circle";
         case "cancelled":
            return "cancel";
         case "cooking":
            return "restaurant";
         case "ready":
            return "room-service";
         case "delivered":
            return "delivery-dining";
         default:
            return "pending";
      }
   };

   const getStatusColor = (status) => {
      switch (status) {
         case "completed":
            return colors.success;
         case "cancelled":
            return colors.error;
         case "cooking":
            return colors.warning;
         case "ready":
            return colors.info;
         default:
            return colors.primary;
      }
   };

   return (
      <FlatList
         style={styles.list}
         data={orders}
         keyExtractor={(item) => String(item.id)}
         contentContainerStyle={styles.listContent}
         renderItem={({ item }) => (
            <TouchableOpacity
               onPress={() => navigator.navigate(onPressRoute, { item })}
               style={
                  item.order_status === "completed" ||
                  item.order_status === "cancelled"
                     ? styles.orderInactive
                     : styles.orderActive
               }
            >
               <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>
                     Order #{item.id.substring(0, 8)}
                  </Text>
                  <MaterialIcons
                     name={getStatusIcon(item.order_status)}
                     size={24}
                     color={getStatusColor(item.order_status)}
                  />
               </View>
               <Text style={styles.metaText}>
                  Placed on {formattedDate(item.created_at)}
               </Text>
               <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Status:</Text>
                  <Text style={[styles.statusText, { color: getStatusColor(item.order_status) }]}>
                     {item.order_status}
                  </Text>
               </View>
               <Text style={styles.metaText}>{item.delivery_mode}</Text>
            </TouchableOpacity>
         )}
      />
   );
};

const styles = StyleSheet.create({
   list: {
      flex: 1,
      backgroundColor: colors.backgroundGray,
   },
   listContent: {
      paddingVertical: spacing.md,
   },
   orderActive: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginVertical: spacing.sm,
      marginHorizontal: spacing.md,
      ...shadows.md,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
   },
   orderInactive: {
      backgroundColor: colors.backgroundGray,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginVertical: spacing.sm,
      marginHorizontal: spacing.md,
      ...shadows.sm,
      borderLeftWidth: 4,
      borderLeftColor: colors.textMuted,
      opacity: 0.7,
   },
   orderHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.xs,
   },
   orderId: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.textPrimary,
   },
   metaText: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      marginTop: spacing.xs,
   },
   statusRow: {
      flexDirection: "row",
      marginTop: spacing.xs,
   },
   statusLabel: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      color: colors.textSecondary,
      marginRight: spacing.xs,
   },
   statusText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      textTransform: "capitalize",
   },
});

export default OrderCards;
