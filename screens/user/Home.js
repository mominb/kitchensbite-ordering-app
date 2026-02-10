import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
   FlatList,
   Image,
   ScrollView,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Filter from "../../components/Filter";
import ItemSeperator from "../../components/ItemSeperator";
import RestaurantClosedOverlay from "../../components/RestaurantClosedOverlay";
import { colors, fontSize, fontWeight, borderRadius, spacing, shadows } from "../../theme";
import {
   getGlobalSettings,
   getMenuByFilterAndSearch,
} from "../../utils/supabase";
import * as cart from "../../utils/cart";

const Home = ({ menuCategories, session }) => {
   const [searchTerm, setSearchTerm] = useState("");
   const [data, setData] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [activeCategories, setActiveCategories] = useState([]);
   const [numOfCartItems, setNumOfCartItems] = useState(0);
   const [currency, setCurrency] = useState("Rs");
   const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);
   const navigation = useNavigation();
   const activeLoadId = useRef(0);


   const handleFilterSelection = (filter) => {
      setActiveCategories((prev) => {
         if (prev.includes(filter)) return prev.filter((c) => c !== filter);
         return [...prev, filter];
      });
   };

   const handleItemPress = (item) => {
      navigation.navigate("Item", { item });
   };

   const requireAuth = (onAuthed) => {
      if (!session) {
         navigation.navigate("Onboarding");
         return;
      }
      onAuthed();
   };

   const handleProfileIconClick = () => {
      requireAuth(() => navigation.navigate("Profile"));
   };

   useEffect(() => {
      const fetchSettings = async () => {
         const globalSettings = await getGlobalSettings();
         setCurrency(globalSettings?.[0]?.currency_code || "Rs");
         const isOpen = globalSettings?.[0]?.restaurant_available;
         setIsRestaurantOpen(isOpen !== false);
      };
      fetchSettings();
   }, []);

   useEffect(() => {
      const loadData = async () => {
         const loadId = activeLoadId.current + 1;
         activeLoadId.current = loadId;
         setIsLoading(true);
         try {
            const filteredItems = await getMenuByFilterAndSearch(
               activeCategories,
               searchTerm,
            );
            if (activeLoadId.current === loadId) {
               setData(filteredItems || []);
            }
         } catch (err) {
            console.log("Menu load error:", err);
            if (activeLoadId.current === loadId) {
               setData([]);
            }
            Toast.show({ type: "error", text1: "Failed to load menu" });
         } finally {
            if (activeLoadId.current === loadId) {
               setIsLoading(false);
            }
         }
      };
      loadData();
   }, [activeCategories, searchTerm, session]);

   const formatCurrency = (value) => `${currency} ${value}`;

   useFocusEffect(
      useCallback(() => {
         async function fetchCartItemCount() {
            if (!session) {
               setNumOfCartItems(0);
               return;
            }
            const cartItemCount = await cart.cartItemCount();
            setNumOfCartItems(cartItemCount);
         }
         fetchCartItemCount();
      }, [session])
   );

   return (
      <SafeAreaView style={styles.container}>
         <Spinner
            visible={isLoading}
            textContent="Loading..."
            textStyle={{ color: colors.textLight }}
         />
         
         <View style={styles.header}>
            <View style={styles.logoContainer}>
               <MaterialIcons name="restaurant-menu" size={32} color={colors.primary} />
               <Text style={styles.logoText}>Kitchen's Bite</Text>
            </View>
            <TouchableOpacity onPress={handleProfileIconClick} style={styles.iconButton}>
               <Ionicons name="person-circle-outline" size={32} color={colors.textPrimary} />
            </TouchableOpacity>
         </View>

         <View style={styles.searchBarSection}>
            <View style={styles.searchBar}>
               <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
               <TextInput
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  style={styles.searchInput}
                  placeholder="Search menu..."
                  placeholderTextColor={colors.textMuted}
               />
            </View>
            <TouchableOpacity
               style={styles.cartButton}
               onPress={() => requireAuth(() => navigation.navigate("Cart"))}
            >
               <Ionicons name="cart" size={24} color={colors.textLight} />
               {numOfCartItems > 0 && (
                  <View style={styles.cartBadge}>
                     <Text style={styles.cartBadgeText}>{numOfCartItems}</Text>
                  </View>
               )}
            </TouchableOpacity>
         </View>

         <View style={styles.actionsContainer}>
            <TouchableOpacity
               style={styles.ordersButton}
               onPress={() => requireAuth(() => navigation.navigate("Orders"))}
            >
               <MaterialIcons name="receipt-long" size={20} color={colors.textLight} />
               <Text style={styles.ordersButtonText}>View Orders</Text>
            </TouchableOpacity>
         </View>

         <ItemSeperator />

         <View style={styles.filtersSection}>
            <ScrollView
               horizontal
               showsHorizontalScrollIndicator={false}
               contentContainerStyle={styles.filtersContent}
            >
            <Filter
               categories={menuCategories}
               onClick={handleFilterSelection}
               activeCat={activeCategories}
            />
            </ScrollView>
         </View>
         
         <ItemSeperator />

         <FlatList
            keyExtractor={(item) => item.id}
            data={data.filter((item) => !item.is_disabled)}
            ItemSeparatorComponent={ItemSeperator}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
               <TouchableOpacity
                  onPress={() => handleItemPress(item)}
                  style={styles.itemRow}
                  activeOpacity={0.7}
               >
                  <View style={styles.itemTextColumn}>
                     <Text style={styles.itemTitle}>{item.name}</Text>
                     <Text style={styles.itemDescription} numberOfLines={2}>
                        {item.description}
                     </Text>
                     <Text style={styles.itemPrice}>
                        {formatCurrency(item.price)}
                     </Text>
                  </View>

                  {item.image_url ? (
                     <Image
                        style={styles.itemImage}
                        source={{ uri: item.image_url }}
                     />
                  ) : (
                     <View style={styles.itemImagePlaceholder}>
                        <MaterialIcons name="image-not-supported" size={32} color={colors.textMuted} />
                     </View>
                  )}
               </TouchableOpacity>
            )}
         />
         <RestaurantClosedOverlay visible={!isRestaurantOpen} />
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.backgroundGray,
   },
   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      backgroundColor: colors.background,
   },
   logoContainer: {
      flexDirection: "row",
      alignItems: "center",
   },
   logoText: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.bold,
      color: colors.primary,
      marginLeft: spacing.xs,
   },
   iconButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
   },
   searchBarSection: {
      backgroundColor: colors.primary,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
   },
   searchBar: {
      flexDirection: "row",
      backgroundColor: colors.background,
      flex: 1,
      height: 44,
      borderRadius: borderRadius.lg,
      alignItems: "center",
      paddingHorizontal: spacing.sm,
      marginRight: spacing.sm,
   },
   searchIcon: {
      marginRight: spacing.xs,
   },
   searchInput: {
      flex: 1,
      height: 44,
      fontSize: fontSize.md,
      color: colors.textPrimary,
   },
   cartButton: {
      backgroundColor: colors.secondary,
      borderRadius: borderRadius.round,
      width: 44,
      height: 44,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
   },
   cartBadge: {
      position: "absolute",
      top: -4,
      right: -4,
      backgroundColor: colors.error,
      width: 20,
      height: 20,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
   },
   cartBadgeText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.bold,
      color: colors.textLight,
   },
   actionsContainer: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
   },
   ordersButton: {
      backgroundColor: colors.secondary,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
   },
   ordersButtonText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.textLight,
      marginLeft: spacing.xs,
   },
   filtersSection: {
      height: 44,
      backgroundColor: colors.background,
      justifyContent: "center",
      overflow: "hidden",
   },
   filtersContent: {
      alignItems: "center",
      height: 44,
      paddingHorizontal: spacing.md,
   },
   listContent: {
      paddingBottom: spacing.md,
   },
   itemRow: {
      flexDirection: "row",
      padding: spacing.md,
      justifyContent: "space-between",
      backgroundColor: colors.background,
   },
   itemTextColumn: {
      flex: 1,
      marginRight: spacing.md,
   },
   itemTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
   },
   itemDescription: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
      lineHeight: 20,
   },
   itemPrice: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.primary,
   },
   itemImage: {
      width: 100,
      height: 100,
      borderRadius: borderRadius.md,
   },
   itemImagePlaceholder: {
      width: 100,
      height: 100,
      borderRadius: borderRadius.md,
      backgroundColor: colors.backgroundGray,
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
   },
});

export default Home;
