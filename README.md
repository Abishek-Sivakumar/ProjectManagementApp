# 📋 Project Management App

This is an [Expo](https://expo.dev) app built with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app). The app helps users manage projects and tasks efficiently with features like authentication, project tracking, task analytics (via pie charts), and user dashboards.

---

## 🚀 Features

- 📂 Create, View, and Delete Projects
- ✅ Add and Track Tasks (with status and priority)
- 📊 Visual Task Summary with Pie Chart
- ☁️ Firestore integration for real-time data
- 🧠 Dynamic Dashboard based on user login
- 🔁 Automatic refresh on tab focus

---

## 🧑‍💻 Tech Stack

- **React Native (Expo)**
- **Firebase (Firestore)**
- **React Native Paper** for UI components
- **React Navigation & Expo Router**
- **react-native-chart-kit** for charts

---

## ⚙️ Get Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/project-management-app.git
cd project-management-app
```

### 2.Install dependencies 
```aiignore
   npx expo install
```

### 3.Change config for Firebase
```aiignore
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
```
Inittialize your own keys by using a .env file

### 3.Run the app on Expo Go using
```aiignore
   npx expo start
```

## Modules Completed 
Project Management Module\
Task Management Module\
Dashboard & Analytics Module

## Modules Pending
Authentication Module

PS: I have alternatively implemented a custom login page using Firestore



