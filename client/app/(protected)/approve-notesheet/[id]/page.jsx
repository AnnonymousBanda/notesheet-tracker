'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useDialog } from '@/contexts/DialogBoxContext'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { html } from '@/utils/utils.js'
import PdfSkeleton from '@/components/PdfSkeleton'
import { LazyBlurImage } from '@/components/LazyBlurImage'

export default function ApproveNotesheet() {
	const [notesheet, setNotesheet] = useState({})
	const notesheetID = useParams().id
	const [loading, setLoading] = useState(false)
	const { openDialog } = useDialog()
	const router = useRouter()
	const { user } = useAuth()

	const getNotesheet = async () => {
		setLoading(true)
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

			if (data.notesheet?.length === 0) {
				router.push('/not-found')
			} else {
				setNotesheet(data.notesheet)
			}
		} catch (error) {
			openDialog(error.message)
		}
	}

	const signAndMergePdf = async () => {
		console.log(notesheet.status.currentRequiredApproval)
		try {
			const approvals = [
				...notesheet.status.passedApprovals,
				notesheet.status.currentRequiredApproval,
			]

			const pendingApprovals = notesheet.status.pendingApprovals

			await axios.post(
				'http://localhost:8000/pdf/create-sign',
				{
					filename: notesheet.pdf.split('/').pop(),
					html: html(approvals, pendingApprovals),
				},
				{
					headers: {
						'Content-Type': 'application/json',
						authorization: `Bearer ${localStorage.getItem('jwt')}`,
					},
				}
			)

			await axios.post(
				'http://localhost:8000/pdf/merge-sign',
				{
					filename: notesheet.pdf.split('/').pop(),
				},
				{
					headers: {
						'Content-Type': 'application/json',
						authorization: `Bearer ${localStorage.getItem('jwt')}`,
					},
				}
			)

			console.log('PDF signing and merging complete.')

			setLoading(false)
		} catch (error) {
			openDialog(error.response?.data.message || error.message)
		}
	}

	const approveNotesheet = async () => {
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
			setTimeout(
				() =>
					router.push(
						`http://localhost:3000/notesheet/${notesheetID}`
					),
				250
			)
		} catch (error) {
			openDialog(error.response?.data.message || error.message)
		}
	}

	useEffect(() => {
		getNotesheet()
	}, [])

	useEffect(() => {
		if (notesheet.pdf) {
			console.log('Starting PDF signing and merging...')
			signAndMergePdf()
		}
	}, [notesheet.pdf])

	return (
		<div className='w-screen-md h-full mx-auto relative'>
			{loading ? (
				<PdfSkeleton />
			) : (
				<iframe
					src={notesheet?.pdf?.replace('.pdf', '-sign-test.pdf')}
					width='100%'
					height='100%'
					className='rounded-xl'
				></iframe>
			)}
			{notesheet?.currentRequiredApproval?.id === user.id && (
				<div
					className='absolute bottom-0 right-[-50px]'
					onClick={approveNotesheet}
				>
					<LazyBlurImage
						src='icons/continue.png'
						alt='Continue'
						width={50}
						height={50}
						className='cursor-pointer bg-blue-400 p-[1rem]'
					/>
				</div>
			)}
		</div>
	)
}
