import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function BarcodeScannerComponent() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
      console.log("Camera permission status:", status);
    };

    getBarCodeScannerPermissions();
  }, []);
  useEffect(() => {
    if (scanned) {
      const timer = setTimeout(() => {
        setScanned(false);
        // console.log("Scanning state reset automatically");
        // console.log("Scanning state reset:", scanned);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [scanned]);

  const handleBarCodeScanned = useCallback(
    async ({ type, data }) => {
      if (!scanned) {
        console.log("Bar code scanned, fetching product data...");
        setScanned(true);
        setLoading(true);
        try {
          const response = await axios.get(
            `https://world.openfoodfacts.org/api/v0/product/${data}.json`
          );

          const product = response.data;
          // console.log("Product data:", product);

          navigation.navigate("SuccessScreen", { type, data, product });
        } catch (error) {
          console.error("Error fetching product data:", error);
        } finally {
          setLoading(false);
        }
      }
    },
    [scanned, navigation]
  );

  const navigateToFullScreenSearch = () => {
    navigation.navigate("FullScreenSearch");
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.scannerContainer}>
        <BarCodeScanner
          key={scanned ? "scanned" : "not-scanned"}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Fetching product data...</Text>
        </View>
      )}
      <View style={styles.contentContainer}>
        <Text style={styles.appName}>ECOLENS</Text>
        <View style={styles.appdesc}>
          <Text style={styles.lines}>Scan a barcode or </Text>
          <Text style={styles.lines}>Search for a product</Text>
        </View>
        <View style={styles.searchContainer}>
          <TouchableOpacity
            onPress={navigateToFullScreenSearch}
            style={styles.searchInput}
          >
            <Text
              style={{
                color: "gray",
              }}
            >
              Search for a product
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scannerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.45,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  appdesc: {
    marginBottom: 20,
  },
  lines: {
    textAlign: "center",
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
    paddingTop: SCREEN_HEIGHT * 0.45,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  searchButton: {
    marginLeft: 10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
