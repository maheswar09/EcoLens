import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BarcodeScannerComponent from './BarcodeScannerComponent';
import SuccessScreen from './SuccessScreen';
import SearchResult from './SearchResult';
import ProfileScreen from './ProfileScreen';
import ListsScreen from './ListsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FullScreenSearch from './FullScreenSearch';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
function ScanStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Scanner" 
        component={BarcodeScannerComponent} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SuccessScreen" 
        component={SuccessScreen} 
        options={{ title: 'Scan Result' }}
      />
      <Stack.Screen 
        name="SearchResult" 
        component={SearchResult} 
        options={{ title: 'Search Result' }}
      />
      <Stack.Screen
        name="FullScreenSearch"  // Add new screen to the stack
        component={FullScreenSearch}
        options={{ title: "Search" }}
      />
    </Stack.Navigator>
  );
}

export default function Index() {
  return (
    
      <Tab.Navigator
      initialRouteName="Scan"
        screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Scan') {
            iconName = focused ? 'scan' : 'scan-outline';
          } else if (route.name === 'Lists') {
            iconName = focused ? 'list' : 'list-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: [
          {
            display: "flex"
          },
          null
        ]
      })}
      >
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Scan" component={ScanStack} />
        <Tab.Screen name="Lists" component={ListsScreen} />
      </Tab.Navigator>
    
  );
}