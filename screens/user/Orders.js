import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import OrderCards from "../../components/OrderCards";
import PageHeader from "../../components/PageHeader";
import { colors, fontSize, fontWeight, spacing } from "../../theme";
import { getUsersOrders } from "../../utils/supabase";

const Orders = ({ session }) => {
   const navigator = useNavigation();
   const [orders, setOrders] = useState([]);
   const [isLoading, setIsLoading] = useState(false);

   const loadOrders = async () => {
      setIsLoading(true);
      try {
         const data = await getUsersOrders();
         setOrders(data || []);
      } catch (err) {
         console.log(err);
         Toast.show({ type: "error", text1: "Failed to load orders" });
      } finally {
         setIsLoading(false);
      }
   };

   useFocusEffect(
      useCallback(() => {
         if (!session) {
            navigator.navigate("Onboarding");
            return;
         }
         loadOrders();
      }, [session])
   );

   return (
      <SafeAreaView style={styles.container}>
         <Spinner
            visible={isLoading}
            textContent="Loading..."
            textStyle={{ color: colors.textLight }}
         />
         <PageHeader navigator={navigator} heading="Orders" />

         {orders.length === 0 ? (
            <View style={styles.emptyState}>
               <Text style={styles.emptyTitle}>No orders yet</Text>
               <Text style={styles.emptyText}>Your orders will appear here.</Text>
            </View>
         ) : (
            <OrderCards orders={orders} navigator={navigator} />
         )}
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.backgroundGray,
   },
   emptyState: {
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.xl,
      marginTop: spacing.xl,
   },
   emptyTitle: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
   },
   emptyText: {
      fontSize: fontSize.md,
      color: colors.textSecondary,
      textAlign: "center",
   },
});

export default Orders;
