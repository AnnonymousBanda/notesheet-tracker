'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

const UploadNotesheets = () => {
	const { isAdmin } = useAuth()
	const [admin] = useState(isAdmin())

	const UploadUserNotesheets = () => {
		return <div>Upload User Notesheets</div>
	}

	const UploadAdminNotesheets = () => {
		return <div>Upload Admin Notesheets - Admin Only</div>
	}
	return admin ? <UploadAdminNotesheets /> : <UploadUserNotesheets />
}

export default UploadNotesheets
