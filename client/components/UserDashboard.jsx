import NotesheetsTable from './NotesheetsTable'
import TableLoadingSkeleton from './TableLoadingSkeleton'
import Pagination from './Pagination'
import NoNotesheets from './NoNotesheets'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { isValidElement, useEffect, useState } from 'react'
import axios from 'axios'
import { useDialog } from '@/contexts/DialogBoxContext'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'

export default function UserDashboard() {
	const { openDialog } = useDialog()

	const [loading, setLoading] = useState(true)
	const [notesheets, setNotesheets] = useState([])
	const [totalPages, setTotalPages] = useState(0)
	const { user } = useAuth()

	const pathname = usePathname()
	const searchparams = useSearchParams()
	const params = new URLSearchParams(searchparams)
	const { replace } = useRouter()

	const getNotesheets = async (params) => {
		setLoading(true)
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/api/notesheets/user/me?${params.toString()}`,
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
		if (!params.toString()) {
			params.set('type', 'raised')
			params.set('sortBy', 'raisedAt')
			params.set('order', 'desc')
			params.set('page', '1')
			replace(`${pathname}?${params.toString()}`)
			return
		}
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
		getNotesheets(params)
	}, [params.toString()])

	const handleSort = (e) => {
		console.log(e.target.innerText)

		const params = new URLSearchParams(searchparams)
		const mapping = {
			Subject: 'subject',
			Date: 'raisedAt',
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
		<div className='flex flex-col h-full gap-12 overflow-hidden'>
			<div className='flex flex-col items-center h-full'>
				<div className='flex w-fit justify-evenly rounded-t-xl bg-[#9ca3af8e]'>
					<div
						title='Pending'
						onClick={() => {
							params.set('status', 'pending')
							params.set('page', '1')
							replace(`${pathname}?${params.toString()}`)
						}}
						className={`p-3 text-gray-700 ${
							params.get('status') === 'pending'
								? 'bg-gray-300'
								: 'bg-transparent hover:bg-[#e5e7eba8]'
						}  cursor-pointer rounded-t-xl transition-all duration-500 w-[8rem] py-[1rem] xl:w-[10rem] flex justify-center`}
					>
						<Image
							src='/images/icons/pending.png'
							width={35}
							height={35}
							alt='Pending icon'
						/>
					</div>
					<div
						title='Approved'
						onClick={() => {
							params.set('status', 'approved')

							params.set('page', '1')
							replace(`${pathname}?${params.toString()}`)
						}}
						className={`p-3 text-gray-700 ${
							params.get('status') === 'approved'
								? 'bg-gray-300'
								: 'bg-transparent hover:bg-[#e5e7eba8]'
						}  cursor-pointer hover:bg-gray-300 rounded-t-xl transition-all duration-500 w-[8rem] py-[1rem] xl:w-[10rem] flex justify-center`}
					>
						<Image
							src='/images/icons/approved.png'
							width={35}
							height={35}
							alt='Approved icon'
						/>
					</div>
					<div
						title='Rejected'
						onClick={() => {
							params.set('status', 'rejected')
							params.set('page', '1')
							replace(`${pathname}?${params.toString()}`)
						}}
						className={`p-3 text-gray-700 ${
							params.get('status') === 'rejected'
								? 'bg-gray-300'
								: 'bg-transparent hover:bg-[#e5e7eba8]'
						}  cursor-pointer hover:bg-gray-300 rounded-t-xl transition-all duration-500 w-[8rem] py-[1rem] xl:w-[10rem] flex justify-center`}
					>
						<Image
							src='/images/icons/rejected.png'
							width={35}
							height={35}
							alt='Rejected icon'
						/>
					</div>
				</div>
				{loading ? (
					<TableLoadingSkeleton params={params} />
				) : notesheets?.length ? (
					<div className='bg-white rounded-xl w-full h-fit overflow-auto no-scrollbar flex flex-col gap-12'>
						<div className='flex justify-around rounded-t-xl w-full min-w-[900px] text-gray-700 bg-gray-300 font-semibold'>
							<p className='w-[5%] p-3 rounded-xl'>No.</p>
							<div className='w-[35.71%] max-w-[41.6667%] p-3 rounded-xl'>
								<p
									className='w-fit cursor-pointer'
									onClick={handleSort}
								>
									Subject
								</p>
							</div>
							<div className='w-[14.28%] p-3 rounded-xl flex justify-center'>
								<p
									className='w-fit cursor-pointer'
									onClick={handleSort}
								>
									Date
								</p>
							</div>
							<div className='w-[7.14%] py-3 rounded-xl'>
								<p
									className='w-fit cursor-pointer'
									onClick={handleSort}
								>
									Amount
								</p>
							</div>
							{params.get('status') === 'rejected' && (
								<p className='w-[14.28%] p-3 rounded-xl'>
									Action Required
								</p>
							)}
							<div className='w-[7.14%] max-w-[16.66666%] p-3 rounded-xl flex justify-center'>
								<p
									className='w-fit cursor-pointer'
									onClick={handleSort}
								>
									Status
								</p>
							</div>
							<p className='w-[14.28%] p-3 rounded-xl'>
								View/Download
							</p>
						</div>
						<div className='overflow-y-auto overflow-x-clip min-w-[900px] w-full h-full '>
							<NotesheetsTable notesheets={notesheets} />
						</div>
					</div>
				) : (
					<div className='w-full  h-full pt-[2rem]'>
						<NoNotesheets />
					</div>
				)}
			</div>
			<Pagination total={totalPages} />
			<div className='min-h-[4rem] w-full'></div>
		</div>
	)
}
