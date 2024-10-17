'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

const NewNotesheets = () => {
	const { isAdmin } = useAuth()
	const [admin] = useState(isAdmin())

	const NewUserNotesheets = () => {
		return <div>New User Notesheets</div>
	}

	const NewAdminNotesheets = () => {
		return <div>New Admin Notesheets - Admin Only</div>
	}

	return admin ? <NewAdminNotesheets /> : <NewUserNotesheets />
}

export default NewNotesheets
