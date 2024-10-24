'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useDialog } from '@/contexts/DialogBoxContext'
import { useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'

const NewNotesheetForm = () => {
	const { register, handleSubmit, setValue, reset } = useForm()
	const { user } = useAuth()
	const date = new Date().toISOString().split('T')[0]
	const { openDialog, onClose } = useDialog()
	const [pdfFile, setPdfFile] = useState(null)
	const [pdfFileUrl, setPdfFileUrl] = useState(null)
	const submitBtnRef = useRef(null)
	const router = useRouter()

	const onSubmit = async (data) => {
		submitBtnRef.current.style.opacity = '0.5'

		const formData = new FormData()
		formData.append('pdfFile', data.pdfFile)
		formData.append('subject', data.subject)
		formData.append('raiser', data.raiser)
		formData.append('amount', data.amount)
		formData.append('requiredApprovals', data.requiredApprovals)

		try {
			const response = await axios.post(
				'http://localhost:8000/api/notesheet/create',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						authorization: `Bearer ${localStorage.getItem('jwt')}`,
					},
				}
			)

			openDialog('Notesheet submitted successfully')
			setTimeout(() => {
				onClose()
				router.push('/') //redirect to the notesheet deatil page /notesheet/:id
			}, 2500)
		} catch (error) {
			openDialog(error.response.data.message)
		} finally {
			// reset()
			// setPdfFile(null)
			// setPdfFileUrl(null)
			submitBtnRef.current.style.opacity = '1'
		}
	}

	const onError = (errorList) => {
		if (errorList.pdfFile) {
			openDialog('Please upload a pdf file')
		} else if (errorList.subject) {
			openDialog(errorList.subject.message)
		} else if (errorList.date) {
			openDialog(errorList.date.message)
		} else if (errorList.raiser) {
			openDialog(errorList.raiser.message)
		} else if (errorList.amount) {
			openDialog(errorList.amount.message)
		} else if (errorList.requiredApprovals) {
			openDialog(errorList.requiredApprovals.message)
		}
	}

	const handleDrop = (e) => {
		e.preventDefault()
		const file = e.dataTransfer.files[0]
		if (file.type !== 'application/pdf') {
			openDialog('Please upload a pdf file')
		} else {
			setPdfFile(file)
			setValue('pdfFile', file)
			setPdfFileUrl(URL.createObjectURL(file))
		}
	}
	const handleFileUpload = (e) => {
		const file = e.target.files[0]
		if (file.type !== 'application/pdf') {
			openDialog('Please upload a pdf file')
		} else {
			setPdfFile(file)
			setValue('pdfFile', file)
			setPdfFileUrl(URL.createObjectURL(file))
		}
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit, onError)}
			className='flex items-center justify-center gap-[5rem] w-full p-4 h-full'
			noValidate
		>
			<div
				onDrop={handleDrop}
				onDragOver={(e) => e.preventDefault()}
				className='flex flex-col items-center justify-center text-center h-1/2 w-1/3 hover:bg-gray-100 border-gray-400 hover:border-black border-dashed border-[2px] px-[2.5rem] rounded-lg gap-8 transition-all duration-500 flex-wrap'
			>
				<div className='w-full'>
					{pdfFile ? (
						<div className='overflow-hidden'>
							<a
								href={pdfFileUrl}
								className='text-[2.5rem] text-blue-600 truncate'
								target='_blank'
							>
								{pdfFile.name}
							</a>
							<div className='flex justify-center'>
								<button
									onClick={() => {
										setPdfFile(null)
										setPdfFileUrl(null)
									}}
									className='w-[12rem] flex items-center justify-center bg-[#2f2f2f] text-white h-[40px] px-4 rounded-sm hover:bg-[#0e0202] text-[1.5rem]'
								>
									<h4>Reset PDF</h4>
								</button>
							</div>
						</div>
					) : (
						<h4 className='lg:text-[2rem] text-[1.5rem]'>
							Please drag and drop or upload a pdf
						</h4>
					)}
				</div>
				{pdfFile ? null : (
					<input
						type='file'
						accept='application/pdf'
						onChange={handleFileUpload}
						className='xl:text-[2rem] lg:text-[1.5rem] text-[1.2rem]'
						required
					/>
				)}
			</div>
			<div className='flex flex-col justify-start h-full w-1/2 gap-10 overflow-auto'>
				<h3 className='text-gray-700 font-semibold'>
					Notesheet Details
				</h3>
				<div className='w-full flex flex-col gap-4'>
					<div className='flex flex-col gap-3 w-[90%]'>
						<label className='text-[2rem] font-medium text-gray-700'>
							Subject
						</label>
						<input
							{...register('subject', {
								required:
									'Please provide a subject for your notesheet',
							})}
							className='text-[2rem] border-gray-400 focus:border-blue-400 border-solid w-full p-2'
							type='text'
							placeholder='Subject'
						/>
					</div>

					<div className='flex flex-col gap-3 w-fit'>
						<label className='block text-[2rem] font-medium text-gray-700'>
							Date
						</label>
						<input
							className='text-[2rem] border-gray-400 focus:border-blue-400 border-solid p-2 cursor-not-allowed'
							type='date'
							value={date}
							placeholder='dd/mm/yyyy'
							readOnly
						/>
					</div>

					<div className='flex flex-col gap-3 w-fit'>
						<label className='text-[2rem] font-medium text-gray-700'>
							Raised By
						</label>
						<input
							{...register('raiser', {
								required:
									'Please provide the name of the authority raising the notesheet',
							})}
							className='text-[2rem] border-gray-400 focus:border-blue-400 border-solid w-full p-2'
							defaultValue={user?.name}
							type='text'
							placeholder='Authority raising the notesheet'
						/>
					</div>

					<div className='flex flex-col gap-3 w-1/2'>
						<label className='text-[2rem] font-medium text-gray-700'>
							Amount
						</label>
						<input
							{...register('amount', {
								required: 'Please provide the amount required',
							})}
							className='text-[2rem] border-gray-400 focus:border-blue-400 border-solid w-full p-2'
							type='number'
							placeholder='Enter Amount'
							autoComplete='off'
						/>
					</div>

					<div className='flex flex-col gap-4 w-2/3'>
						<label className='text-[2rem] font-medium text-gray-700'>
							Approvals needed
						</label>
						<div className='flex flex-wrap gap-10'>
							{[
								'Gensec-Tech',
								'VPG',
								'PIC',
								'ARSA',
								'DRSA',
								'ADean',
							]
								.slice(
									[
										'gensec-tech',
										'vpg',
										'pic',
										'arsa',
										'drsa',
										'adean',
									].indexOf(user?.admin) + 1
								)
								.map((approval) => (
									<label
										key={approval}
										className='flex items-center cursor-pointer'
									>
										<input
											type='checkbox'
											{...register('requiredApprovals', {
												required:
													'Please select at least one approval',
											})}
											value={approval.toLowerCase()}
											checked={
												approval === 'ADean'
													? true
													: null
											}
											className='mr-2 w-7 h-7 border-black border-solid bg-transparent text-[2rem] cursor-pointer'
										/>
										<p className='text-[2rem]'>
											{approval}
										</p>
									</label>
								))}
						</div>
					</div>
				</div>
				<button
					type='submit'
					className='mb-3 w-[15rem] flex items-center justify-center bg-[#2f2f2f] text-white min-h-[45px] px-4 rounded-sm hover:bg-[#0e0202] text-[1.7rem]'
					ref={submitBtnRef}
				>
					<h4>Submit</h4>
				</button>
			</div>
		</form>
	)
}

const NewNotesheets = () => {
	return (
		<div className='flex h-full'>
			<NewNotesheetForm />
		</div>
	)
}

export default NewNotesheets
