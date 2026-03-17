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

### What the app does

RecipeBook lets you create, browse, edit and delete cooking recipes. Recipes are organized by meal categories (Breakfast, Lunch, Dinner, Desserts, Snacks). You can also take photos of your food and theres a cooking timer that notifies you when the food is ready.

### User Flow

1. **Register/Login** - when you open the app you see the login screen. If you dont have account you tap "Sign Up" and create one. The app remembers you so next time it logs in automatically.

2. **Browse recipes** - after login you see the bottom tabs with 5 categories. Tap on any to see recipes in that category. Pull down to refresh the list.

3. **Add recipe** - tap the + button in the header to add new recipe. Fill in the title, ingredients, instructions, pick difficulty and cuisine, set cook time with the slider, and optionaly add a photo from camera or gallery.

4. **View recipe details** - tap on any recipe card to see full details. From here you can start the cooking timer, edit the recipe, or delete it.

5. **Edit recipe** - from the detail screen tap Edit to change anything about the recipe.

6. **Delete recipe** - from the detail screen tap Delete, confirm, and its gone.

7. **Cooking timer** - on the detail screen tap Start Timer and it counts down based on the cook time. You get a notification and vibration when its done.

8. **Logout** - tap the logout icon (top left) on any recipe list screen.

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
