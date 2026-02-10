import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
   Image,
   KeyboardAvoidingView,
   ScrollView,
   StyleSheet,
   Switch,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { MaterialIcons } from "@expo/vector-icons";
import InfoBox from "../../components/InfoBox";
import PageHeader from "../../components/PageHeader";
import { colors, fontSize, fontWeight, borderRadius, spacing } from "../../theme";
import {
   addMenuItem,
   deleteMenuImageByUrl,
   getGlobalSettings,
   updateMenuItem,
   uploadMenuImage,
} from "../../utils/supabase";

const MenuItem = ({ route }) => {
   const navigator = useNavigation();
   const item = route?.params?.item ?? {};
   const [currency, setCurrency] = useState("Rs");
   const [itemName, setItemName] = useState(item.name || "");
   const [itemDescription, setItemDescription] = useState(item.description || "");
   const [itemPrice, setItemPrice] = useState(item.price?.toString() || "");
   const [itemCategory, setItemCategory] = useState(item.category || "");
   const [itemDisabled, setItemDisabled] = useState(Boolean(item.is_disabled));
   const [imageUri, setImageUri] = useState(item.image_url ?? "");
   const [imageChanged, setImageChanged] = useState(false);
   const [imageRemoved, setImageRemoved] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const isItemExistent = Boolean(item.id);

   const handleSelectImage = async () => {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== "granted") {
         Toast.show({ type: "error", text1: "Photo permission denied" });
         return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         allowsEditing: true,
         quality: 0.8,
      });

      if (!result.canceled) {
         setImageUri(result.assets[0].uri);
         setImageChanged(true);
         setImageRemoved(false);
      }
   };

   const handleRemoveImage = () => {
      setImageUri("");
      setImageChanged(true);
      setImageRemoved(true);
   };

   const handleItemUpdate = async () => {
      if (!itemName || !itemDescription || !itemPrice || !itemCategory) {
         Toast.show({ type: "error", text1: "Please fill all fields" });
         return;
      }

      setIsLoading(true);
      try {
         let imageUrl = item.image_url ?? null;

         if (imageRemoved && item.image_url) {
            const deleteRes = await deleteMenuImageByUrl(item.image_url);
            if (deleteRes?.error) {
               Toast.show({ type: "error", text1: "Image delete failed" });
               setIsLoading(false);
               return;
            }
            imageUrl = null;
         }

         if (imageChanged && imageUri && imageUri !== item.image_url) {
            const uploadRes = await uploadMenuImage({
               uri: imageUri,
               itemId: item.id,
            });
            if (uploadRes?.error) {
               Toast.show({ type: "error", text1: "Image upload failed" });
               setIsLoading(false);
               return;
            }

            if (item.image_url) {
               await deleteMenuImageByUrl(item.image_url);
            }

            imageUrl = uploadRes.publicUrl;
         }

         let res;
         if (!isItemExistent) {
            res = await addMenuItem(
               itemName,
               itemDescription,
               itemPrice,
               itemCategory,
               itemDisabled,
               imageUrl,
            );
         } else {
            res = await updateMenuItem(
               item.id,
               itemName,
               itemDescription,
               itemPrice,
               itemCategory,
               itemDisabled,
               imageUrl,
            );
         }
         setIsLoading(false);
         if (res?.error) {
            Toast.show({ type: "error", text1: "Save failed" });
         } else {
            Toast.show({ type: "success", text1: "Saved successfully" });
            navigator.goBack();
         }
      } catch (err) {
         console.log(err);
         setIsLoading(false);
         Toast.show({ type: "error", text1: "Save failed" });
      }
   };

   useEffect(() => {
      const fetchSettings = async () => {
         const globalSettings = await getGlobalSettings();
         setCurrency(globalSettings?.[0]?.currency_code || "Rs");
      };
      fetchSettings();
   }, []);

   return (
      <SafeAreaView style={styles.container}>
         <Spinner
            visible={isLoading}
            textContent="Loading..."
            textStyle={{ color: colors.textLight }}
         />
         <PageHeader
            navigator={navigator}
            heading={isItemExistent ? "Edit Item" : "Add Item"}
         />
         {item.is_disabled && (
            <InfoBox
               type="error"
               message="Item is disabled and won't be visible to customers."
            />
         )}
         <ScrollView style={styles.container}>
            <View style={styles.infoBox}>
               <Text style={styles.label}>Photo</Text>
               <View style={styles.imageRow}>
                  {imageUri ? (
                     <Image
                        source={{ uri: imageUri }}
                        style={styles.imagePreview}
                     />
                  ) : (
                     <View style={styles.imagePlaceholder}>
                        <MaterialIcons name="image-not-supported" size={24} color={colors.textMuted} />
                        <Text style={styles.imagePlaceholderText}>No Image</Text>
                     </View>
                  )}
                  <View style={styles.imageActions}>
                     <TouchableOpacity
                        style={styles.imageActionButton}
                        onPress={handleSelectImage}
                     >
                        <Text style={styles.imageActionText}>Select</Text>
                     </TouchableOpacity>
                     {imageUri ? (
                        <TouchableOpacity
                           style={[styles.imageActionButton, styles.imageRemoveButton]}
                           onPress={handleRemoveImage}
                        >
                           <Text style={styles.imageRemoveText}>Remove</Text>
                        </TouchableOpacity>
                     ) : null}
                  </View>
               </View>

               <Text style={styles.label}>Name</Text>
               <TextInput
                  style={styles.input}
                  value={itemName}
                  onChangeText={setItemName}
               />

               <Text style={styles.label}>Description</Text>
               <TextInput
                  style={[styles.input, styles.textArea]}
                  value={itemDescription}
                  onChangeText={setItemDescription}
                  multiline
               />

               <Text style={styles.label}>Category</Text>
               <TextInput
                  autoCapitalize="none"
                  style={styles.input}
                  value={itemCategory}
                  onChangeText={setItemCategory}
               />

               <Text style={styles.label}>Price ({currency})</Text>
               <TextInput
                  keyboardType="numeric"
                  style={styles.input}
                  value={itemPrice}
                  onChangeText={setItemPrice}
               />
               <View style={styles.switchRow}>
                  <Text style={styles.label}>Disable item</Text>
                  <Switch value={itemDisabled} onValueChange={setItemDisabled} />
               </View>
            </View>
         </ScrollView>

         <KeyboardAvoidingView behavior="padding">
            <View>
               <TouchableOpacity onPress={handleItemUpdate} style={styles.button}>
                  <Text style={styles.buttonText}>Save</Text>
               </TouchableOpacity>
            </View>
         </KeyboardAvoidingView>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.background,
   },
   infoBox: {
      width: "100%",
      padding: spacing.lg,
   },
   button: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primary,
      marginBottom: spacing.md,
   },
   buttonText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.bold,
      color: colors.textLight,
      textAlign: "center",
   },
   input: {
      height: 48,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.md,
      backgroundColor: colors.background,
      color: colors.textPrimary,
   },
   textArea: {
      height: 90,
      textAlignVertical: "top",
   },
   label: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
   },
   imageRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.md,
      gap: 12,
   },
   imagePreview: {
      width: 90,
      height: 90,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
   },
   imagePlaceholder: {
      width: 90,
      height: 90,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.backgroundGray,
      justifyContent: "center",
      alignItems: "center",
   },
   imagePlaceholderText: {
      fontSize: fontSize.xs,
      color: colors.textMuted,
      textAlign: "center",
      marginTop: spacing.xs,
   },
   imageActions: {
      flex: 1,
      gap: 8,
   },
   imageActionButton: {
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.background,
      alignItems: "center",
   },
   imageActionText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      color: colors.primary,
   },
   imageRemoveButton: {
      borderColor: colors.error,
      backgroundColor: colors.background,
   },
   imageRemoveText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.bold,
      color: colors.error,
   },
   switchRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing.md,
   },
});

export default MenuItem;
