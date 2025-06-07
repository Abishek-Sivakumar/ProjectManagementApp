import { TextInput, View } from 'react-native'
import { useState, useEffect } from 'react'
import { app, db, collection, addDoc, getDocs } from '../../firebaseConfig'
import { Text, Button, Card } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'
import { Feather } from '@expo/vector-icons'

export default function Index() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async () => {
        try {
            const docRef = await addDoc(collection(db, 'users'), {
                first: email,
                last: password,
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
        <SafeAreaView style={{ flex: 1 }}>
            <View className="flex-1 px-5">
                <View
                    style={{
                        flexDirection: 'row',
                        backgroundColor: 'tomato',
                        justifyContent: 'space-between',
                        padding: 2,
                        alignItems: 'center',
                        marginTop: 30,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 30,
                            fontWeight: 'bold',
                        }}
                    >
                        Projects List
                    </Text>
                    <Link href="../addProjects" asChild>
                        <Feather name="plus" size={30} color="black" />
                    </Link>
                </View>
                <Link href="/profile" asChild>
                    <Card>
                        <Card.Content>
                            <Text variant="titleLarge">Card title</Text>
                            <Text variant="bodyMedium">Card content</Text>
                        </Card.Content>
                    </Card>
                </Link>
            </View>
        </SafeAreaView>
    )
}
