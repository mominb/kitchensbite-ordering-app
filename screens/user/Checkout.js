import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
   FlatList,
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import ItemSeperator from "../../components/ItemSeperator";
import PageHeader from "../../components/PageHeader";
import InfoBox from "../../components/InfoBox";
import { getGlobalSettings, placeOrder } from "../../utils/supabase";
import * as cart from "../../utils/cart";
import { colors, fontSize, fontWeight, borderRadius, spacing } from "../../theme";
import { deliveryOptions, paymentOptions } from "../../config";

const Checkout = ({ route, session, userMetaDataExists }) => {
   const [isLoading, setIsLoading] = useState(false);
   const navigator = useNavigation();
   const data = route.params;
   const cartItems = data?.cartItems || [];
   const totalAmount = data?.totalAmount || 0;
   const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0]?.value || "COD");
   const [currency, setCurrency] = useState("Rs");
   const [deliveryMethod, setDeliveryMethod] = useState(deliveryOptions[0]?.value || "Delivery");

   useEffect(() => {
      if (!session) {
         navigator.navigate("Onboarding");
      }
   }, [session]);

   useEffect(() => {
      const fetchSettings = async () => {
         const globalSettings = await getGlobalSettings();
         setCurrency(globalSettings?.[0]?.currency_code || "Rs");
      };
      fetchSettings();
   }, []);

   const formatCurrency = (value) => `${currency} ${value}`;

   const handleOrderPlacement = async () => {
      if (!userMetaDataExists) {
         Toast.show({
            type: "error",
            text1: "Complete your profile",
            text2: "Add your name and phone to continue",
         });
         navigator.navigate("Profile");
         return;
      }

      setIsLoading(true);
      try {
         await placeOrder(cartItems, deliveryMethod, paymentMethod, totalAmount);
         await cart.deleteAllCartRows();
         Toast.show({ type: "success", text1: "Order placed" });
         navigator.navigate("Orders");
      } catch (error) {
         console.log(error);
         Toast.show({ type: "error", text1: "Order failed" });
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
         <PageHeader navigator={navigator} heading="Checkout" />

         {!userMetaDataExists && (
            <InfoBox
               message="Complete your profile before placing an order."
               type="warning"
            />
         )}

         <ScrollView>
            <View style={styles.orderDetailsContainer}>
               <Text style={styles.subHeading}>Order Details</Text>
               <FlatList
                  data={cartItems}
                  keyExtractor={(item) => String(item.item_id)}
                  ItemSeparatorComponent={ItemSeperator}
                  renderItem={({ item }) => (
                     <View style={styles.itemContainer}>
                        <View style={styles.itemInfoContainer}>
                           <Text style={styles.itemText}>{item.amount}x</Text>
                           <Text style={styles.itemText}>{item.name}</Text>
                        </View>

                        <View style={styles.itemPriceContainer}>
                           <Text style={styles.itemText}>
                              {formatCurrency((item.amount * item.price).toFixed(2))}
                           </Text>
                        </View>
                     </View>
                  )}
               />
               <ItemSeperator />
               <View style={styles.totalAmountContainer}>
                  <Text style={styles.totalAmountText}>Total</Text>
                  <Text style={styles.totalAmountText}>
                     {formatCurrency(totalAmount)}
                  </Text>
               </View>
            </View>
            <View style={styles.detailsContainer}>
               <Text style={styles.subHeading}>Delivery Method</Text>
               <Dropdown
                  style={styles.methodSelector}
                  data={deliveryOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Select"
                  value={deliveryMethod}
                  onChange={(item) => setDeliveryMethod(item.value)}
               />
               <Text style={styles.subHeading}>Payment Method</Text>
               <Dropdown
                  style={styles.methodSelector}
                  data={paymentOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Select"
                  value={paymentMethod}
                  onChange={(item) => setPaymentMethod(item.value)}
               />
            </View>
         </ScrollView>
         <View>
            <TouchableOpacity
               onPress={handleOrderPlacement}
               style={styles.button}
            >
               <Text style={styles.buttonText}>Place Order</Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.background,
   },
   subHeading: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      marginBottom: spacing.sm,
      alignSelf: "flex-start",
      color: colors.textPrimary,
   },
   orderDetailsContainer: {
      padding: spacing.md,
      margin: spacing.md,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: borderRadius.md,
      backgroundColor: colors.background,
   },
   itemContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: spacing.xs,
   },
   itemInfoContainer: {
      flexDirection: "row",
      alignItems: "center",
   },
   itemText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: colors.textPrimary,
      marginRight: spacing.sm,
   },
   totalAmountText: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      marginTop: spacing.sm,
      color: colors.primary,
   },
   totalAmountContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   detailsContainer: {
      flexDirection: "column",
      margin: spacing.md,
   },
   methodSelector: {
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
   button: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primary,
      marginBottom: spacing.lg,
   },
   buttonText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      textAlign: "center",
      color: colors.textLight,
   },
});

export default Checkout;
