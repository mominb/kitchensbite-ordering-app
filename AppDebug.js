import { View, Text } from "react-native";

export default function AppDebug() {
  return (
    <View style={{ flex: 1, backgroundColor: "blue", justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: "white", fontSize: 20 }}>APP IS LOADED</Text>
    </View>
  );
}
