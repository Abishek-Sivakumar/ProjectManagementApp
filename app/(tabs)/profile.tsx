import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Dimensions } from 'react-native'
import { Text, Chip, Avatar, useTheme, Divider } from 'react-native-paper'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import { PieChart } from 'react-native-chart-kit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'

export default function Dashboard() {
    const theme = useTheme()
    const screenWidth = Dimensions.get('window').width

    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [userData, setUserData] = useState<any>(null)

    const fetchUserData = async () => {
        try {
            const storedEmail = await AsyncStorage.getItem('userEmail')
            if (!storedEmail) {
                console.warn('No user email found in storage')
                return
            }
            setUserEmail(storedEmail)

            const snapshot = await getDoc(doc(db, 'users', storedEmail))
            if (snapshot.exists()) {
                setUserData(snapshot.data())
            } else {
                console.warn('User data not found')
            }
        } catch (error) {
            console.error('Error fetching user data:', error)
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchUserData()
        }, [])
    )

    if (!userData || !userEmail)
        return <Text style={{ padding: 16 }}>Loading...</Text>

    const { projectsCount, tasksCompleted, tasksDue, tasksPending } = userData

    const pieData = [
        {
            name: 'Completed',
            count: tasksCompleted,
            color: '#4CAF50',
            legendFontColor: '#333',
            legendFontSize: 14,
        },
        {
            name: 'Pending',
            count: tasksPending,
            color: '#FFC107',
            legendFontColor: '#333',
            legendFontSize: 14,
        },
        {
            name: 'Due',
            count: tasksDue,
            color: '#f44336',
            legendFontColor: '#333',
            legendFontSize: 14,
        },
    ]

    return (
        <ScrollView contentContainerStyle={{ padding: 16, marginTop: 50 }}>
            {/* Profile Section */}
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <Avatar.Image
                    size={80}
                    source={{
                        uri: `https://ui-avatars.com/api/?name=${userEmail}&background=random`,
                    }}
                />
                <Text variant="titleLarge" style={{ marginTop: 8 }}>
                    {userEmail}
                </Text>
            </View>

            {/* Chips Row */}
            <View
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 8,
                    marginBottom: 16,
                }}
            >
                <Chip icon="folder" style={{ backgroundColor: '#E3F2FD' }}>
                    Projects: {projectsCount}
                </Chip>
                <Chip icon="check" style={{ backgroundColor: '#C8E6C9' }}>
                    Completed: {tasksCompleted}
                </Chip>
                <Chip icon="timer" style={{ backgroundColor: '#FFF9C4' }}>
                    Pending: {tasksPending}
                </Chip>
                <Chip
                    icon="calendar-alert"
                    style={{ backgroundColor: '#FFCDD2' }}
                >
                    Due: {tasksDue}
                </Chip>
            </View>

            <Divider style={{ marginBottom: 16 }} />

            {/* Pie Chart */}
            <Text
                variant="headlineSmall"
                style={{ textAlign: 'center', marginBottom: 8 }}
            >
                Task Summary
            </Text>
            <PieChart
                data={pieData}
                width={screenWidth - 32}
                height={220}
                chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="count"
                backgroundColor="transparent"
                paddingLeft="16"
                center={[0, 0]}
                absolute
            />
        </ScrollView>
    )
}
