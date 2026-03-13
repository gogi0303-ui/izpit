import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Sun, UtensilsCrossed, Moon, IceCreamCone, Cookie } from 'lucide-react-native';
import CategoryStack from './CategoryStack';

const Tab = createBottomTabNavigator();

function BreakfastStack() {
  return <CategoryStack category="Breakfast" />;
}

function LunchStack() {
  return <CategoryStack category="Lunch" />;
}

function DinnerStack() {
  return <CategoryStack category="Dinner" />;
}

function DessertsStack() {
  return <CategoryStack category="Desserts" />;
}

function SnacksStack() {
  return <CategoryStack category="Snacks" />;
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#E85D3A',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { paddingBottom: 5, height: 60 },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="BreakfastTab"
        component={BreakfastStack}
        options={{
          tabBarLabel: 'Breakfast',
          tabBarIcon: ({ color, size }) => (
            <Sun size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="LunchTab"
        component={LunchStack}
        options={{
          tabBarLabel: 'Lunch',
          tabBarIcon: ({ color, size }) => (
            <UtensilsCrossed size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="DinnerTab"
        component={DinnerStack}
        options={{
          tabBarLabel: 'Dinner',
          tabBarIcon: ({ color, size }) => (
            <Moon size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="DessertsTab"
        component={DessertsStack}
        options={{
          tabBarLabel: 'Desserts',
          tabBarIcon: ({ color, size }) => (
            <IceCreamCone size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SnacksTab"
        component={SnacksStack}
        options={{
          tabBarLabel: 'Snacks',
          tabBarIcon: ({ color, size }) => (
            <Cookie size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
