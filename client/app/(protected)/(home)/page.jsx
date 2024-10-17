'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

const Dashboard = () => {
	const { isAdmin } = useAuth()
	const [admin] = useState(isAdmin())

	const UserDashboard = () => {
		return <div>User Dashboard</div>
	}

	const AdminDashboard = () => {
		return <div>Admin Dashboard - Admin Only</div>
	}

	return admin ? <AdminDashboard /> : <UserDashboard />
}

export default Dashboard
