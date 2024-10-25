import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  Image,
  Keyboard,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useReviews } from "./ReviewsContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Svg, { Circle, G } from "react-native-svg";
import { MaterialIcons } from "@expo/vector-icons";

const RADIUS = 100;
const STROKE_WIDTH = 20;

export default function SuccessScreen({ route }) {
  const { product } = route.params;

  const { reviewsDB, fetchReviews, addReview } = useReviews();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState("");
  const [overallRating, setOverallRating] = useState(0);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const productId = product.product.id;
      fetchReviews(productId);
      if (reviewsDB[productId]) {
        setReviews(reviewsDB[productId]);
        calculateOverallRating(reviewsDB[productId]);
      }
    }, [product, reviewsDB])
  );

  const handleAddRating = () => {
    const parsedRating = parseInt(rating, 10);
    if (!parsedRating || parsedRating < 1 || parsedRating > 5) {
      alert("Please enter a rating between 1 and 5.");
      return;
    }

    const productId = product.product.id;

    addReview(productId, {
      name: "Anonymous",
      rating: parsedRating,
      text: "",
      date: new Date().toISOString(),
    });

    setRating("");
    Keyboard.dismiss();
  };

  const calculateOverallRating = (reviews) => {
    if (reviews.length === 0) return;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = total / reviews.length;
    setOverallRating(average.toFixed(1));
  };
  const placeholderAvatar = require("../assets/images/thumbnail.jpeg");

  const getScoreColor = (score) => {
    if (score > 75) return "#3BB273";
    if (score >= 50) return "#B5E48C";
    if (score >= 25) return "#F9C74F";
    return "#F94144";
  };
  const nutriScoreValue = product.product.nutriments["nutrition-score-fr"] || 0;
  const ecoScoreValue = product.product.ecoscore_score || 0;
  const normalizedNutriValue = (nutriScoreValue / 100) * 2 * Math.PI * RADIUS;
  const normalizedEcoValue = (ecoScoreValue / 100) * 2 * Math.PI * RADIUS;
  const StarRating = ({ rating }) => {
    const totalStars = 5;
    const filledStars = Math.round(rating);

    return (
      <View style={styles.starsContainer}>
        {Array.from({ length: totalStars }, (_, index) => (
          <MaterialIcons
            key={index}
            name={index < filledStars ? "star" : "star-border"}
            size={24}
            color={index < filledStars ? "#FFD700" : "#C0C0C0"}
          />
        ))}
      </View>
    );
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
      keyboardShouldPersistTaps="handled"
    >
      <View>
        <Text style={styles.productName}>{product.product.product_name}</Text>
        <Text style={styles.brandText}>Brand: {product.product.brands}</Text>
        <Text style={styles.label}>Nutri-Score:</Text>
        <View style={styles.chartContainer}>
          <Svg
            height={RADIUS * 2 + STROKE_WIDTH}
            width={RADIUS * 2 + STROKE_WIDTH}
          >
            <Circle
              cx={RADIUS + STROKE_WIDTH / 2}
              cy={RADIUS + STROKE_WIDTH / 2}
              r={RADIUS}
              stroke="#E0E0E0"
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />
            <G
              rotation="-90"
              origin={`${RADIUS + STROKE_WIDTH / 2}, ${
                RADIUS + STROKE_WIDTH / 2
              }`}
            >
              <Circle
                cx={RADIUS + STROKE_WIDTH / 2}
                cy={RADIUS + STROKE_WIDTH / 2}
                r={RADIUS}
                stroke={getScoreColor(nutriScoreValue)}
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={`${normalizedNutriValue} ${
                  2 * Math.PI * RADIUS
                }`}
                fill="none"
              />
            </G>
          </Svg>
          <Text style={styles.chartLabel}>{nutriScoreValue}%</Text>
        </View>
        <View style={styles.tableContainer}>
          <Text style={styles.tableHeader}>Nutritional Info (per 100g)</Text>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Energy:</Text>
            <Text style={styles.tableCell}>
              {Math.round(
                (product.product.nutriments["energy-kcal_100g"] || 0) * 100
              ) / 100}{" "}
              kcal
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Carbohydrates:</Text>
            <Text style={styles.tableCell}>
              {Math.round(
                (product.product.nutriments.carbohydrates_value || 0) * 100
              ) / 100}{" "}
              g
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Fat:</Text>
            <Text style={styles.tableCell}>
              {Math.round((product.product.nutriments.fat_value || 0) * 100) /
                100}{" "}
              g
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Protein:</Text>
            <Text style={styles.tableCell}>
              {Math.round(
                (product.product.nutriments.proteins_value || 0) * 100
              ) / 100}{" "}
              g
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Saturated Fat:</Text>
            <Text style={styles.tableCell}>
              {Math.round(
                (product.product.nutriments["saturated-fat_value"] || 0) * 100
              ) / 100}{" "}
              g
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Sugar:</Text>
            <Text style={styles.tableCell}>
              {Math.round(
                (product.product.nutriments.sugars_value || 0) * 100
              ) / 100}{" "}
              g
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Salt:</Text>
            <Text style={styles.tableCell}>
              {Math.round((product.product.nutriments.salt_value || 0) * 100) /
                100}{" "}
              g
            </Text>
          </View>
        </View>
        <Text style={styles.label}>Nutrient Levels:</Text>
        <View style={styles.badgeContainer}>
          {product.product.nutrient_levels_tags.map((item, index) => {
            const formattedItem = item.replace("en:", "").replace(/-/g, " ");
            const capitalizedItem =
              formattedItem.charAt(0).toUpperCase() + formattedItem.slice(1);
            return (
              <View key={index} style={styles.badge}>
                <Text style={styles.badgeText}>{capitalizedItem}</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.label}>Allergens:</Text>
        <View style={styles.allergenContainer}>
          <Text style={styles.allergenText}>
            {product.product.allergens ? product.product.allergens : "None"}
          </Text>
        </View>

        <Text style={styles.label}>EcoScore:</Text>
        <View style={styles.chartContainer}>
          <Svg
            height={RADIUS * 2 + STROKE_WIDTH}
            width={RADIUS * 2 + STROKE_WIDTH}
          >
            <Circle
              cx={RADIUS + STROKE_WIDTH / 2}
              cy={RADIUS + STROKE_WIDTH / 2}
              r={RADIUS}
              stroke="#E0E0E0"
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />
            <G
              rotation="-90"
              origin={`${RADIUS + STROKE_WIDTH / 2}, ${
                RADIUS + STROKE_WIDTH / 2
              }`}
            >
              <Circle
                cx={RADIUS + STROKE_WIDTH / 2}
                cy={RADIUS + STROKE_WIDTH / 2}
                r={RADIUS}
                stroke={getScoreColor(ecoScoreValue)}
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={`${normalizedEcoValue} ${
                  2 * Math.PI * RADIUS
                }`}
                fill="none"
              />
            </G>
          </Svg>
          <Text style={styles.chartLabel}>{ecoScoreValue}%</Text>
        </View>
        <View>
          <Text style={styles.label}>Overall User Rating:</Text>
          <StarRating rating={overallRating} />
          <Text style={styles.overallRating}>
            {overallRating ? `${overallRating} / 5` : "No ratings yet"}
          </Text>
        </View>
      </View>

      <View style={styles.ratingContainer}>
        <Text style={styles.label}>Rating (1-5):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={rating}
          onChangeText={(value) => setRating(value)}
          placeholder="Enter your rating"
          placeholderTextColor="#A9A9A9"
        />
        <View style={styles.buttonWrapper}>
          <Button title="Submit Rating" onPress={handleAddRating} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Submit a Review"
            onPress={() => navigation.navigate("SubmitReview", { product })}
          />
        </View>
      </View>

      {/* Reviews List */}
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>User Reviews</Text>
        <FlatList
          data={reviews.filter((item) => item.text)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const reviewDate =
              item.date && item.date.seconds
                ? new Date(item.date.seconds * 1000).toLocaleDateString()
                : "Unknown Date";
            return (
              <View style={styles.reviewItem}>
                <Image source={placeholderAvatar} style={styles.avatar} />
                <View style={styles.reviewContent}>
                  <Text style={styles.reviewName}>
                    {item.name || "Anonymous"}
                  </Text>
                  <Text style={styles.reviewDate}>{reviewDate}</Text>
                  <Text style={styles.reviewText}>Rating: {item.rating}/5</Text>
                  <Text style={styles.reviewDescription}>{item.text}</Text>
                </View>
              </View>
            );
          }}
          scrollEnabled={false}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f9f9f9",
  },
  productName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
  },
  brandText: {
    fontSize: 20,
    marginBottom: 10,
    color: "#666",
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    marginTop: 15,
    marginBottom: 5,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  chartLabel: {
    position: "absolute",
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  tableContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
    padding: 10,
    textAlign: "center",
    fontSize: 18,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableCell: {
    fontSize: 16,
    color: "#333",
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  badge: {
    backgroundColor: "#e0f7fa",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
    elevation: 2,
  },
  badgeText: {
    color: "#00796b",
    fontWeight: "bold",
    textAlign: "center",
  },
  allergenContainer: {
    backgroundColor: "#FFE0B2",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#FF9800",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  allergenText: {
    fontSize: 16,
    color: "#E65100",
    fontWeight: "bold",
    textAlign: "center",
  },
  overallRating: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28a745",
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  ratingContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    margin: 10,
  },
  input: {
    height: 40,
    borderColor: "#C0C0C0",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#F9F9F9",
  },

  buttonWrapper: {
    marginVertical: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  reviewItem: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  reviewContent: {
    flex: 1,
  },
  reviewName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  reviewDate: {
    fontSize: 12,
    color: "#A9A9A9",
    marginBottom: 5,
  },
  reviewText: {
    fontSize: 14,
    color: "#FFAA00",
    marginBottom: 5,
  },
  reviewDescription: {
    fontSize: 14,
    color: "#666",
  },
});
