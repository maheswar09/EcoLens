import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../firebase.config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function ListsScreen() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigation = useNavigation();

  const fetchWishlistItems = async () => {
    if (!auth.currentUser) {
      setWishlistItems([]);
      return;
    }

    const userId = auth.currentUser.uid;
    const wishlistRef = collection(db, "wishlists");
    const q = query(wishlistRef, where("userId", "==", userId));

    try {
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWishlistItems(items);
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
      setWishlistItems([]);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchWishlistItems();
      } else {
        setWishlistItems([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchWishlistItems();
    }, [])
  );

  const renderWishlistItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => {
        navigation.navigate("WishlistItemDetailScreen", {
          product: item,
        });
      }}
    >
      <Text style={styles.brandName}>{item.brands}</Text>
      <Text style={styles.productName}>{item.product_name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {wishlistItems.length > 0 ? (
        <FlatList
          data={wishlistItems}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.text}>Your wishlist is empty</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    paddingBottom: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  itemCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  brandName: {
    fontSize: 16,
    color: "#666",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
});
