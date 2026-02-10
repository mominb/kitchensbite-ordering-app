import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors, fontSize, fontWeight, borderRadius, spacing } from "../theme";

const Filter = ({ categories, onClick, activeCat }) => {
   const isActive = (category) => {
      return activeCat.includes(category);
   };

   return categories.map((category) => (
      <TouchableOpacity
         style={
            isActive(category) ? styles.filterButtonActive : styles.filterButton
         }
         onPress={() => onClick(category)}
         key={category}
      >
         <Text style={styles.filterButtonText}>{category}</Text>
      </TouchableOpacity>
   ));
};

const styles = StyleSheet.create({
   filterButton: {
      height: 32,
      paddingHorizontal: spacing.md,
      marginHorizontal: spacing.xs,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.backgroundGray,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
   },
   filterButtonActive: {
      height: 32,
      paddingHorizontal: spacing.md,
      marginHorizontal: spacing.xs,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.primary,
      borderWidth: 1,
      borderColor: colors.primaryDark,
      alignItems: "center",
      justifyContent: "center",
   },
   filterButtonText: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.semibold,
      color: colors.textPrimary,
      lineHeight: 16,
      includeFontPadding: false,
      textAlignVertical: "center",
   },
});

export default Filter;
