'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useDialog } from '@/contexts/DialogBoxContext'

export default function ApproveNotesheet() {
	const [notesheet, setNotesheet] = useState({})
	const notesheetID = useParams().id
	const [loading, setLoading] = useState(false)
	const { openDialog } = useDialog()
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

			if (data.notesheet?.length === 0) return router.push('/not-found')
			else setLoading(false)

			setNotesheet(data.notesheet)
		} catch (error) {
			openDialog(error.message)
		}
	}
	useEffect(() => {
		getNotesheet()
	}, [])

	return loading ? (
		<Loader />
	) : (
		<div className='w-screen-md mx-auto'>
			<iframe
				src={`${notesheet?.pdf}#zoom=75`}
				width='100%'
				height={794}
				className='rounded-xl'
			></iframe>
		</div>
	)
}
