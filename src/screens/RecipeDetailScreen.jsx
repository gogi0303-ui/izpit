import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Clock, Gauge, Users, Pencil, Trash2, UtensilsCrossed } from 'lucide-react-native';
import { getRecipeById, deleteRecipe } from '../services/recipeService';

export default function RecipeDetailScreen({ route, navigation }) {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRecipe();
  }, [recipeId]);

  const loadRecipe = async () => {
    try {
      setError(null);
      const data = await getRecipeById(recipeId);
      if (!data) {
        setError('Recipe not found.');
      } else {
        setRecipe(data);
      }
    } catch (err) {
      setError('Failed to load recipe.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to delete this recipe?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecipe(recipeId);
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete recipe.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E85D3A" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadRecipe}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {recipe.image ? (
        <Image source={{ uri: recipe.image }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <UtensilsCrossed size={60} color="#ccc" />
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{recipe.title}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Clock size={18} color="#E85D3A" />
            <Text style={styles.metaText}>{recipe.cookTime} min</Text>
          </View>
          <View style={styles.metaItem}>
            <Gauge size={18} color="#E85D3A" />
            <Text style={styles.metaText}>{recipe.difficulty}</Text>
          </View>
          <View style={styles.metaItem}>
            <Users size={18} color="#E85D3A" />
            <Text style={styles.metaText}>{recipe.servings} servings</Text>
          </View>
        </View>

        {recipe.cuisine ? (
          <View style={styles.cuisineTag}>
            <Text style={styles.cuisineText}>{recipe.cuisine}</Text>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Ingredients</Text>
        <Text style={styles.bodyText}>{recipe.ingredients}</Text>

        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.bodyText}>{recipe.instructions}</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('AddRecipe', { recipe })}
          >
            <Pencil size={18} color="#fff" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Trash2 size={18} color="#fff" />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 250,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0e6e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
  },
  cuisineTag: {
    backgroundColor: '#FFF0EB',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  cuisineText: {
    fontSize: 13,
    color: '#E85D3A',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 30,
    marginBottom: 40,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#E85D3A',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#e74c3c',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#E85D3A',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
});
