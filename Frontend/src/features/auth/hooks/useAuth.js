import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";



export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context


    const handleLogin = async ({ email, password }) => {
    setLoading(true)
    try {
        const data = await login({ email, password })
        setUser(data.user)
        return true; // ✅ ADD THIS
    } catch (err) {
        return false; // ✅ ADD THIS
    } finally {
        setLoading(false)
    }
}

const handleRegister = async ({ username, email, password }) => {
    setLoading(true)
    try {
        await register({ username, email, password })
        return true; // ✅ just success, no login
    } catch (err) {
        return false;
    } finally {
        setLoading(false)
    }
}

    const handleLogout = async () => {
        setLoading(true)
        try {
            const data = await logout()
            setUser(null)
        } catch (err) {

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        const getAndSetUser = async () => {
            try {

                const data = await getMe()
                setUser(data.user)
            } catch (err) { } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}