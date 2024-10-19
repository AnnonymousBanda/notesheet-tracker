'use client'
import Loader from '@/components/Loader'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useDialog } from './DialogBoxContext'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	const {openDialog} = useDialog()

	useEffect(() => {
		const checkLoggedIn = async () => {
			const token = localStorage.getItem('jwt')

			try {
				if (token) {
					const res = await fetch(
						'http://localhost:8000/api/user/me',
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					)

					const data = await res.json()

					if (res.status === 200) setUser(data.user)
					else console.error(data.message)
				}
			} catch (error) {
				console.error(error.message)
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
				setUser(data.user)
			} else {
				openDialog(data.message)
			}
		} catch (error) {
			openDialog('Something went wrong! Please try again later.')
			console.error(error.message)
		}
	}

	const logout = () => {
		localStorage.removeItem('jwt')

		setUser(null)
	}

	return (
		<AuthContext.Provider
			value={{ user, setUser, login, logout, isAuthenticated, isAdmin }}
		>
			{loading ? <Loader /> : children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
