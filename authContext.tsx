// contexts/authContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react'

type AuthContextType = {
    user: { email: string } | null
    setUser: (user: { email: string } | null) => void
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<{ email: string } | null>(null)

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
