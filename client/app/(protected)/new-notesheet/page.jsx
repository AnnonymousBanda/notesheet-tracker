'use client'

import { useAuth } from '@/contexts/AuthContext'

const NewNotesheets = () => {
	const { isAdmin, isAuthenticated } = useAuth()

	const NewUserNotesheets = () => {
		return <div>New User Notesheets</div>
	}

	const NewAdminNotesheets = () => {
		return <div>New Admin Notesheets - Admin Only</div>
	}

	if (!isAuthenticated())
		return !isAdmin() ? <NewAdminNotesheets /> : <NewUserNotesheets />

	return isAdmin() ? <NewAdminNotesheets /> : <NewUserNotesheets />
}

export default NewNotesheets
