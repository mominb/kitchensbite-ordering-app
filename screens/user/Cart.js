import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
   FlatList,
   Image,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import PageHeader from "../../components/PageHeader";
import InfoBox from "../../components/InfoBox";
import ItemSeperator from "../../components/ItemSeperator";
import { colors, fontSize, fontWeight, borderRadius, spacing } from "../../theme";
import { getGlobalSettings } from "../../utils/supabase";
import * as cart from "../../utils/cart";

const Cart = ({ session, userMetaDataExists }) => {
   const navigator = useNavigation();
   const [cartItems, setCartItems] = useState([]);
   const [totalAmount, setTotalAmount] = useState(0);
   const [isLoading, setIsLoading] = useState(true);
   const [currency, setCurrency] = useState("Rs");

   useEffect(() => {
      const fetchSettings = async () => {
         const globalSettings = await getGlobalSettings();
         setCurrency(globalSettings?.[0]?.currency_code || "Rs");
      };
      fetchSettings();
   }, []);

   const formatCurrency = (value) => `${currency} ${value}`;

   const load = async () => {
      try {
         const items = await cart.getMenuItemsInCart();
         setCartItems(items);
         const cost = await cart.getTotalCartCost();
         setTotalAmount(cost ? Number(cost).toFixed(2) : 0);
      } catch (err) {
         console.log(err);
         Toast.show({ type: "error", text1: "Failed to load cart" });
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
         load();
      }, [session])
   );

   const increaseAmount = async (item_id) => {
      setIsLoading(true);
      try {
         await cart.changeItemQtyInCart(item_id, "increase");
      } catch (err) {
         console.log(err);
         Toast.show({ type: "error", text1: "Update failed" });
      } finally {
         await load();
      }
   };

   const decreaseAmount = async (item_id) => {
      setIsLoading(true);
      try {
         await cart.changeItemQtyInCart(item_id, "decrease");
      } catch (err) {
         console.log(err);
         Toast.show({ type: "error", text1: "Update failed" });
      } finally {
         await load();
      }
   };

   const handleCheckoutNavi = () => {
      if (!session) {
         navigator.navigate("Onboarding");
         return;
      }
      if (!cartItems.length) {
         Toast.show({
            type: "error",
            text1: "Cart is empty",
            text2: "Add items before checkout",
         });
         return;
      }
      if (!userMetaDataExists) {
         Toast.show({
            type: "error",
            text1: "Complete your profile",
            text2: "You need a name and phone to order",
         });
         navigator.navigate("Profile");
         return;
      }

      navigator.navigate("Checkout", {
         cartItems: cartItems,
         totalAmount: totalAmount,
      });
   };

   return (
      <SafeAreaView style={styles.container}>
         <Spinner
            visible={isLoading}
            textContent="Loading..."
            textStyle={{ color: colors.textLight }}
         />
         <PageHeader navigator={navigator} heading="Cart" />

         {!userMetaDataExists && cartItems.length > 0 && (
            <InfoBox
               message="Complete your profile to place orders."
               type="warning"
            />
         )}

         <FlatList
            data={cartItems}
            keyExtractor={(item) => String(item.item_id)}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
               <View style={styles.itemContainer}>
                  <View style={styles.itemInfoRow}>
                     <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemQty}>Qty: {item.amount}</Text>
                        <Text style={styles.itemTotal}>
                           {formatCurrency((item.amount * item.price).toFixed(2))}
                        </Text>
                     </View>
                     {item.image_url ? (
                        <Image
                           source={{ uri: item.image_url }}
                           style={styles.itemImage}
                        />
                     ) : (
                        <View style={styles.itemImagePlaceholder}>
                           <Ionicons name="image-outline" size={28} color={colors.textMuted} />
                        </View>
                     )}
                  </View>

                  <View style={styles.itemActions}>
                     <View style={styles.counterContainer}>
                        <TouchableOpacity
                           style={styles.counterButton}
                           onPress={() => decreaseAmount(item.item_id)}
                        >
                           <Ionicons name="remove" size={18} color={colors.primary} />
                        </TouchableOpacity>
                        <Text style={styles.counterText}>{item.amount}</Text>
                        <TouchableOpacity
                           style={styles.counterButton}
                           onPress={() => increaseAmount(item.item_id)}
                        >
                           <Ionicons name="add" size={18} color={colors.primary} />
                        </TouchableOpacity>
                     </View>

                     <TouchableOpacity
                        onPress={async () => {
                           setIsLoading(true);
                           try {
                              const response = await cart.deleteCartItem(item.item_id);
                              Toast.show({ type: response.type, text1: response.message });
                           } catch (err) {
                              console.log(err);
                              Toast.show({ type: "error", text1: "Delete failed" });
                           } finally {
                              await load();
                           }
                        }}
                        style={styles.deleteButton}
                     >
                        <Ionicons name="trash" size={18} color={colors.textLight} />
                        <Text style={styles.deleteText}>Delete</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            )}
         />

         <View style={styles.footer}>
            <View style={styles.totalAmountContainer}>
               <Text style={styles.totalAmountLabel}>Total</Text>
               <Text style={styles.totalAmountValue}>{formatCurrency(totalAmount)}</Text>
            </View>
            <TouchableOpacity
               onPress={handleCheckoutNavi}
               style={styles.checkoutButton}
            >
               <Text style={styles.checkoutButtonText}>Continue to Checkout</Text>
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
   listContainer: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.lg,
   },
   itemContainer: {
      backgroundColor: colors.background,
      padding: spacing.md,
      marginVertical: spacing.xs,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
   },
   itemInfoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.sm,
   },
   itemInfo: {
      flex: 1,
      marginRight: spacing.md,
   },
   itemName: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.textPrimary,
   },
   itemQty: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      marginTop: spacing.xs,
   },
   itemTotal: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.primary,
      marginTop: spacing.xs,
   },
   itemImage: {
      width: 70,
      height: 70,
      borderRadius: borderRadius.md,
   },
   itemImagePlaceholder: {
      width: 70,
      height: 70,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.backgroundGray,
   },
   itemActions: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
   },
   counterContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.backgroundGray,
      borderRadius: borderRadius.lg,
      padding: spacing.xs,
   },
   counterButton: {
      width: 32,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: borderRadius.md,
   },
   counterText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.textPrimary,
      marginHorizontal: spacing.md,
   },
   deleteButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.error,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: borderRadius.md,
   },
   deleteText: {
      color: colors.textLight,
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      marginLeft: spacing.xs,
   },
   footer: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.background,
   },
   totalAmountContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: spacing.md,
   },
   totalAmountLabel: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.textSecondary,
   },
   totalAmountValue: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.primary,
   },
   checkoutButton: {
      alignItems: "center",
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primary,
   },
   checkoutButtonText: {
      color: colors.textLight,
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
   },
});

export default Cart;
