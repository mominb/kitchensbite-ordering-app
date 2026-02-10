import { StyleSheet } from "react-native";

export const colors = {
   primary: "#495E57",
   secondary: "#F4CE14",
   tertiary: "#EDEFEE",
   lightgrey: "#B0B0B0",
   red: "#E53935",
   black: "#000000",
   white: "#FFFFFF",
};

export const layout = {
   container: {
      flex: 1,
      backgroundColor: colors.white,
   },
};

export const typography = {
   h1: {
      fontSize: 25,
      fontWeight: "bold",
      color: colors.black,
   },
   h2: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.black,
   },
   h3: {
      fontSize: 17,
      fontWeight: "bold",
      color: colors.black,
   },
   body: {
      fontSize: 16,
      fontWeight: "400",
      color: colors.black,
   },
   bodyBold: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.black,
   },
   button: {
      fontSize: 15,
      fontWeight: "bold",
      color: colors.black,
   },
   caption: {
      fontSize: 14,
      fontWeight: "400",
      color: colors.black,
   },
};

export const globalStyles = StyleSheet.create({});
