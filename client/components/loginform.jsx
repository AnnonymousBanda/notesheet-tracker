'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/contexts/AuthContext'

export default function Loginform() {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm()

	const { login } = useAuth()

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
			alert(res.message)
		}
	}

	const handleOutlookLogin = async () => {
		const res = await (
			await fetch('http://localhost:8000/oauth/outlook')
		).json()

		if (res.status === 200) {
			console.log(res)
		} else {
			alert('Something went wrong')
		}
	}

	return (
		<div>
			<form
				onSubmit={handleSubmit(handleLogin)}
				className='w-full flex flex-col gap-4'
			>
				<div className='flex flex-col gap-3'>
					<label className='block text-[1.5rem] font-medium text-gray-700'>
						Email Address
					</label>
					<input
						{...register('email', {
							required: 'Email is required',
							pattern: {
								value: /^[a-zA-Z0-9._%+-]+@(outlook\.com|hotmail\.com|live\.com|msn\.com|iitp\.ac\.in)$/,
								message: 'Provide a valid outlook email',
							},
						})}
						className='text-[2rem] border-black border-solid w-full p-2'
						type='email'
						placeholder='Email'
					/>
					{errors.email && (
						<p className='text-red-600'>{errors.email.message}</p>
					)}
				</div>
				<div className='flex flex-col gap-3'>
					<label className='block text-[1.5rem] font-medium text-gray-700'>
						Password
					</label>
					<input
						{...register('password', {
							required: 'Password is required',
							minLength: {
								value: 6,
								message:
									'Password must be at least 6 characters',
							},
						})}
						className='text-[2rem] border-black border-solid w-full p-2'
						type='password'
						placeholder='Password'
					/>
					{errors.password && (
						<p className='text-red-600'>
							{errors.password.message}
						</p>
					)}
				</div>
				<div className='text-right'>
					<a
						href='/auth/forgot-password'
						className='text-[1.2rem] text-slate-500 '
					>
						Forgot Password?
					</a>
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
		</div>
	)
}
