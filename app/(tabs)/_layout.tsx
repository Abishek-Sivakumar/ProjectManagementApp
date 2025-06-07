import { Tabs } from 'expo-router'
import { Feather } from '@expo/vector-icons'

export default function TabsLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <>
                            <Feather name="home" size={24} color={color} />
                        </>
                    ),
                }}
            ></Tabs.Screen>
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Dashboard',
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <>
                            <Feather name="activity" size={24} color={color} />
                        </>
                    ),
                }}
            ></Tabs.Screen>
        </Tabs>
    )
}
