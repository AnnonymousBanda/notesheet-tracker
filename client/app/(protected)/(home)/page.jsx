'use client'

import { useAuth } from '@/contexts/AuthContext'

const Dashboard = () => {
	const { isAdmin, isAuthenticated } = useAuth()

	const UserDashboard = () => {
		return <div>User Dashboard</div>
	}

	const AdminDashboard = () => {
		return <div>Admin Dashboard - Admin Only</div>
	}

	if (!isAuthenticated())
		return !isAdmin() ? <AdminDashboard /> : <UserDashboard />

	return isAdmin() ? <AdminDashboard /> : <UserDashboard />
}

export default Dashboard
