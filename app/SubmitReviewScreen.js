import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useReviews } from "./ReviewsContext";
export default function SubmitReviewScreen({ route }) {
  const { product } = route.params;
  const { addReview } = useReviews();
  const [review, setReview] = useState("");
  const [rating, setRating] = useState("");
  const [name, setName] = useState("");
  const navigation = useNavigation();
  const handleAddReview = () => {
    const parsedRating = parseInt(rating, 10);
    if (!parsedRating || parsedRating < 1 || parsedRating > 5) {
      alert("Please enter a rating between 1 and 5.");
      return;
    }

    const productId = product.product.id;
    const newReview = {
      text: review,
      rating: parsedRating,
      name: name || "Anonymous",
      date: new Date().toISOString(),
    };

    addReview(productId, newReview);

    setReview("");
    setRating("");
    setName("");
    navigation.navigate("SuccessScreen", { product });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Name:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.label}>Your Review:</Text>
      <TextInput style={styles.input} value={review} onChangeText={setReview} />
      <Text style={styles.label}>Rating (1-5):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={rating}
        onChangeText={setRating}
      />
      <Button title="Submit Review" onPress={handleAddReview} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});
