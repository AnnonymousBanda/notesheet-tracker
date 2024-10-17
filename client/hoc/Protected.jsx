'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Loader from '@/components/Loader'

const Protected = ({ children, allowedRoles = [] }) => {
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
	}, [user])

	if (loading) {
		return <Loader />
	}

	return <>{children}</>
}

export default Protected
