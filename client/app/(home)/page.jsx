'use client'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
	const { user, isAuthenticated, isAdmin } = useAuth()
	console.log(user, isAuthenticated(), isAdmin())
	return <div></div>
}
