import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios"; // Import axios for making the API request

export default function FullScreenSearch() {
  const [searchText, setSearchText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();

  const fetchProducts = async (url) => {
    try {
      const response = await axios.get(url);
      return response.data.products || [];
    } catch (error) {
      console.error("Error fetching data from:", url, error);
      return [];
    }
  };

  const handleSearch = async () => {
    setErrorMessage(""); // Clear any previous error messages
    if (searchText.trim()) {
      const foodFactsUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchText}&search_simple=1&action=process&json=true`;
      const beautyFactsUrl = `https://world.openbeautyfacts.org/cgi/search.pl?search_terms=${searchText}&search_simple=1&action=process&json=true`;

      try {
        const foodProducts = await fetchProducts(foodFactsUrl);
        if (foodProducts.length > 0) {
          navigation.replace("SearchResult", { products: foodProducts });
          return;
        }

        const beautyProducts = await fetchProducts(beautyFactsUrl);
        if (beautyProducts.length > 0) {
          navigation.replace("SearchResult", { products: beautyProducts });
          return;
        }

        // No products found in both APIs
        setErrorMessage(
          "No products found. Please try a different search term."
        );
      } catch (error) {
        setErrorMessage("Error searching products. Please try again later.");
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
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
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
  errorText: {
    marginTop: 20,
    textAlign: "center",
    color: "red",
    fontSize: 16,
  },
});
