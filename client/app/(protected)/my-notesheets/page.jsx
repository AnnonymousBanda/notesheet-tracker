'use client'

import { useAuth } from '@/contexts/AuthContext'

const MyNotesheets = () => {
	const { isAdmin } = useAuth()

	const UserNotesheets = () => {
		return <div>User Notesheets</div>
	}

	const AdminNotesheets = () => {
		return <div>Admin Notesheets - Admin Only</div>
	}

	return isAdmin() ? <AdminNotesheets /> : <UserNotesheets />
}

export default MyNotesheets
