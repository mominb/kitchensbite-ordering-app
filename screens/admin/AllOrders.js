import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import OrderCards from "../../components/OrderCards";
import PageHeader from "../../components/PageHeader";
import { colors } from "../../theme";
import { getAllOrders } from "../../utils/supabase";

const AllOrders = ({ navigation }) => {
   const [orders, setOrders] = useState([]);
   const [isLoading, setIsLoading] = useState(false);

   const loadOrders = useCallback(async () => {
      setIsLoading(true);
      const data = await getAllOrders();
      setOrders(data || []);
      setIsLoading(false);
   }, []);

   useFocusEffect(
      useCallback(() => {
         loadOrders();
      }, [loadOrders])
   );

   return (
      <SafeAreaView style={styles.container}>
         <Spinner visible={isLoading} textContent="Loading..." textStyle={{ color: colors.textLight }} />
         <PageHeader navigator={navigation} heading="All Orders" />
         <View style={styles.content}>
            <OrderCards orders={orders} navigator={navigation} onPressRoute="ManageOrder" />
         </View>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.backgroundGray,
   },
   content: {
      flex: 1,
   },
});

export default AllOrders;
