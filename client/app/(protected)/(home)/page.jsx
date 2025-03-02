'use client'

import AdminDashboard from '@/components/AdminDashboard'
import UserDashboard from '@/components/UserDashboard'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
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
					<Image src='/images/plus.svg' width={48} height={48} alt='' className='w-12' />
				</Link>
			)}
		</>
	)
}

export default Dashboard
