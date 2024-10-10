'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)
	const router = useRouter()

	useEffect(() => {
		const checkLoggedIn = async () => {
			const token = localStorage.getItem('jwt')

			if (token) {
				const decoded = jwtDecode(token)

				const res = await (
					await fetch('http://localhost:8000/api/user/me', {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					})
				).json()

				setUser(res.user)
			}

			setLoading(false)
		}
		checkLoggedIn()
	}, [])

	const isAuthenticated = () => !!user

	const isAdmin = () => user && user.role === 'admin'

	const login = (token) => {
		localStorage.setItem('jwt', token)

		const decoded = jwtDecode(token)

		setUser(decoded)

		router.push('/')
	}

	const logout = () => {
		localStorage.removeItem('jwt')

		setUser(null)

		router.push('/auth/login')
	}

	return (
		<AuthContext.Provider
			value={{ user, login, logout, isAuthenticated, isAdmin }}
		>
			{!loading && children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
