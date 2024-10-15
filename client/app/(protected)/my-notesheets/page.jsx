'use client'

import { useAuth } from '@/contexts/AuthContext'

const MyNotesheets = () => {
	const { isAdmin, isAuthenticated } = useAuth()

	const UserNotesheets = () => {
		return <div>User Notesheets</div>
	}

	const AdminNotesheets = () => {
		return <div>Admin Notesheets - Admin Only</div>
	}

	if (!isAuthenticated())
		return !isAdmin() ? <AdminNotesheets /> : <UserNotesheets />

	return isAdmin() ? <AdminNotesheets /> : <UserNotesheets />
}

export default MyNotesheets
