import { Slot, Stack, useRouter } from 'expo-router'
import './globals.css'
import { useColorScheme } from 'react-native'
import {
    MD3DarkTheme,
    MD3LightTheme,
    PaperProvider,
    ThemeProvider,
} from 'react-native-paper'
import { Colors } from '@/constants/Color'
import { AuthProvider, useAuth } from '../authContext'

export default function RootLayout() {
    const colorScheme = useColorScheme()
    const paperTheme =
        colorScheme === 'dark'
            ? { ...MD3DarkTheme, colors: Colors.dark }
            : { ...MD3LightTheme, colors: Colors.light }

    return (
        <PaperProvider>
            <ThemeProvider>
                <AuthProvider>
                    <LayoutController />
                </AuthProvider>
            </ThemeProvider>
        </PaperProvider>
    )
}

function LayoutController() {
    const { user } = useAuth()

    // 👇 Show login (`/index`) if user not logged in
    return (
        <Stack screenOptions={{ headerShown: false }}>
            {!user ? (
                <Stack.Screen name="index" />
            ) : (
                <Stack.Screen name="(tabs)" />
            )}
            <Stack.Screen name="addProjects" />
            <Stack.Screen name="[projectid]" />
            <Stack.Screen name="addTask" />
            <Stack.Screen name="taskDetails/[taskid]" />
        </Stack>
    )
}
