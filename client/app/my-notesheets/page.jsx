'use client'

import { useAuth } from '@/contexts/AuthContext'
import withAuth from '@/hoc/withAuth'

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

export default withAuth(MyNotesheets, ['user', 'admin'])
