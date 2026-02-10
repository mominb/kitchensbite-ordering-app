import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
   Alert,
   FlatList,
   Image,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { MaterialIcons } from "@expo/vector-icons";
import InfoBox from "../../components/InfoBox";
import ItemSeperator from "../../components/ItemSeperator";
import PageHeader from "../../components/PageHeader";
import { colors, fontSize, fontWeight, borderRadius, spacing, shadows } from "../../theme";
import {
   deleteMenuItem,
   getGlobalSettings,
   getMenuItems,
} from "../../utils/supabase";

const ManageMenu = () => {
   const [menu, setMenu] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [currency, setCurrency] = useState("Rs");
   const navigator = useNavigation();

   const loadMenu = async () => {
      try {
         const menuItems = await getMenuItems(true);
         setMenu(menuItems || []);
         const globalSettings = await getGlobalSettings();
         setCurrency(globalSettings?.[0]?.currency_code || "Rs");
      } catch (error) {
         console.log(error);
         Toast.show({ type: "error", text1: "Failed to load menu" });
      } finally {
         setIsLoading(false);
      }
   };

   useFocusEffect(
      useCallback(() => {
         setIsLoading(true);
         loadMenu();
      }, [])
   );

   const handleDelete = async (id) => {
      setIsLoading(true);
      try {
         const res = await deleteMenuItem(id);
         if (res?.error) {
            Toast.show({ type: "error", text1: "Delete failed" });
         } else {
            Toast.show({ type: "success", text1: "Item deleted" });
            await loadMenu();
         }
      } catch (error) {
         console.log(error);
         Toast.show({ type: "error", text1: "Delete failed" });
      } finally {
         setIsLoading(false);
      }
   };

   const confirmDelete = (id, name) => {
      Alert.alert(
         "Delete menu item",
         `Are you sure you want to delete "${name}"?`,
         [
            { text: "Cancel", style: "cancel" },
            {
               text: "Delete",
               style: "destructive",
               onPress: () => handleDelete(id),
            },
         ],
         { cancelable: true }
      );
   };

   return (
      <SafeAreaView style={styles.container}>
         <Spinner
            visible={isLoading}
            textContent="Loading..."
            textStyle={{ color: colors.textLight }}
         />
         <PageHeader heading="Menu Management" navigator={navigator} />

         <TouchableOpacity
            style={styles.addRow}
            onPress={() => navigator.navigate("MenuItem")}
         >
            <Text style={styles.addText}>Add Item</Text>
            <MaterialIcons name="add" size={28} color={colors.primary} />
         </TouchableOpacity>

         <ItemSeperator />

         <FlatList
            data={menu}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={ItemSeperator}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
               <TouchableOpacity
                  onPress={() => navigator.navigate("MenuItem", { item })}
                  style={
                     item.is_disabled
                        ? [styles.itemRow, styles.itemRowDisabled]
                        : styles.itemRow
                  }
               >
                  <View style={styles.itemTextColumn}>
                     <View style={styles.titleRow}>
                        <Text style={styles.itemTitle}>{item.name}</Text>
                        {item.is_disabled && (
                           <View style={styles.disabledBadge}>
                              <Text style={styles.disabledBadgeText}>Disabled</Text>
                           </View>
                        )}
                     </View>
                     <Text style={styles.itemDescription} numberOfLines={2}>
                        {item.description}
                     </Text>
                     <Text style={styles.itemPrice}>
                        {currency} {item.price}
                     </Text>

                     {item.is_disabled && (
                        <InfoBox
                           type="warning"
                           message="This item is disabled and hidden from customers."
                        />
                     )}

                     <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => confirmDelete(item.id, item.name)}
                     >
                        <MaterialIcons name="delete" size={16} color={colors.textLight} />
                        <Text style={styles.deleteButtonText}>Delete</Text>
                     </TouchableOpacity>
                  </View>

                  {item.image_url ? (
                     <Image
                        style={styles.itemImage}
                        source={{ uri: item.image_url }}
                     />
                  ) : (
                     <View style={styles.itemImagePlaceholder}>
                        <MaterialIcons name="image-not-supported" size={28} color={colors.textMuted} />
                     </View>
                  )}
               </TouchableOpacity>
            )}
         />
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.background,
   },
   addRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.background,
   },
   addText: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.semibold,
      color: colors.textPrimary,
   },
   listContent: {
      paddingBottom: spacing.lg,
   },
   itemRow: {
      flexDirection: "row",
      padding: spacing.md,
      justifyContent: "space-between",
      backgroundColor: colors.background,
   },
   itemRowDisabled: {
      backgroundColor: colors.backgroundGray,
      opacity: 0.7,
   },
   titleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
   },
   disabledBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.round,
      backgroundColor: colors.warning,
      marginLeft: spacing.sm,
   },
   disabledBadgeText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.bold,
      color: colors.textPrimary,
   },
   itemTextColumn: {
      flex: 1,
      marginRight: spacing.md,
   },
   itemTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      color: colors.textPrimary,
   },
   itemDescription: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      marginVertical: spacing.xs,
   },
   itemPrice: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.primary,
   },
   itemImage: {
      width: 110,
      height: 110,
      borderRadius: borderRadius.md,
      backgroundColor: colors.backgroundGray,
      ...shadows.sm,
   },
   itemImagePlaceholder: {
      width: 110,
      height: 110,
      borderRadius: borderRadius.md,
      backgroundColor: colors.backgroundGray,
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
   },
   deleteButton: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: spacing.sm,
      backgroundColor: colors.error,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: borderRadius.md,
      alignSelf: "flex-start",
   },
   deleteButtonText: {
      color: colors.textLight,
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      marginLeft: spacing.xs,
   },
});

export default ManageMenu;
