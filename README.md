# RecipeBook

Mobile app for saving and organizing your recipes. Made with React Native and Expo.

## APK Download

[Download Android APK](https://expo.dev/artifacts/eas/tq8ogQgopiAWU7gLNiG6oJ.apk)

[Download iOS build](https://expo.dev/artifacts/eas/2XXmUL2JcvY7pB7EsXxagH.tar.gz)

## How to install and run

1. Clone the repo
```
git clone <repo-url>
cd RecipeBook
```

2. Install the packages
```
npm install
```

3. Start the app
```
npx expo start
```

Then scan the QR code with Expo Go on your phone or press `a` for android emulator.

## Functional Guide

### 1. Project Overview

**Application Name:** RecipeBook

**Application Category:** Food & Cooking

**Main Purpose:** RecipeBook is a mobile app where you can save and organize your cooking recipes. You can sort them by meal type like breakfast or dinner, add photos, and use a built in cooking timer. It solves the problem of having recipes scattered everywhere - now they are all in one place on your phone.

### 2. User Access & Permissions

**Guest (Not Authenticated)**
- A guest user can only see the Login and Register screens
- They cant browse recipes or do anything else until they log in
- There is no guest mode, you have to create an account

**Authenticated User**
- Can see all 5 category tabs (Breakfast, Lunch, Dinner, Desserts, Snacks)
- Can view the recipe list and tap on any recipe to see the details
- Can create new recipes with the + button
- Can edit or delete any recipe from the detail screen
- Can use the cooking timer
- Can logout with the logout button in the header

### 3. Authentication & Session Handling

**Authentication Flow**
1. When the app starts it checks if theres already a logged in user using Firebase `onAuthStateChanged`
2. While its checking it shows a loading spinner
3. If the user is logged in it goes straight to the main tabs, if not it shows the login screen
4. When the user logs in with email and password, Firebase authenticates them and the app automatically switches to the main screen
5. On logout we call `signOut` from Firebase and the app goes back to the login screen

**Session Persistence**
- Firebase handles session storage automatically, it saves the token on the device
- So when you close and reopen the app you dont have to log in again, it remembers you

### 4. Navigation Structure

**Root Navigation Logic**
- In `App.js` we use `RootNavigator` that checks `useAuth()` for the user state
- If user exists it shows `MainApp` (the tabs), if not it shows `AuthStack` (login/register)
- Its basically: `{user ? <MainApp /> : <AuthStack />}`

**Main Navigation**
- The main navigation is a Bottom Tab Navigator with 5 tabs
- Each tab is a meal category: Breakfast, Lunch, Dinner, Desserts, Snacks
- Each tab has its own icon (Sun, Utensils, Moon, IceCream, Cookie)

**Nested Navigation**
- Yes, each tab has a Stack Navigator inside it (`CategoryStack`)
- The stack has 3 screens: RecipeList -> RecipeDetail -> AddRecipe
- So you can go from the list to a recipe detail and then to edit, all inside one tab

### 5. List to Details Flow

**List / Overview Screen**
- Shows recipe cards for the selected category fetched from Firestore
- Each card shows the recipe image (or a placeholder), title, cook time, difficulty, servings and cuisine
- You tap on a card to go to the details
- You can pull down to refresh the list

**Details Screen**
- Navigation is triggered by tapping a recipe card, which calls `navigation.navigate('RecipeDetail', { recipeId: item.id })`
- The detail screen receives `recipeId` via `route.params` and then fetches the full recipe data from Firestore using that id

### 6. Data Source & Backend

**Backend Type:** Real backend - Firebase (Firestore for the database, Firebase Auth for authentication)

- Recipes are stored in a `recipes` collection in Firestore
- Each recipe is a document with fields like title, ingredients, instructions, cookTime, difficulty, servings, cuisine, category, and image
- Authentication uses Firebase Auth with email and password

### 7. Data Operations (CRUD)

**Read (GET)**
- `getRecipesByCategory(category)` - fetches all recipes that match a category, used on the RecipeList screen
- `getRecipeById(id)` - fetches a single recipe by its id, used on the RecipeDetail screen

**Create (POST)**
- The user taps the + button in the header to open the AddRecipe form
- They fill in all the fields and tap "Create Recipe"
- `createRecipe(data)` adds a new document to the `recipes` collection with a `createdAt` timestamp

**Update (PUT)**
- From the detail screen the user taps Edit, which opens the same form but pre-filled with the existing data
- After editing they tap "Update Recipe"
- `updateRecipe(id, data)` updates the document in Firestore and adds an `updatedAt` timestamp

**Delete (DELETE)**
- From the detail screen the user taps Delete
- A confirmation alert pops up asking "Are you sure?"
- If they confirm, `deleteRecipe(id)` removes the document from Firestore
- The app navigates back to the list which refreshes automatically

### 8. Forms & Validation

**Forms Used**
- Login form (email, password)
- Register form (email, password, confirm password)
- Add/Edit Recipe form (title, ingredients, instructions, servings, cook time, difficulty, cuisine, category, image)

**Validation Rules**
- **Email** (Login & Register): must not be empty, checked with `!email.trim()`
- **Password** (Login & Register): must not be empty AND must be at least 6 characters long (two rules)
- **Confirm Password** (Register only): must not be empty AND must match the password field
- **Title** (Recipe form): required, cant be empty
- **Ingredients** (Recipe form): required, cant be empty
- **Instructions** (Recipe form): required, cant be empty
- **Servings** (Recipe form): must not be empty, must be a valid number, and must be at least 1

### 9. Native Device Features

**Used Native Features:**

1. **Camera / Image Picker** (`expo-image-picker`)
   - Used on the Add/Edit Recipe screen
   - The user can tap "Add Photo" and choose between Camera or Gallery
   - Camera requires permission which we request with `requestCameraPermissionsAsync()`
   - The image is displayed as a preview in the form and saved with the recipe

2. **Notifications** (`expo-notifications`)
   - Used on the Recipe Detail screen for the cooking timer
   - When the timer finishes it sends a push notification saying "Your [recipe name] is ready!"
   - We also request notification permissions before starting the timer

3. **Haptics** (`expo-haptics`)
   - Used together with the timer
   - Gives a haptic vibration when you start the timer and a different one when it finishes
   - Makes it feel more responsive

### 10. Typical User Flow

1. User opens the app and sees the login screen. They enter their email and password and tap Log In (or they register a new account first)
2. After login they see the bottom tabs with 5 categories. They tap on "Dinner" to see dinner recipes
3. They tap the + button to add a new recipe. They fill in the title, ingredients, instructions, pick difficulty as "Medium", choose "Italian" cuisine, set cook time to 45 minutes with the slider, and take a photo with the camera
4. They go back to the list and see their new recipe. They tap on it to see the full details
5. They tap "Start Timer" and the countdown begins. When its done they get a notification and a vibration
6. Later they realize they forgot an ingredient so they tap Edit, add it, and save
7. They tap the logout icon when they are done

### 11. Error & Edge Case Handling

**Authentication errors:**
- If login fails (wrong email/password) an Alert shows "Invalid email or password"
- If registration fails (email already exists) an Alert shows "This email is already registered"
- If the email format is wrong it shows "Please enter a valid email address"
- General errors show "Something went wrong. Please try again."

**Network or data errors:**
- If recipes fail to load the list screen shows an error message with a "Try Again" button
- If a single recipe fails to load the detail screen also shows an error with retry
- If creating/updating/deleting a recipe fails an Alert shows "Something went wrong"

**Empty or missing data states:**
- If a category has no recipes yet it shows "No [category] recipes yet" with a hint to tap + to add one
- If a recipe has no image a placeholder icon is shown instead
- If a recipe is not found (deleted by someone else maybe) it shows "Recipe not found"

### Screens

| Screen | Description |
|--------|------------|
| Login | email and password login with validation |
| Register | create new account with password confirmation |
| Recipe List | shows recipes for selected category, pull to refresh |
| Recipe Detail | full recipe info with timer and edit/delete options |
| Add/Edit Recipe | form for creating or editing recipe with image picker |

### Tech used

- React Native with Expo
- Firebase for auth and database (Firestore)
- Bottom tabs + stack navigators for navigation
- expo-image-picker for camera and gallery
- expo-haptics and expo-notifications for the timer
- Slider and custom pickers for the recipe form
- KeyboardAvoidingView so keyboard doesnt cover inputs
