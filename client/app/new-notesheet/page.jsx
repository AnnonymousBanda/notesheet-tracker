'use client'

import { useAuth } from '@/contexts/AuthContext'
import withAuth from '@/hoc/withAuth'

const NewNotesheets = () => {
	const { isAdmin } = useAuth()

	const NewUserNotesheets = () => {
		return <div>New User Notesheets</div>
	}

	const NewAdminNotesheets = () => {
		return <div>New Admin Notesheets - Admin Only</div>
	}

	return isAdmin() ? <NewAdminNotesheets /> : <NewUserNotesheets />
}

export default withAuth(MyNotesheets, ['user', 'admin'])
