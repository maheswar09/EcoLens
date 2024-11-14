import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function SearchResult({ route }) {
  const { products } = route.params;
  const navigation = useNavigation();

  const handleProductPress = (product) => {
    navigation.navigate("WishlistItemDetailScreen", { product });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
    >
      {item.image_url && (
        <Image source={{ uri: item.image_url }} style={styles.productImage} />
      )}
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.product_name}</Text>
        <Text style={styles.productBrand}>{item.brands}</Text>
        <Text style={styles.nutriscore}>
          Nutri-Score: {item.nutriments["nutrition-score-fr"]}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  productCard: {
    flexDirection: "row",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    padding: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  productDetails: {
    justifyContent: "center",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productBrand: {
    fontSize: 14,
    color: "gray",
  },
  nutriscore: {
    fontSize: 14,
    color: "green",
  },
});
