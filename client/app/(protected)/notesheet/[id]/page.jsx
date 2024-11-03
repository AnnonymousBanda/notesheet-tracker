'use client'
import { DynamicLazyBlurImage, LazyBlurImage } from '@/components/LazyBlurImage'
import { useAuth } from '@/contexts/AuthContext'
import { useDialog } from '@/contexts/DialogBoxContext'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import NotesheetDetailsSkeleton from '@/components/NotesheetDetailsSkeleton'
import Image from 'next/image'
import PdfSkeleton from '@/components/PdfSkeleton'
import { formatAmount, formatDate } from '@/utils/utils.js'

export default function NoteSheet() {
	const [notesheet, setNotesheet] = useState({})
	const [loading, setLoading] = useState(true)
	const [rejectModal, setRejectModal] = useState(false)

	const rejectButtonRef = useRef(null)
	const notesheetID = useParams().id
	const router = useRouter()
	const { openDialog } = useDialog()
	const { user } = useAuth()

	const getNotesheet = async () => {
		try {
			const response = await fetch(
				`http://localhost:8000/api/notesheet/${notesheetID}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						authorization: `Bearer ${localStorage.getItem('jwt')}`,
					},
				}
			)
			const data = await response.json()

			if (!data.notesheet || data.notesheet?.length === 0)
				return router.push('/not-found')
			else setLoading(false)

			setNotesheet(data.notesheet)
		} catch (error) {
			openDialog(error.response.data.message)
		}
	}
	useEffect(() => {
		getNotesheet()
	}, [])

	const handleApproval = async (notesheetID) => {
		if (user.admin === 'adean') {
			try {
				const response = await axios.patch(
					'http://localhost:8000/api/notesheet/approve',
					{ notesheetID },
					{
						headers: {
							'Content-Type': 'application/json',
							authorization: `Bearer ${localStorage.getItem('jwt')}`,
						},
					}
				)

				openDialog(response.data.message)
				setTimeout(() => window.location.reload(), 250)
			} catch (error) {
				openDialog(error.response?.data.message || error.message)
			}
		} else {
			router.push(`/approve-notesheet/${notesheetID}`)
		}
	}

	const handleReject = async (notesheetID) => {
		try {
			rejectButtonRef.current.style.opacity = '0.5'
			const response = await axios.delete(
				`http://localhost:8000/api/notesheet/reject`,
				{
					headers: {
						'Content-Type': 'application/json',
						authorization: `Bearer ${localStorage.getItem('jwt')}`,
					},
					data: {
						notesheetID,
						comment: document.querySelector('textarea').value,
					},
				}
			)

			rejectButtonRef.current.style.opacity = '1'
			setRejectModal(false)
			window.location.reload()
			openDialog(response.data.message)
		} catch (error) {
			rejectButtonRef.current.style.opacity = '1'
			setRejectModal(false)
			openDialog(error.response?.data.message || error.message)
		}
	}

	const NotesheetDetail = () => {
		return (
			<div className='lg:w-screen-md w-full mx-auto pt-3 flex flex-col gap-4'>
				<p className='text-gray-500 font-bold text-[3rem] mb-12'>
					Notesheet Details
				</p>
				{loading ? (
					<NotesheetDetailsSkeleton />
				) : (
					<div className='flex flex-col gap-4 bg-gray-100 p-6 rounded-xl'>
						<div className='flex gap-[1rem] items-center max-w-full flex-wrap'>
							<p className='text-gray-500 font-bold text-[2rem] min-w-fit'>
								Subject :
							</p>
							<p className='text-gray-700 font-bold'>
								{notesheet?.subject}
							</p>
						</div>
						<div className='flex gap-[1rem] items-center'>
							<p className='text-gray-500 font-bold text-[2rem]'>
								Raised At :
							</p>
							<p className='text-gray-700 font-bold'>
								{formatDate(notesheet?.raisedAt)}
							</p>
						</div>
						<p className='text-gray-500 font-bold text-[2rem]'>
							Raised By :{' '}
							<span className='text-gray-700'>
								{notesheet?.raiser}
							</span>
						</p>
						<p className='text-gray-500 font-bold text-[2rem]'>
							Amount raised :{' '}
							<span className='text-gray-700'>
								{formatAmount(notesheet?.amount)}
							</span>
						</p>

						{!(notesheet?.status?.state === 'rejected') && (
							<>
								<div className='flex gap-[1rem]'>
									<p className='text-gray-500 font-bold text-[2rem]'>
										Current Required Approval :{' '}
									</p>
									{notesheet?.status
										?.currentRequiredApproval == null ? (
										<Image
											src='/images/icons/null.svg'
											alt='null icon'
											width={30}
											height={30}
										/>
									) : (
										<div className='text-gray-700 font-bold text-[2rem] flex gap-3'>
											<div className='flex items-center gap-2 bg-gray-200 px-4 rounded-lg'>
												{notesheet.status
													.currentRequiredApproval
													.picture ? (
													<DynamicLazyBlurImage
														src={
															notesheet.status
																.currentRequiredApproval
																.picture
														}
														alt={
															notesheet.status
																.currentRequiredApproval
																.name
														}
														width={20}
														height={20}
														rounded={true}
													/>
												) : (
													<LazyBlurImage
														src='user.png'
														alt={
															notesheet.status
																.currentRequiredApproval
																.name
														}
														width={20}
														height={20}
														rounded={true}
													/>
												)}
												<p>
													{notesheet?.status?.currentRequiredApproval.name.toUpperCase()}
												</p>
											</div>
										</div>
									)}
								</div>

								<div className='flex gap-[1rem]'>
									<p className='text-gray-500 font-bold text-[2rem]'>
										Pending Approvals :{' '}
									</p>
									{notesheet?.status?.pendingApprovals
										.length === 0 ? (
										<Image
											src='/images/icons/null.svg'
											alt='null icon'
											width={30}
											height={30}
										/>
									) : (
										<div className='text-gray-700 font-bold text-[2rem] flex gap-3'>
											{notesheet?.status?.pendingApprovals.map(
												(admin, index) => (
													<div
														className='flex items-center gap-2 bg-gray-200 px-4 rounded-lg'
														key={
															notesheet._id +
															index
														}
													>
														{admin.picture ? (
															<DynamicLazyBlurImage
																src={
																	admin.picture
																}
																alt={admin.name}
																width={20}
																height={20}
																rounded={true}
															/>
														) : (
															<LazyBlurImage
																src='user.png'
																alt={admin.name}
																width={20}
																height={20}
																rounded={true}
															/>
														)}
														<p>
															{admin.name.toUpperCase()}
														</p>
													</div>
												)
											)}
										</div>
									)}
								</div>

								<div className='flex gap-[1rem]'>
									<p className='text-gray-500 font-bold text-[2rem]'>
										Past Approvals :{' '}
									</p>
									{notesheet?.status.passedApprovals
										?.length === 0 ? (
										<Image
											src='/images/icons/null.svg'
											alt='null icon'
											width={30}
											height={30}
										/>
									) : (
										<div className='text-gray-700 font-bold text-[2rem] flex gap-3'>
											{notesheet?.status.passedApprovals.map(
												(admin, index) => (
													<div
														className='flex items-center gap-2 bg-gray-200 px-4 rounded-lg'
														key={
															notesheet._id +
															index
														}
													>
														{admin?.picture ? (
															<DynamicLazyBlurImage
																src={
																	admin.picture
																}
																alt={admin.name}
																width={20}
																height={20}
																rounded={true}
															/>
														) : (
															<LazyBlurImage
																src='user.png'
																alt={admin.name}
																width={20}
																height={20}
																rounded={true}
															/>
														)}
														<p>{admin.name}</p>
													</div>
												)
											)}
										</div>
									)}
								</div>
							</>
						)}

						<div className='flex gap-[1rem] items-center'>
							<p className='text-gray-500 font-bold text-[2rem]'>
								Status :
							</p>
							<LazyBlurImage
								src={`icons/${notesheet?.status?.state}.png`}
								alt={`${notesheet?.status?.state} icon`}
								width={40}
								height={40}
								rounded={false}
								bgColor={false}
							/>
							<p
								className={
									(notesheet?.status?.state === 'pending'
										? 'text-yellow-400'
										: notesheet?.status?.state ===
											  'approved'
											? 'text-green-400'
											: 'text-red-500') + ' font-semibold'
								}
							>
								{notesheet?.status?.state.toUpperCase()}
							</p>
						</div>

						{notesheet?.status?.state === 'rejected' && (
							<>
								<div className='flex gap-[1rem] items-center max-w-full flex-wrap'>
									<p className='text-gray-500 font-bold text-[2rem] min-w-fit'>
										Action Required :
									</p>
									<p className='text-gray-700 font-bold'>
										{notesheet?.status?.rejectedBy?.comment}
									</p>
								</div>
								<div className='flex gap-[1rem] items-center'>
									<p className='text-gray-500 font-bold text-[2rem]'>
										Rejected At :
									</p>
									<p className='text-gray-700 font-bold'>
										{formatDate(notesheet?.rejectedAt)}
									</p>
								</div>
							</>
						)}

						<div className='flex gap-[1rem] items-center'>
							<p className='text-gray-500 font-bold text-[2rem]'>
								{notesheet?.status?.comment ===
								'Notesheet expired! Please raise a new notesheet.'
									? 'Expired At :'
									: 'Expires At :'}
							</p>
							<p className='text-gray-700 font-bold'>
								{formatDate(notesheet?.expiresAt)}
							</p>
						</div>
					</div>
				)}

				{loading ? (
					<div className='w-full h-[70rem]'>
						<PdfSkeleton />
					</div>
				) : (
					<div
						className={`p-3 ${
							Date.now() > (notesheet?.expiresAt ?? Infinity)
								? 'hidden'
								: 'block'
						}`}
					>
						<iframe
							src={notesheet?.pdf}
							width='100%'
							height={500}
							className='rounded-xl'
						></iframe>
					</div>
				)}
				{user?.admin ===
				notesheet?.status?.currentRequiredApproval?.admin ? (
					<div className='flex gap-[1rem] absolute bottom-[20px] right-[20px]'>
						<button
							onClick={() => handleApproval(notesheetID)}
							className='cursor-pointer'
						>
							<LazyBlurImage
								src='icons/approve.png'
								alt='Approve'
								width={50}
								height={50}
								rounded={false}
								bgColor={false}
							/>
						</button>
						<button
							className='cursor-pointer'
							onClick={() => setRejectModal(true)}
						>
							<LazyBlurImage
								src='icons/reject.png'
								alt='Reject'
								width={50}
								height={50}
								rounded={false}
								bgColor={false}
							/>
						</button>
					</div>
				) : null}
				{rejectModal && (
					<div
						className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'
						onClick={() => setRejectModal(false)}
					>
						<div
							className='relative bg-white w-[90%] md:w-[40%] max-w-md p-8 rounded-lg shadow-lg transform transition-all duration-300'
							onClick={(e) => e.stopPropagation()}
						>
							<p className='font-bold mb-4 text-gray-700'>
								Reason for Rejection
							</p>
							<textarea
								className='w-full h-32 p-4 text-[1.6rem] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4'
								placeholder='Enter the reason for rejection'
							></textarea>
							<div className='flex justify-end space-x-3'>
								<button
									onClick={() => setRejectModal(false)}
									className='px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200 text-[1.4rem]'
								>
									Close
								</button>
								<button
									className='px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all duration-200 text-[1.4rem]'
									onClick={() => handleReject(notesheetID)}
									ref={rejectButtonRef}
								>
									Reject
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		)
	}

	return <NotesheetDetail />
}
