import { Stack, Tabs } from 'expo-router'

export default function _Layout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{ title: 'Home', headerShown: false }}
            ></Tabs.Screen>
            <Tabs.Screen
                name="profile"
                options={{ title: 'Profile', headerShown: false }}
            ></Tabs.Screen>
        </Tabs>
    )
}
