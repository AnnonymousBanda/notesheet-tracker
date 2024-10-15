'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const checkLoggedIn = async () => {
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

	const isAuthenticated = () => !!user

	const isAdmin = () => user && user.role === 'admin'

	const login = async (token) => {
		localStorage.setItem('jwt', token)

		try {
			const res = await fetch('http://localhost:8000/api/user/me', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			const data = await res.json()

			if (res.status === 200) {
				console.log('login success')
				setUser(data.user)
			} else {
				alert(data.message)
			}
		} catch (error) {
			alert(error.message)
		}
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
