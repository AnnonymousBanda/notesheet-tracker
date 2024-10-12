'use client'

import { useAuth } from '@/contexts/AuthContext'
import withAuth from '@/hoc/withAuth'
import LazyBlurImage from '@/components/LazyBlurImage'

function Home() {
	const { user, isAuthenticated, isAdmin } = useAuth()

	console.log(user, isAuthenticated(), isAdmin())

	return <div>Home</div>
}

export default withAuth(Home, ['user', 'admin'])
