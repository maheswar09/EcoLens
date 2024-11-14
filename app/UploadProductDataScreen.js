import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function UploadProductDataScreen({ route, navigation }) {
  const { barcode } = route.params;
  const [loading, setLoading] = useState(false);
  const [wholeProductImage, setWholeProductImage] = useState(null);
  const [nutritionImage, setNutritionImage] = useState(null);
  const [ingredientsImage, setIngredientsImage] = useState(null);

  const takePicture = async (setImage) => {
    const permission = await Camera.requestCameraPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("Camera permission is required to take a photo.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      console.log("Captured image URI:", result.assets[0].uri);
      setImage(result.assets[0].uri);
    } else {
      console.log("Image capture canceled.");
    }
  };

  const uploadImages = async () => {
    console.log("Attempting to upload images...");
    console.log("Whole Product Image:", wholeProductImage);
    console.log("Nutrition Image:", nutritionImage);
    console.log("Ingredients Image:", ingredientsImage);

    if (!wholeProductImage || !nutritionImage || !ingredientsImage) {
      Alert.alert("Please take all required photos before uploading.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("code", barcode);
      formData.append("image_front", {
        uri: wholeProductImage,
        type: "image/jpeg",
        name: "whole_product.jpg",
      });
      formData.append("image_nutrition", {
        uri: nutritionImage,
        type: "image/jpeg",
        name: "nutrition.jpg",
      });
      formData.append("image_ingredients", {
        uri: ingredientsImage,
        type: "image/jpeg",
        name: "ingredients.jpg",
      });

      const response = await axios.post(
        "https://world.openfoodfacts.org/cgi/product_image_upload.pl",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Images uploaded successfully!");
        navigation.goBack();
      } else {
        Alert.alert("Failed to upload images.");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      Alert.alert("Error uploading images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Upload Product Data</Text>

        {/* Whole Product Image Capture Section */}
        <View style={styles.imageCaptureSection}>
          {wholeProductImage && (
            <Image
              source={{ uri: wholeProductImage }}
              style={styles.previewImage}
            />
          )}
          <TouchableOpacity
            style={styles.captureButton}
            onPress={() => takePicture(setWholeProductImage)}
          >
            <Text style={styles.buttonText}>Capture Whole Product Image</Text>
          </TouchableOpacity>
        </View>

        {/* Nutrition Information Image Capture Section */}
        <View style={styles.imageCaptureSection}>
          {nutritionImage && (
            <Image
              source={{ uri: nutritionImage }}
              style={styles.previewImage}
            />
          )}
          <TouchableOpacity
            style={styles.captureButton}
            onPress={() => takePicture(setNutritionImage)}
          >
            <Text style={styles.buttonText}>Capture Nutrition Info Image</Text>
          </TouchableOpacity>
        </View>

        {/* Ingredients Image Capture Section */}
        <View style={styles.imageCaptureSection}>
          {ingredientsImage && (
            <Image
              source={{ uri: ingredientsImage }}
              style={styles.previewImage}
            />
          )}
          <TouchableOpacity
            style={styles.captureButton}
            onPress={() => takePicture(setIngredientsImage)}
          >
            <Text style={styles.buttonText}>Capture Ingredients Image</Text>
          </TouchableOpacity>
        </View>

        {/* Upload Button */}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={uploadImages}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Upload Images</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  imageCaptureSection: {
    marginBottom: 20,
    alignItems: "center",
  },
  captureButton: {
    backgroundColor: "#4682B4",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  previewImage: {
    width: 150,
    height: 150,
    marginVertical: 10,
    borderRadius: 8,
  },
  uploadButton: {
    backgroundColor: "#32CD32",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
});
