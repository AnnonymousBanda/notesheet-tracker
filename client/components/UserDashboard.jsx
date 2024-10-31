'use client'
import React, { useEffect, useState } from 'react'
import { useDialog } from '@/contexts/DialogBoxContext'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import NotesheetsTable from './NotesheetsTable'
import TableLoadingSkeleton from './TableLoadingSkeleton'
import Pagination from './Pagination'
import NoNotesheets from './NoNotesheets'
import axios from 'axios'

export default function UserDashboard() {
	const { openDialog } = useDialog()

	const [loading, setLoading] = useState(true)
	const [notesheets, setNotesheets] = useState([])
	const [totalPages, setTotalPages] = useState(0)

	const pathname = usePathname()
	const searchparams = useSearchParams()
	const params = new URLSearchParams(searchparams)
	const { replace } = useRouter()

	const getNotesheets = async () => {
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
		if (params.toString()) getNotesheets()
	}, [params.toString()])

	return (
		<div className='flex flex-col h-full gap-12'>
			<div className='flex gap-10 w-full justify-center'>
				<div
					onClick={() => {
						params.delete('status')
						replace(`${pathname}?${params.toString()}`)
					}}
					className={`p-3 text-gray-700 ${
						params.get('status') === null
							? 'bg-gray-400'
							: 'bg-gray-300'
					}  cursor-pointer hover:bg-gray-400 transition-all duration-500 w-[18rem] text-center rounded-xl`}
				>
					<p className='font-semibold  text-[2rem]'>ALL</p>
				</div>
				<div
					onClick={() => {
						params.set('status', 'pending')
						params.set('page', '1')
						replace(`${pathname}?${params.toString()}`)
					}}
					className={`p-3 text-gray-700 ${
						params.get('status') === 'pending'
							? 'bg-gray-400'
							: 'bg-gray-300'
					}  cursor-pointer hover:bg-gray-400 transition-all duration-500 w-[18rem] text-center rounded-xl`}
				>
					<p className='font-semibold  text-[2rem]'>PENDING</p>
				</div>
				<div
					onClick={() => {
						params.set('status', 'approved')

						params.set('page', '1')
						replace(`${pathname}?${params.toString()}`)
					}}
					className={`p-3 text-gray-700 ${
						params.get('status') === 'approved'
							? 'bg-gray-400'
							: 'bg-gray-300'
					}  cursor-pointer hover:bg-gray-400 transition-all duration-500 w-[18rem] text-center rounded-xl`}
				>
					<p className='font-semibold  text-[2rem]'>APPROVED</p>
				</div>
				<div
					onClick={() => {
						params.set('status', 'rejected')
						params.set('page', '1')
						replace(`${pathname}?${params.toString()}`)
					}}
					className={`p-3 text-gray-700 ${
						params.get('status') === 'rejected'
							? 'bg-gray-400'
							: 'bg-gray-300'
					}  cursor-pointer hover:bg-gray-400 transition-all duration-500 w-[18rem] text-center rounded-xl`}
				>
					<p className='font-semibold  text-[2rem]'>REJECTED</p>
				</div>
			</div>
			{loading ? (
				<TableLoadingSkeleton params={params} />
			) : notesheets?.length ? (
				<div className='bg-white rounded-xl w-full flex flex-col gap-12'>
					<div className='flex justify-around rounded-t-xl text-gray-700 bg-gray-300 font-semibold'>
						<p className='w-1/12 p-3 rounded-xl'>S.no</p>
						<p className='w-5/12 max-w-[41.6667%] p-3 rounded-xl'>
							Subject
						</p>
						<p className='w-2/12 p-3 rounded-xl text-center'>
							Date
						</p>
						<p className='w-1/12 p-3 rounded-xl'>Amount</p>
						{params.get('status') === 'rejected' && (
							<p className='w-2/12 p-3 rounded-xl'>
								Action Required
							</p>
						)}
						<p className='w-[8rem] max-w-[16.66666%] p-3 rounded-xl text-center'>
							Status
						</p>
						<p className='w-[14rem] p-3 rounded-xl'>
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
