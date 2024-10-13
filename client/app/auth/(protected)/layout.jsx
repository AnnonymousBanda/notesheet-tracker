'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Layout = ({ children }) => {
	const [loading, setLoading] = useState(true)
	const router = useRouter()
	const { user, isAuthenticated } = useAuth()

	useEffect(() => {
		if (isAuthenticated()) {
			router.push('/')
		} else {
			setLoading(false)
		}
	}, [user, isAuthenticated, router])

	if (loading) {
		return <div>Loading...</div>
	}

	return <>{children}</>
}

export default Layout
