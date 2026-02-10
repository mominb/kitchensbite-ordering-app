import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import OrderItemList from "../../components/OrderItemList";
import PageHeader from "../../components/PageHeader";
import { colors, fontSize, fontWeight, borderRadius, spacing } from "../../theme";
import { updateOrderStatus } from "../../utils/supabase";

const ManageOrder = ({ route }) => {
   const statusUpdateOptions = [
      { label: "Pending", value: "pending" },
      { label: "Confirmed", value: "confirmed" },
      { label: "Completed", value: "completed" },
      { label: "Cancelled", value: "cancelled" },
   ];

   const navigator = useNavigation();
   const { item: order } = route.params;
   const orderItems = order.order_items || [];
   const [statusUpdate, setStatusUpdate] = useState(order.order_status);
   const [isLoading, setIsLoading] = useState(false);

   const formattedDate = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleString("en-GB", {
         day: "2-digit",
         month: "2-digit",
         year: "numeric",
         hour: "2-digit",
         minute: "2-digit",
         hour12: true,
      });
   };

   const handleUpdate = async () => {
      setIsLoading(true);
      try {
         const res = await updateOrderStatus(statusUpdate, order.id);
         if (res?.error) {
            Toast.show({ type: "error", text1: "Update failed" });
         } else {
            Toast.show({ type: "success", text1: "Order updated" });
            navigator.goBack();
         }
      } catch (error) {
         console.log(error);
         Toast.show({ type: "error", text1: "Update failed" });
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
         <PageHeader navigator={navigator} heading="Order" />
         <View style={styles.dropdownContainer}>
            <Text style={styles.subHeading}>Status</Text>
            <Dropdown
               style={styles.dropdown}
               data={statusUpdateOptions}
               labelField="label"
               valueField="value"
               placeholder="Select"
               value={statusUpdate}
               onChange={(item) => setStatusUpdate(item.value)}
            />
         </View>
         <ScrollView>
            <OrderItemList orderItems={orderItems} order={order} />
            <View style={styles.orderInfoContainer}>
               <Text style={styles.subHeading}>Order Information</Text>
               <Text style={styles.infoText}>Order ID: {order.id}</Text>
               <Text style={styles.infoText}>
                  Placed on {formattedDate(order.created_at)}
               </Text>
               <Text style={styles.infoText}>Status: {order.order_status}</Text>
               <Text style={styles.infoText}>Payment: {order.payment_mode}</Text>
               <Text style={styles.infoText}>{order.delivery_mode}</Text>
               <Text style={styles.subHeading}>Customer Information</Text>
               <Text style={styles.infoText}>
                  Name: {order.user_data.displayName}
               </Text>
               <Text style={styles.infoText}>
                  Email: {order.user_data.email}
               </Text>
               <Text style={styles.infoText}>
                  Phone: 0{order.user_data.phone}
               </Text>
            </View>
         </ScrollView>

         <TouchableOpacity onPress={handleUpdate} style={styles.button}>
            <Text style={styles.buttonText}>Update Order Status</Text>
         </TouchableOpacity>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.background,
   },
   orderInfoContainer: {
      margin: spacing.md,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
   },
   infoText: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      marginVertical: spacing.xs,
   },
   subHeading: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
      alignSelf: "flex-start",
   },
   button: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primary,
      marginVertical: spacing.md,
   },
   buttonText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      textAlign: "center",
      color: colors.textLight,
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
      margin: spacing.md,
   },
});

export default ManageOrder;
