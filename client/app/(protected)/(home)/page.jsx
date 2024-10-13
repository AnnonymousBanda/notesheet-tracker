'use client'

import { useAuth } from '@/contexts/AuthContext'

const Dashboard = () => {
	const { isAdmin } = useAuth()

	const UserDashboard = () => {
		return <div>User Dashboard</div>
	}

	const AdminDashboard = () => {
		return <div>Admin Dashboard - Admin Only</div>
	}

	return isAdmin() ? <AdminDashboard /> : <UserDashboard />
}

export default Dashboard
