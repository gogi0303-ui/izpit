import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Camera } from 'lucide-react-native';

import * as ImagePicker from 'expo-image-picker';
import { createRecipe, updateRecipe } from '../services/recipeService';

const CUISINES = ['Italian', 'Asian', 'Mexican', 'Mediterranean', 'American', 'French', 'Indian', 'Other'];

export default function AddRecipeScreen({ route, navigation }) {
  const editingRecipe = route.params?.recipe;
  const defaultCategory = route.params?.category || 'Breakfast';
  const isEditing = !!editingRecipe;

  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [cookTime, setCookTime] = useState(30);
  const [difficulty, setDifficulty] = useState('Easy');
  const [servings, setServings] = useState('2');
  const [cuisine, setCuisine] = useState('Italian');
  const [category, setCategory] = useState(defaultCategory);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingRecipe) {
      setTitle(editingRecipe.title || '');
      setIngredients(editingRecipe.ingredients || '');
      setInstructions(editingRecipe.instructions || '');
      setCookTime(editingRecipe.cookTime || 30);
      setDifficulty(editingRecipe.difficulty || 'Easy');
      setServings(String(editingRecipe.servings || 2));
      setCuisine(editingRecipe.cuisine || 'Italian');
      setCategory(editingRecipe.category || defaultCategory);
      if (editingRecipe.image) setImage(editingRecipe.image);
    }
  }, [editingRecipe]);

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Recipe' : 'Add Recipe',
    });
  }, [isEditing]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Camera permission is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePickImage = () => {
    Alert.alert('Add Photo', 'Choose an option', [
      { text: 'Camera', onPress: takePhoto },
      { text: 'Gallery', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const validate = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!ingredients.trim()) {
      newErrors.ingredients = 'Ingredients are required';
    }

    if (!instructions.trim()) {
      newErrors.instructions = 'Instructions are required';
    }

    if (!servings.trim() || isNaN(Number(servings)) || Number(servings) < 1) {
      newErrors.servings = 'Enter a valid number of servings';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const data = {
        title: title.trim(),
        ingredients: ingredients.trim(),
        instructions: instructions.trim(),
        cookTime,
        difficulty,
        servings: Number(servings),
        cuisine,
        category,
        image: image || null,
      };

      if (isEditing) {
        await updateRecipe(editingRecipe.id, data);
        Alert.alert('Success', 'Recipe updated!');
      } else {
        await createRecipe(data);
        Alert.alert('Success', 'Recipe created!');
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.imagePickerButton} onPress={handlePickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Camera size={36} color="#999" />
              <Text style={styles.imagePlaceholderText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="Recipe name"
            value={title}
            onChangeText={setTitle}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ingredients *</Text>
          <TextInput
            style={[styles.textArea, errors.ingredients && styles.inputError]}
            placeholder="List your ingredients..."
            value={ingredients}
            onChangeText={setIngredients}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.ingredients && <Text style={styles.errorText}>{errors.ingredients}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Instructions *</Text>
          <TextInput
            style={[styles.textArea, errors.instructions && styles.inputError]}
            placeholder="Step by step instructions..."
            value={instructions}
            onChangeText={setInstructions}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          {errors.instructions && <Text style={styles.errorText}>{errors.instructions}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Servings</Text>
          <TextInput
            style={[styles.input, errors.servings && styles.inputError]}
            placeholder="Number of servings"
            value={servings}
            onChangeText={setServings}
            keyboardType="numeric"
          />
          {errors.servings && <Text style={styles.errorText}>{errors.servings}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cook Time: {cookTime} minutes</Text>
          <Slider
            style={styles.slider}
            minimumValue={5}
            maximumValue={180}
            step={5}
            value={cookTime}
            onValueChange={setCookTime}
            minimumTrackTintColor="#E85D3A"
            maximumTrackTintColor="#ddd"
            thumbTintColor="#E85D3A"
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>5 min</Text>
            <Text style={styles.sliderLabel}>180 min</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Difficulty</Text>
          <View style={styles.buttonRow}>
            {['Easy', 'Medium', 'Hard'].map((level) => (
              <TouchableOpacity
                key={level}
                style={[styles.optionButton, difficulty === level && styles.optionButtonActive]}
                onPress={() => setDifficulty(level)}
              >
                <Text style={[styles.optionText, difficulty === level && styles.optionTextActive]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cuisine</Text>
          <View style={styles.cuisineGrid}>
            {CUISINES.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.optionButton, cuisine === c && styles.optionButtonActive]}
                onPress={() => setCuisine(c)}
              >
                <Text style={[styles.optionText, cuisine === c && styles.optionTextActive]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.cuisineGrid}>
            {['Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Snacks'].map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.optionButton, category === cat && styles.optionButtonActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.optionText, category === cat && styles.optionTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>
              {isEditing ? 'Update Recipe' : 'Create Recipe'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    minHeight: 100,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 12,
    color: '#999',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cuisineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  optionButtonActive: {
    backgroundColor: '#E85D3A',
    borderColor: '#E85D3A',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  optionTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  imagePickerButton: {
    marginBottom: 18,
    borderRadius: 10,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0e6e0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  imagePlaceholderIcon: {
    fontSize: 36,
    marginBottom: 6,
  },
  imagePlaceholderText: {
    color: '#999',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#E85D3A',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
