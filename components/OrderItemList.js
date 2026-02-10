import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fontSize, fontWeight, borderRadius, spacing } from "../theme";
import { getGlobalSettings } from "../utils/supabase";
import ItemSeperator from "./ItemSeperator";

const OrderItemList = ({ orderItems, order }) => {
   const [currency, setCurrency] = useState();

   useEffect(() => {
      const fetchSettings = async () => {
         const globalSettings = await getGlobalSettings();
         setCurrency(globalSettings?.[0]?.currency_code);
      };
      fetchSettings();
   }, []);

   const formatCurrency = (value) =>
      currency ? `${value} ${currency}` : `Rs ${value}`;

   return (
      <View style={styles.orderDetailsContainer}>
         <Text style={styles.subHeading}>Order Items</Text>

         {orderItems.map((item, index) => (
            <View key={item.id ?? item.item_id ?? index}>
               <View style={styles.itemContainer}>
                  <View style={styles.itemInfoContainer}>
                     <Text style={styles.itemText}>{item.quantity}x</Text>
                     <Text style={styles.itemTextName}>{item.name}</Text>
                  </View>
                  {item.price && (
                     <Text style={styles.itemPrice}>
                        {formatCurrency(item.price.toFixed(2))}
                     </Text>
                  )}
               </View>
               {index !== orderItems.length - 1 && <ItemSeperator />}
            </View>
         ))}

         <ItemSeperator />

         <View style={styles.totalAmountContainer}>
            <Text style={styles.totalAmountText}>Total</Text>
            <Text style={styles.totalAmountText}>
               {formatCurrency(Number(order.total_price).toFixed(2))}
            </Text>
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   orderDetailsContainer: {
      padding: spacing.md,
      margin: spacing.md,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.background,
   },
   subHeading: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
   },
   itemContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: spacing.xs,
   },
   itemInfoContainer: {
      flexDirection: "row",
      flex: 1,
   },
   itemText: {
      fontSize: fontSize.md,
      color: colors.textSecondary,
      marginRight: spacing.sm,
      fontWeight: fontWeight.semibold,
   },
   itemTextName: {
      fontSize: fontSize.md,
      color: colors.textPrimary,
      flex: 1,
   },
   itemPrice: {
      fontSize: fontSize.md,
      color: colors.textPrimary,
      fontWeight: fontWeight.medium,
   },
   totalAmountContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: spacing.sm,
   },
   totalAmountText: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.primary,
   },
});

export default OrderItemList;
