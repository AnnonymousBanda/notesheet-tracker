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
		if (params.toString()) getNotesheets()
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
				<div className='bg-white rounded-xl w-full h-[90%] overflow-auto flex flex-col gap-12'>
					<div className='flex justify-around rounded-t-xl w-full min-w-[900px] text-gray-700 bg-gray-300 font-semibold'>
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
						<div className='w-1/12 py-3 rounded-xl'>
							<p
								className='w-fit cursor-pointer'
								onClick={handleSort}
							>
								Amount
							</p>
						</div>
						{params.get('status') === 'rejected' && (
							<p className='w-2/12 p-3 rounded-xl'>
								Action Required
							</p>
						)}
						<div className='w-[8rem] max-w-[16.66666%] p-3 rounded-xl flex justify-center'>
							<p
								className='w-fit cursor-pointer'
								onClick={handleSort}
							>
								Status
							</p>
						</div>
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
