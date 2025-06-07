import { TextInput, View } from 'react-native'
import { useState, useEffect } from 'react'
import { app, db, collection, addDoc, getDocs } from '../../firebaseConfig'
import { Text, Button, Card } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'
import { Feather } from '@expo/vector-icons'

export default function Index() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View className="flex-1 px-5">
                <View
                    style={{
                        flexDirection: 'row',
                        // backgroundColor: 'tomato',
                        justifyContent: 'space-between',
                        padding: 2,
                        alignItems: 'center',
                        marginTop: 30,
                        marginBottom: 20,
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
