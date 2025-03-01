'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDialog } from '@/contexts/DialogBoxContext'

export default function ForgotPasswordForm() {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm()
	const { openDialog } = useDialog()
	const onError = (errorList) => {
			openDialog(errorList.email.message)
		}
	const onSubmit = async (data) => {
		try {
			const response = await fetch(
				'http://localhost:8000/auth/get-password-reset-token',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(data),
				}
			)
			const result = await response.json()

			openDialog(result.message)
		} catch (error) {
			openDialog('Something went wrong. Please try again later.')
			console.error(error.message)
		} finally {
			reset()
		}
	}

	

	return (
		<>
			<form
				onSubmit={handleSubmit(onSubmit, onError)}
				className='w-full flex flex-col gap-10'
			>
				<div className='flex flex-col gap-3'>
					<label className='block text-[1.5rem] font-medium text-gray-700'>
						Email Address
					</label>
					<input
						{...register('email', {
							required: 'Email Address is required',
							pattern: {
								value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message: 'Invalid email address',
							},
						})}
						className='text-[2rem] border-black border-solid w-full p-2'
						type='text'
						placeholder='Email Address'
					/>
				</div>
				<div className='w-full flex justify-center'>
					<button
						type='submit'
						className='w-[15rem] flex items-center justify-center bg-[#2f2f2f] text-white h-[45px] px-4 rounded-sm hover:bg-[#0e0202] text-[1.7rem]'
					>
						<p>Get reset link</p>
					</button>
				</div>
			</form>
		</>
	)
}
