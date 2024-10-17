import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SuccessScreen({ route }) {
  const { type, data } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Barcode scanned successfully!</Text>
      <Text>Type: {type}</Text>
      <Text>Data: {data}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
