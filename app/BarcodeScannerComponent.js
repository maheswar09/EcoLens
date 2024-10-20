import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function BarcodeScannerComponent() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [searchText, setSearchText] = useState("");
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
        console.log("Scanning state reset automatically");
        console.log("Scanning state reset:", scanned);
      }, 2000); // Reset after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [scanned]);

  const handleBarCodeScanned = useCallback(
    ({ type, data }) => {
      if (!scanned) {
        console.log("Bar code Scanned");
        setScanned(true);
        navigation.navigate("SuccessScreen", { type, data });
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
});
