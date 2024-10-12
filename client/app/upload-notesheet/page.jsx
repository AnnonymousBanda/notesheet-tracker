'use client'

import { useAuth } from '@/contexts/AuthContext'
import withAuth from '@/hoc/withAuth'

const UploadNotesheets = () => {
	const { isAdmin } = useAuth()

	const UploadUserNotesheets = () => {
		return <div>Upload User Notesheets</div>
	}

	const UploadAdminNotesheets = () => {
		return <div>Upload Admin Notesheets - Admin Only</div>
	}

	return isAdmin() ? <UploadAdminNotesheets /> : <UploadUserNotesheets />
}

export default withAuth(UploadNotesheets, ['user', 'admin'])
