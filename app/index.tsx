// app/index.tsx
import { useState } from 'react'
import {
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Alert,
} from 'react-native'
import { Text, Button } from 'react-native-paper'
import { useRouter } from 'expo-router'
import { db, doc, getDoc, setDoc } from '../firebaseConfig'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function LoginScreen() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Please fill in both fields')
            return
        }

        setLoading(true)
        try {
            const userRef = doc(db, 'users', email)
            const snapshot = await getDoc(userRef)

            if (!snapshot.exists()) {
                await setDoc(userRef, {
                    email,
                    password,
                    projectsCount: 0,
                    tasksCompleted: 0,
                    tasksPending: 0,
                    tasksDue: 0,
                })
            } else if (snapshot.data().password !== password) {
                Alert.alert('Incorrect password')
                setLoading(false)
                return
            }

            // ✅ Store email in local state / AsyncStorage (or context)
            await AsyncStorage.setItem('userEmail', email)
            router.replace('(tabs)/home') // 👈 Navigate to home screen
        } catch (err) {
            Alert.alert('Login error')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <KeyboardAvoidingView style={styles.loginContainer}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />
            <Button mode="contained" onPress={handleLogin} loading={loading}>
                Login / Register
            </Button>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 6,
        marginBottom: 12,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        marginRight: 'auto',
        marginLeft: 'auto',
    },
})
