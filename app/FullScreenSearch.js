import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios"; // Import axios for making the API request

export default function FullScreenSearch() {
  const [searchText, setSearchText] = useState("");
  const navigation = useNavigation();

  const handleSearch = async () => {
    if (searchText.trim()) {
      try {
        const response = await axios.get(
          `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchText}&search_simple=1&action=process&json=true`
        );

        const products = response.data.products || [];
        if (products.length > 0) {
          navigation.replace("SearchResult", { products });
        } else {
          console.log("No products found");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setSearchText("");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a product"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  backButton: {
    paddingRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchButton: {
    marginLeft: 10,
  },
});
