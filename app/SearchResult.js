import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SearchResult({ route }) {
  const { productName } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Successfully searched for "{productName}"</Text>
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
    textAlign: "center",
  },
});
