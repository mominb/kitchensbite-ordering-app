import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { colors, fontSize, fontWeight, borderRadius, spacing, shadows } from "../../theme";
import { saveItemToCart } from "../../utils/cart";
import { getGlobalSettings } from "../../utils/supabase";

const Item = ({ route, session }) => {
   const navigator = useNavigation();
   const item = route.params.item;
   const [amount, setAmount] = useState(1);
   const [isLoading, setIsLoading] = useState(false);
   const [currency, setCurrency] = useState("Rs");

   useEffect(() => {
      const fetchSettings = async () => {
         const globalSettings = await getGlobalSettings();
         setCurrency(globalSettings?.[0]?.currency_code || "Rs");
      };
      fetchSettings();
   }, []);

   const formatCurrency = (value) => `${currency} ${value}`;

   const increaseAmount = () => {
      setAmount((prev) => prev + 1);
   };

   const decreaseAmount = () => {
      if (amount > 1) {
         setAmount((prev) => prev - 1);
      }
   };

   const handleAddToCart = async () => {
      if (!session) {
         navigator.navigate("Onboarding");
         return;
      }
      setIsLoading(true);
      try {
         const response = await saveItemToCart(item, amount);
         Toast.show({
            type: response.type,
            text1: response.message,
         });
         navigator.navigate("Home");
      } catch (err) {
         console.log(err);
         Toast.show({ type: "error", text1: "Add to cart failed" });
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <SafeAreaView style={styles.container}>
         <Spinner
            visible={isLoading}
            textContent="Adding to cart..."
            textStyle={{ color: colors.textLight }}
         />
         
         <View style={styles.header}>
            <TouchableOpacity onPress={() => navigator.goBack()} style={styles.backButton}>
               <Ionicons name="arrow-back" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
               <MaterialIcons name="restaurant-menu" size={24} color={colors.primary} />
               <Text style={styles.logoText}>Kitchen's Bite</Text>
            </View>
            <View style={{ width: 44 }} />
         </View>

         <ScrollView style={styles.scrollView}>
            {item.image_url ? (
               <Image
                  style={styles.heroImage}
                  source={{ uri: item.image_url }}
               />
            ) : (
               <View style={styles.heroImagePlaceholder}>
                  <MaterialIcons name="image-not-supported" size={64} color={colors.textMuted} />
                  <Text style={styles.placeholderText}>No Image Available</Text>
               </View>
            )}

            <View style={styles.infoBox}>
               <Text style={styles.itemName}>{item.name}</Text>
               <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{item.category}</Text>
               </View>
               <Text style={styles.itemDescription}>{item.description}</Text>
               <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
            </View>
         </ScrollView>

         <View style={styles.footer}>
            <View style={styles.counterContainer}>
               <Text style={styles.quantityLabel}>Quantity</Text>
               <View style={styles.counterButtons}>
                  <TouchableOpacity
                     style={[styles.counterButton, amount === 1 && styles.counterButtonDisabled]}
                     onPress={decreaseAmount}
                     disabled={amount === 1}
                  >
                     <Ionicons name="remove" size={24} color={amount === 1 ? colors.textMuted : colors.primary} />
                  </TouchableOpacity>
                  <Text style={styles.counterText}>{amount}</Text>
                  <TouchableOpacity
                     style={styles.counterButton}
                     onPress={increaseAmount}
                  >
                     <Ionicons name="add" size={24} color={colors.primary} />
                  </TouchableOpacity>
               </View>
            </View>

            <TouchableOpacity
               onPress={handleAddToCart}
               style={styles.button}
            >
               <Ionicons name="cart" size={20} color={colors.textLight} />
               <Text style={styles.buttonText}>Add to Cart</Text>
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
   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
   },
   backButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
   },
   logoContainer: {
      flexDirection: "row",
      alignItems: "center",
   },
   logoText: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.primary,
      marginLeft: spacing.xs,
   },
   scrollView: {
      flex: 1,
   },
   heroImage: {
      width: "100%",
      height: 300,
      backgroundColor: colors.backgroundGray,
   },
   heroImagePlaceholder: {
      width: "100%",
      height: 300,
      backgroundColor: colors.backgroundGray,
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
   },
   placeholderText: {
      fontSize: fontSize.md,
      color: colors.textMuted,
      marginTop: spacing.sm,
   },
   infoBox: {
      padding: spacing.lg,
   },
   itemName: {
      fontSize: fontSize.xxxl,
      fontWeight: fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
   },
   categoryBadge: {
      alignSelf: "flex-start",
      backgroundColor: colors.primaryLight,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.md,
   },
   categoryText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
      color: colors.textLight,
   },
   itemDescription: {
      fontSize: fontSize.md,
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: spacing.lg,
   },
   itemPrice: {
      fontSize: fontSize.xxxl,
      fontWeight: fontWeight.bold,
      color: colors.primary,
   },
   footer: {
      backgroundColor: colors.background,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      ...shadows.lg,
   },
   counterContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.md,
   },
   quantityLabel: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.textPrimary,
   },
   counterButtons: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.backgroundGray,
      borderRadius: borderRadius.lg,
      padding: spacing.xs,
   },
   counterButton: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: borderRadius.md,
   },
   counterButtonDisabled: {
      opacity: 0.3,
   },
   counterText: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.textPrimary,
      marginHorizontal: spacing.lg,
      minWidth: 30,
      textAlign: "center",
   },
   button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primary,
      ...shadows.md,
   },
   buttonText: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.textLight,
      marginLeft: spacing.xs,
   },
});

export default Item;
