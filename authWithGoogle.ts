import * as Google from 'expo-auth-session/providers/google'
import { AuthSession } from 'expo-auth-session'
import {
    getAuth,
    GoogleAuthProvider,
    signInWithCredential,
} from 'firebase/auth'
import { app } from './firebaseConfig'

const auth = getAuth(app)

export const useGoogleAuth = () => {
    const redirectUri = AuthSession.makeRedirectUri({
        useProxy: true, // ✅ Ensures you're using the https://auth.expo.io/... URL
    })

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
        expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        redirectUri, // ✅ Explicitly pass it
    })

    const signInWithGoogle = async () => {
        const res = await promptAsync()

        if (res?.type === 'success') {
            const { id_token } = res.params
            const credential = GoogleAuthProvider.credential(id_token)
            await signInWithCredential(auth, credential)
        } else {
            console.log('Google Auth cancelled or failed')
        }
    }

    return { request, response, promptAsync, signInWithGoogle }
}
