import { StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../theme";

const Splash = () => {
   return (
      <View style={styles.container}>
         <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="food" size={120} color={colors.textLight} />
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
   },
   logoContainer: {
      width: 200,
      height: 200,
      backgroundColor: colors.primaryDark,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      borderWidth: 2,
      borderColor: colors.textLight,
      borderStyle: "dashed",
   },
});

export default Splash;
