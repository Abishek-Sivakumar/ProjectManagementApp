import { Stack } from 'expo-router'
import './globals.css'
import { useColorScheme } from 'react-native'
import {
    MD3DarkTheme,
    MD3LightTheme,
    PaperProvider,
    ThemeProvider,
} from 'react-native-paper'
import { Colors } from '@/constants/Color'

export default function RootLayout() {
    const colorScheme = useColorScheme()
    const paperTheme =
        colorScheme === 'dark'
            ? { ...MD3DarkTheme, colors: Colors.dark }
            : { ...MD3LightTheme, colors: Colors.light }
    return (
        <PaperProvider>
            <ThemeProvider>
                <Stack>
                    <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="addProjects"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="[projectid]"
                        options={{ headerShown: false }}
                    />
                </Stack>
            </ThemeProvider>
        </PaperProvider>
    )
}
