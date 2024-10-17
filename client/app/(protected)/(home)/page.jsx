'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

const Dashboard = () => {
	const { isAdmin } = useAuth()
	const [admin] = useState(isAdmin())

	const UserDashboard = () => {
		console.log('User Dashboard')
		return <div>User Dashboard</div>
	}

	const AdminDashboard = () => {
		console.log('Admin Dashboard')
		return <div>Admin Dashboard - Admin Only</div>
	}

	return admin ? <AdminDashboard /> : <UserDashboard />
}

export default Dashboard
