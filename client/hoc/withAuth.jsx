'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

const withAuth = (WrappedComponent, allowedRoles = []) => {
	return (props) => {
		const { user, isAuthenticated } = useAuth()
		const router = useRouter()
		const [loading, setLoading] = useState(true)

		useEffect(() => {
			if (!isAuthenticated()) {
				router.push('/auth/login')
			} else if (
				allowedRoles.length &&
				!allowedRoles.includes(user?.role)
			) {
				router.push('/auth/unauthorized')
			} else {
				setLoading(false)
			}
		}, [user, isAuthenticated, router])

		if (loading) {
			return <div>Loading...</div>
		}

		return <WrappedComponent {...props} />
	}
}

export default withAuth
