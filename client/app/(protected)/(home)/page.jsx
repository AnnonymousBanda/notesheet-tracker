'use client'

import AdminDashboard from '@/components/AdminDashboard'
import UserDashboard from '@/components/UserDashboard'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const Dashboard = () => {
	const { isAdmin, user } = useAuth()
	const [admin] = useState(isAdmin())

	const pathname = usePathname()
	const searchparams = useSearchParams()
	const { replace } = useRouter()

	useEffect(() => {
		if (!user) return

		const params = new URLSearchParams(searchparams)
		let type
		if (user.admin === 'adean') {
			const types = ['approved', 'to-approve']
			if (types.includes(params.get('type'))) {
				type = params.get('type')
			} else {
				type = 'to-approve'
			}
		} else if (user.admin === 'admin') {
			const types = ['approved', 'to-approve', 'raised']
			if (types.includes(params.get('type'))) {
				type = params.get('type')
			} else {
				type = 'raised'
			}
		} else {
			type = 'raised'
		}

		const status = params.get('status')
		const sortBy = params.get('sortBy') || 'raisedAt'
		const order = params.get('order') || 'asc'
		const page = params.get('page') || 1

		const updatedParams = new URLSearchParams()
		updatedParams.set('type', type)
		if (status) updatedParams.set('status', status)
		updatedParams.set('sortBy', sortBy)
		updatedParams.set('order', order)
		updatedParams.set('page', page)

		replace(`${pathname}?${updatedParams.toString()}`)
	}, [user])

	return (
		<>
			{admin ? <AdminDashboard /> : <UserDashboard />}
			{user?.admin === 'adean' ? null : (
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
