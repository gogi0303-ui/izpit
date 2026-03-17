import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Plus, LogOut } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import RecipeListScreen from '../screens/RecipeListScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import AddRecipeScreen from '../screens/AddRecipeScreen';

const Stack = createNativeStackNavigator();

export default function CategoryStack({ category }) {
  const { logout } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#E85D3A' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="RecipeList"
        component={RecipeListScreen}
        initialParams={{ category }}
        options={({ navigation }) => ({
          title: category,
          headerLeft: () => (
            <TouchableOpacity
              onPress={logout}
              style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}
            >
              <LogOut size={22} color="#fff" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('AddRecipe', { category })}
              style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}
            >
              <Plus size={24} color="#fff" strokeWidth={2.5} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{ title: 'Recipe' }}
      />
      <Stack.Screen
        name="AddRecipe"
        component={AddRecipeScreen}
        options={{ title: 'Add Recipe' }}
      />
    </Stack.Navigator>
  );
}
