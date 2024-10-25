import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BarcodeScannerComponent from "./BarcodeScannerComponent";
import SuccessScreen from "./SuccessScreen";
import SearchResult from "./SearchResult";
import ProfileScreen from "./ProfileScreen";
import SubmitReviewScreen from "./SubmitReviewScreen";
import ListsScreen from "./ListsScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FullScreenSearch from "./FullScreenSearch";
import { Ionicons } from "@expo/vector-icons";
import { ReviewsProvider } from "./ReviewsContext";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const productReviewsDB = {};
function ScanStack() {
  return (
    <ReviewsProvider>
      <Stack.Navigator>
        <Stack.Screen
          name="Scanner"
          component={BarcodeScannerComponent}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SuccessScreen"
          component={SuccessScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SearchResult"
          component={SearchResult}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FullScreenSearch"
          component={FullScreenSearch}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SubmitReview"
          component={SubmitReviewScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </ReviewsProvider>
  );
}

export default function Index() {
  const [reviewsDB, setReviewsDB] = useState(productReviewsDB);
  return (
    <Tab.Navigator
      initialRouteName="Scan"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Scan") {
            iconName = focused ? "scan" : "scan-outline";
          } else if (route.name === "Lists") {
            iconName = focused ? "list" : "list-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: [
          {
            display: "flex",
          },
          null,
        ],
      })}
    >
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Lists"
        component={ListsScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
