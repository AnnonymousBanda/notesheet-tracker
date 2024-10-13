'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

const Protected = ({ children, allowedRoles = ['user', 'admin'] }) => {
	const { user, isAuthenticated } = useAuth()
	const router = useRouter()
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!isAuthenticated()) {
			router.push('/auth/login')
		} else if (allowedRoles.length && !allowedRoles.includes(user?.role)) {
			router.push('/auth/unauthorized')
		} else {
			setLoading(false)
		}
	}, [user, isAuthenticated, router])

	const LoadingComponent = () => <div>Loading...</div>

	if (loading) {
		return <LoadingComponent />
	}

	return <>{children}</>
}

export default Protected
