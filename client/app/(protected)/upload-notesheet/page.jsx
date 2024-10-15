'use client'

import { useAuth } from '@/contexts/AuthContext'

const UploadNotesheets = () => {
	const { isAdmin, isAuthenticated } = useAuth()

	const UploadUserNotesheets = () => {
		return <div>Upload User Notesheets</div>
	}

	const UploadAdminNotesheets = () => {
		return <div>Upload Admin Notesheets - Admin Only</div>
	}

	if (!isAuthenticated())
		return !isAdmin() ? <UploadAdminNotesheets /> : <UploadUserNotesheets />

	return isAdmin() ? <UploadAdminNotesheets /> : <UploadUserNotesheets />
}

export default UploadNotesheets
