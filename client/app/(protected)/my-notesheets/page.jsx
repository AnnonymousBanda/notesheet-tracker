'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

const MyNotesheets = () => {
	const { isAdmin } = useAuth()
	const [admin] = useState(isAdmin())

	const UserNotesheets = () => {
		return <div>User Notesheets</div>
	}

	const AdminNotesheets = () => {
		return <div>Admin Notesheets - Admin Only</div>
	}

	return admin ? <AdminNotesheets /> : <UserNotesheets />
}

export default MyNotesheets
