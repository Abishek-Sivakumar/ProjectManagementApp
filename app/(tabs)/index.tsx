import { Text, TextInput, View, Button } from 'react-native'
import { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore'

export default function Index() {
    const firebaseConfig = {
        apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    }

    // Initialize Firebase
    const app = initializeApp(firebaseConfig)

    // Initialize Cloud Firestore and get a reference to the service
    const db = getFirestore(app)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async () => {
        try {
            const docRef = await addDoc(collection(db, 'users'), {
                first: 'Abishek',
                last: 'Sivakumar',
                born: 2004,
            })
            console.log('Document written with ID: ', docRef.id)
        } catch (e) {
            console.error('Error adding document: ', e)
        }
    }

    const displayUsers = async () => {
        const querySnapshot = await getDocs(collection(db, 'users'))
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`)
        })
    }

    return (
        <View className="flex-1 justify-center items-center px-10">
            <Text>Sign In</Text>
            <TextInput
                className="border-2 border-gray-300"
                placeholder="Enter email"
                onChangeText={setEmail}
                value={email}
            />
            <TextInput
                placeholder="Enter Password"
                onChangeText={setPassword}
                value={password}
            />
            <Button title="Login" onPress={handleSubmit} />
            <Button title="Display" onPress={displayUsers} />
        </View>
    )
}
