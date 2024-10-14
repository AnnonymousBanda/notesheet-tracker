'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)
	const router = useRouter()

	useEffect(() => {
		const checkLoggedIn = async () => {
			// const token = Cookies.get('jwt')
			const token = localStorage.getItem('jwt')

			if (token) {
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

	useEffect(() => {
		if (!isAuthenticated()) {
			router.push('/auth/login')
		}
	}, [user])

	const isAuthenticated = () => !!user

	const isAdmin = () => user && user.role === 'admin'

	const login = async (token) => {
		// Cookies.set('jwt', token, { expires: 1 })
		localStorage.setItem('jwt', token)

		const res = await (
			await fetch('http://localhost:8000/api/user/me', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		).json()

		setUser(res.user)
	}

	const logout = () => {
		// Cookies.remove('jwt')
		localStorage.removeItem('jwt')

		setUser(null)
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
