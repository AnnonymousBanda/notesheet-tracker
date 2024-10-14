'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/contexts/AuthContext'
import DialogBox from '@/components/DialogBox'
import Link from 'next/link'

export default function LoginForm() {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm()

	const { login } = useAuth()

	const [errorDialog, setErrorDialog] = useState({
		isOpen: false,
		message: '',
	})

	const handleLogin = async (data) => {
		console.log(data)

		const res = await (
			await fetch('http://localhost:8000/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: data.email,
					password: data.password,
				}),
			})
		).json()

		if (res.status === 200) {
			reset()
			login(res.jwt)
		} else {
			showErrorDialog(res.message)
		}
	}

	const handleOutlookLogin = async () => {
		const res = await (
			await fetch('http://localhost:8000/oauth/outlook')
		).json()

		if (res.status === 200) {
			console.log(res)
		} else {
			showErrorDialog('Something went wrong')
		}
	}

	const showErrorDialog = (message) => {
		setErrorDialog({
			isOpen: true,
			message,
		})
	}

	const closeErrorDialog = () => {
		setErrorDialog({
			isOpen: false,
			message: '',
		})
	}

	const onSubmit = (data) => {
		handleLogin(data)
	}

	const onError = (errorList) => {
		if (errorList.email) {
			showErrorDialog(errorList.email.message)
		} else if (errorList.password) {
			showErrorDialog(errorList.password.message)
		}
	}

	return (
		<div>
			<form
				onSubmit={handleSubmit(onSubmit, onError)}
				className='w-full flex flex-col gap-4'
				noValidate
			>
				<div className='flex flex-col gap-3'>
					<label className='block text-[1.5rem] font-medium text-gray-700'>
						Email Address
					</label>
					<input
						{...register('email', {
							required:
								'Please provide a valid outlook email address!',
							pattern: {
								value: /^[a-zA-Z0-9._%+-]+@(outlook\.com|hotmail\.com|live\.com|msn\.com|iitp\.ac\.in)$/,
								message:
									'Please provide a valid outlook email address!',
							},
						})}
						className='text-[2rem] border-black border-solid w-full p-2'
						type='email'
						placeholder='Email'
					/>
				</div>
				<div className='flex flex-col gap-3'>
					<label className='block text-[1.5rem] font-medium text-gray-700'>
						Password
					</label>
					<input
						{...register('password', {
							required: 'Password is required',
						})}
						className='text-[2rem] border-black border-solid w-full p-2'
						type='password'
						placeholder='Password'
					/>
				</div>
				<div className='text-right'>
					<Link
						href='/auth/forgot-password'
						className='text-[1.2rem] text-slate-500 '
					>
						Forgot Password?
					</Link>
				</div>

				<div className='w-full flex justify-center'>
					<button
						type='submit'
						className='w-[15rem] flex items-center justify-center bg-[#2f2f2f] text-white h-[45px] px-4 rounded-sm hover:bg-[#0e0202] text-[1.7rem]'
					>
						<p>Login</p>
					</button>
				</div>
			</form>
			<div className='flex w-full items-center gap-2'>
				<hr className='border-black w-full border-solid' />
				<p>OR</p>
				<hr className='border-black w-full border-solid' />
			</div>

			<div className='w-full flex justify-center items-center mt-8'>
				<button
					className='flex gap-3 items-center justify-center  bg-[#2f2f2f] text-white h-[45px] px-4 rounded-sm hover:bg-[#0e0202]'
					onClick={handleOutlookLogin}
				>
					<img src='/images/ms_logo.svg' alt='' />
					<p>Sign In with Microsoft</p>
				</button>
			</div>

			<DialogBox
				isOpen={errorDialog.isOpen}
				message={errorDialog.message}
				onClose={closeErrorDialog}
			/>
		</div>
	)
}
