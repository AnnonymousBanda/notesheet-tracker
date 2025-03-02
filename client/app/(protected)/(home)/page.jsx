'use client'

import AdminDashboard from '@/components/AdminDashboard'
import UserDashboard from '@/components/UserDashboard'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
const Dashboard = () => {
	const { isAdmin, user } = useAuth()

	return (
		<>
			{isAdmin() || user?.role.includes('superadmin') ? <AdminDashboard /> : <UserDashboard />}
			{user?.role.includes('user') && (
				<Link
					href='/new-notesheet'
					className='absolute z-10 bottom-8 right-8 flex justify-center items-center bg-black p-4 hover:bg-[#3a3a3a] rounded-xl'
				>
					<img src='/images/plus.svg' alt='' className='w-12 ' />
				</Link>
			)}
		</>
	)
}

export default Dashboard
