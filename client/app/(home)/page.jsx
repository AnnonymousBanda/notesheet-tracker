'use client'

import { useAuth } from '@/contexts/AuthContext'
import withAuth from '@/hoc/withAuth'

function Home() {
	const { user, isAuthenticated, isAdmin } = useAuth()

	console.log(user, isAuthenticated(), isAdmin())

	return <div>Hello</div>
}

export default withAuth(Home, ['user', 'admin'])
