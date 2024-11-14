import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BarcodeScannerComponent from "./BarcodeScannerComponent";
import SuccessScreen from "./SuccessScreen";
import SearchResult from "./SearchResult";
import ProfileScreen from "./ProfileScreen";
import SubmitReviewScreen from "./SubmitReviewScreen";
import ListsScreen from "./ListsScreen";
import RegisterScreen from "./RegisterScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FullScreenSearch from "./FullScreenSearch";
import { Ionicons } from "@expo/vector-icons";
import WishlistItemDetailScreen from "./WishlistItemDetailScreen";
import UploadProductDataScreen from "./UploadProductDataScreen";
import { ReviewsProvider } from "./ReviewsContext";
const Stack = createStackNavigator();
const MainStack = createStackNavigator();
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
        <Stack.Screen
          name="WishlistItemDetailScreen"
          component={WishlistItemDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UploadProductDataScreen"
          component={UploadProductDataScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </ReviewsProvider>
  );
}

function TabNavigator() {
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

export default function Index() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
    </MainStack.Navigator>
  );
}
