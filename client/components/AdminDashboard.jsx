import React, { useEffect, useState } from 'react'
import { useDialog } from '@/contexts/DialogBoxContext'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import NotesheetsTable from './NotesheetsTable'
import TableLoadingSkeleton from './TableLoadingSkeleton'
import Pagination from './Pagination'
import NoNotesheets from './NoNotesheets'
import { useAuth } from '@/contexts/AuthContext'
import axios from 'axios'

export default function AdminDashboard() {
	const { openDialog } = useDialog()
	const { user } = useAuth()
	const [notesheets, setNotesheets] = useState([])
	const [totalPages, setTotalPages] = useState(0)
	const [loading, setLoading] = useState(true)

	const pathname = usePathname()
	const searchparams = useSearchParams()
	const params = new URLSearchParams(searchparams)
	const { replace } = useRouter()

	const getNotesheets = async (params) => {
		setLoading(true)
		try {
			const response = await axios.get(
				`http://localhost:8000/api/notesheets/user/me?${params.toString()}`,
				{
					headers: {
						authorization: `Bearer ${localStorage.getItem('jwt')}`,
					},
				}
			)

			setNotesheets(response.data.notesheets)
			setTotalPages(response.data.total / 10)
			setLoading(false)
		} catch (error) {
			if (error.response) {
				openDialog(error.response.data.message)
			} else {
				openDialog(error.message)
			}
		}
	}

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
		} else if (user.role === 'admin') {
			const types = ['approved', 'to-approve', 'raised']
			if (types.includes(params.get('type'))) {
				type = params.get('type')
			} else {
				type = 'raised'
			}
		} else {
			type = 'raised'
		}
		params.set('type', type)

		const status = params.get('status')
		const sortBy = params.get('sortBy') || 'raisedAt'
		const order = params.get('order') || 'desc'
		const page = params.get('page') || 1

		const updatedParams = new URLSearchParams()
		updatedParams.set('type', type)
		if (status) updatedParams.set('status', status)
		updatedParams.set('sortBy', sortBy)
		updatedParams.set('order', order)
		updatedParams.set('page', page)

		replace(`${pathname}?${updatedParams.toString()}`)

		console.log(params.toString())

		getNotesheets(params)
	}, [user, params.toString()])

	const handleSort = (e) => {
		console.log(e.target.innerText)

		const params = new URLSearchParams(searchparams)
		const mapping = {
			Subject: 'subject',
			Date: 'raisedAt',
			// 'Raised By': 'raisedBy.name',
			Amount: 'amount',
			Status: 'status',
		}

		if (params.get('sortBy') === mapping[e.target.innerText]) {
			params.set('order', params.get('order') === 'asc' ? 'desc' : 'asc')
		} else {
			params.set('sortBy', mapping[e.target.innerText])
			params.set('order', 'asc')
		}

		params.set('page', '1')
		replace(`${pathname}?${params.toString()}`)
	}

	return (
		<div className='flex h-full flex-col gap-[3rem] overflow-hidden'>
			<div className='flex gap-10 w-full justify-center flex-wrap'>
				{user?.admin === 'adean' ? null : (
					<>
						<div
							onClick={() => {
								params.set('type', 'raised')
								params.delete('status')
								params.set('page', '1')
								replace(`${pathname}?${params.toString()}`)
							}}
							className={`p-3 text-gray-700 ${
								params.get('status') === null &&
								params.get('type') === 'raised'
									? 'bg-gray-400'
									: 'bg-gray-300'
							}  cursor-pointer hover:bg-gray-400 transition-all duration-500 w-[18rem] text-center rounded-xl`}
						>
							<p className='font-semibold  text-[2rem]'>ALL</p>
						</div>
						<div
							onClick={() => {
								params.set('type', 'raised')
								params.set('status', 'pending')
								params.set('page', '1')
								replace(`${pathname}?${params.toString()}`)
							}}
							className={`p-3 text-gray-700 ${
								params.get('status') === 'pending' &&
								params.get('type') === 'raised'
									? 'bg-gray-400'
									: 'bg-gray-300'
							}  cursor-pointer hover:bg-gray-400 transition-all duration-500 w-[18rem] text-center rounded-xl`}
						>
							<p className='font-semibold  text-[2rem]'>
								PENDING
							</p>
						</div>
						<div
							onClick={() => {
								params.set('type', 'raised')
								params.set('status', 'approved')
								params.set('page', '1')
								replace(`${pathname}?${params.toString()}`)
							}}
							className={`p-3 text-gray-700 ${
								params.get('status') === 'approved' &&
								params.get('type') === 'raised'
									? 'bg-gray-400'
									: 'bg-gray-300'
							}  cursor-pointer hover:bg-gray-400 transition-all duration-500 w-[18rem] text-center rounded-xl`}
						>
							<p className='font-semibold  text-[2rem]'>
								APPROVED
							</p>
						</div>
						<div
							onClick={() => {
								params.set('type', 'raised')
								params.set('status', 'rejected')
								params.set('page', '1')
								replace(`${pathname}?${params.toString()}`)
							}}
							className={`p-3 text-gray-700 ${
								params.get('status') === 'rejected' &&
								params.get('type') === 'raised'
									? 'bg-gray-400'
									: 'bg-gray-300'
							}  cursor-pointer hover:bg-gray-400 transition-all duration-500 w-[18rem] text-center rounded-xl`}
						>
							<p className='font-semibold  text-[2rem]'>
								REJECTED
							</p>
						</div>
					</>
				)}
				<div
					onClick={() => {
						params.delete('status')
						params.set('type', 'to-approve')
						params.set('page', '1')
						replace(`${pathname}?${params.toString()}`)
					}}
					className={`p-3 text-gray-700 ${
						params.get('type') === 'to-approve'
							? 'bg-gray-400'
							: 'bg-gray-300'
					} cursor-pointer hover:bg-gray-400 transition-all duration-500 w-[18rem] text-center rounded-xl`}
				>
					<p className='font-semibold  text-[2rem]'>TO APPROVE</p>
				</div>
				<div
					onClick={() => {
						params.delete('status')
						params.set('type', 'approved')
						params.set('page', '1')
						replace(`${pathname}?${params.toString()}`)
					}}
					className={`p-3 text-gray-700 ${
						params.get('type') === 'approved'
							? 'bg-gray-400'
							: 'bg-gray-300'
					} cursor-pointer hover:bg-gray-400 transition-all duration-500 w-[18rem] text-center rounded-xl`}
				>
					<p className='font-semibold  text-[2rem]'>APPROVED BY ME</p>
				</div>
			</div>
			{loading ? (
				<TableLoadingSkeleton params={params} />
			) : notesheets?.length ? (
				<div className='bg-white rounded-xl w-full h-[90%] overflow-auto flex flex-col gap-12 '>
					<div className='flex justify-around min-w-[900px] rounded-t-xl text-gray-700 bg-gray-300 font-semibold items-center'>
						<p className='w-1/12 p-3 rounded-xl'>No.</p>
						<div className='w-5/12 max-w-[41.6667%] p-3 rounded-xl'>
							<p
								className='w-fit cursor-pointer'
								onClick={handleSort}
							>
								Subject
							</p>
						</div>
						<div className='w-2/12 p-3 rounded-xl flex justify-center'>
							<p
								className='w-fit cursor-pointer'
								onClick={handleSort}
							>
								Date
							</p>
						</div>
						<div className='w-1/12 p-3 rounded-xl'>
							<p
								className='w-fit cursor-pointer'
								onClick={handleSort}
							>
								Amount
							</p>
						</div>
						{params.get('type') === 'to-approve' ||
						params.get('type') === 'approved' ? (
							<div className='w-2/12 p-3 rounded-xl flex justify-center'>
								<p
								// className='w-fit cursor-pointer'
								// onClick={handleSort}
								>
									Raised By
								</p>
							</div>
						) : null}
						{params.get('status') === 'rejected' && (
							<p className='w-2/12 max-w-[16.66666%] p-3 rounded-xl'>
								Action Required
							</p>
						)}
						<div className='w-[8rem] p-3 rounded-xl flex justify-center'>
							<p
								className='w-fit cursor-pointer'
								onClick={handleSort}
							>
								Status
							</p>
						</div>
						<p className='w-[14rem] p-3 rounded-xl text-center'>
							View/Download
						</p>
					</div>

					<div>
						<NotesheetsTable notesheets={notesheets} />
					</div>
				</div>
			) : (
				<NoNotesheets />
			)}
			<Pagination total={totalPages} />
			<div className='min-h-[4rem] w-full'></div>
		</div>
	)
}
