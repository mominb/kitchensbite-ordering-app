import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageHeader from "../../components/PageHeader";
import OrderItemList from "../../components/OrderItemList";
import InfoBox from "../../components/InfoBox";
import { colors, fontSize, fontWeight, spacing } from "../../theme";

const OrderInfo = ({ navigation, route }) => {
   const order = route.params?.item;
   const orderItems = order?.order_items || [];

   const formattedDate = (date) => {
      return new Date(date).toLocaleString("en-GB", {
         day: "2-digit",
         month: "2-digit",
         year: "numeric",
         hour: "2-digit",
         minute: "2-digit",
         hour12: true,
      });
   };

   return (
      <SafeAreaView style={styles.container}>
         <PageHeader navigator={navigation} heading="Order Details" />

         <InfoBox message={`Status: ${order?.order_status || "pending"}`} type="info" />
         <InfoBox
            message="For any further changes please contact the restaurant"
            type="warning"
         />

         <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <Text style={styles.summaryText}>Order ID: {order?.id?.substring(0, 8)}</Text>
            <Text style={styles.summaryText}>Placed: {formattedDate(order?.created_at)}</Text>
            <Text style={styles.summaryText}>Delivery: {order?.delivery_mode}</Text>
            <Text style={styles.summaryText}>Payment: {order?.payment_mode}</Text>
         </View>

         <OrderItemList orderItems={orderItems} order={order} />
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.background,
   },
   summaryCard: {
      backgroundColor: colors.background,
      margin: spacing.md,
      padding: spacing.md,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
   },
   summaryTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
   },
   summaryText: {
      fontSize: fontSize.md,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
   },
});

export default OrderInfo;
