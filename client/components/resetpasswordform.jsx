'use client'
import React, { useState } from 'react'
import { set, useForm } from 'react-hook-form'
import DialogBox from './DialogBox'
import { useRouter } from 'next/navigation'

export default function ResetPasswordForm({ token }) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm()

	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setshowConfirmPassword] = useState(false)
	const [errorDialog, setErrorDialog] = useState({
		isOpen: false,
		message: '',
	})
	const Router = useRouter()

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

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword)
	}
	const toggleConfirmPasswordVisibility = () => {
		setshowConfirmPassword(!showConfirmPassword)
	}

	const onSubmit = async (data) => {
		try {
			const response = await fetch(
				`http://localhost:8000/auth/password-reset/${token}`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(data),
				}
			)
			const result = await response.json()
			if (response.ok) {
				localStorage.removeItem('token')
				showErrorDialog("Password reset successful. Please login again")
				Router.push('/auth/login')
			} else {
				showErrorDialog(result.message)
			}
		} catch (error) {
			showErrorDialog(error.message)
		} finally {
			setShowPassword(false)
			setshowConfirmPassword(false)
			reset()
		}
	}

	const onError = (errorList) => {
		if (
			errorList.password &&
			errorList.password.message == 'Please enter a password'
		) {
			showErrorDialog(errorList.password.message)
		} else if (errorList.confirmPassword) {
			console.log(errors)
			showErrorDialog(errorList.confirmPassword.message)
		}
	}

	const onClose = () => {
		closeErrorDialog()
	}

	return (
		<>
			<form
				onSubmit={handleSubmit(onSubmit, onError)}
				className='w-full flex flex-col gap-10'
			>
				<div className='flex flex-col gap-3 relative'>
					<label className='block text-[1.5rem] font-medium text-gray-700'>
						Password
					</label>
					<div className='flex justify-between items-center gap-6 text-[2rem] border-black border-solid p-2'>
						<input
							{...register('password', {
								required: 'Please enter a password',
								minLength: {
									value: 6,
									message:
										'Password should have at least 6 characters',
								},
							})}
							className='w-full'
							type={showPassword ? 'text' : 'password'}
							placeholder='Password'
						/>
						<button
							type='button'
							onClick={togglePasswordVisibility}
						>
							{showPassword ? (
								<img
									className='w-9'
									src='/images/eye.svg'
									alt=''
								/>
							) : (
								<img
									className='w-9'
									src='/images/eyeslash.svg'
									alt=''
								/>
							)}
						</button>
					</div>
				</div>

				<div className='flex flex-col gap-3 relative'>
					<label className='block text-[1.5rem] font-medium text-gray-700'>
						Confirm Password
					</label>
					<div className='flex justify-between items-center gap-6 text-[2rem] border-black border-solid p-2'>
						<input
							{...register('confirmPassword', {
								required: 'Enter password again',
								message:
									'Passwords do not match. Please re-enter the password',
							})}
							className='w-full'
							type={showConfirmPassword ? 'text' : 'password'}
							placeholder='Confirm Password'
						/>

						<button
							type='button'
							onClick={toggleConfirmPasswordVisibility}
						>
							{showConfirmPassword ? (
								<img
									className='w-9'
									src='/images/eye.svg'
									alt=''
								/>
							) : (
								<img
									className='w-9'
									src='/images/eyeslash.svg'
									alt=''
								/>
							)}
						</button>
					</div>
				</div>

				<div className='w-full flex justify-center'>
					<button
						type='submit'
						className='w-[15rem] flex items-center justify-center bg-[#2f2f2f] text-white h-[45px] px-4 rounded-sm hover:bg-[#0e0202] text-[1.7rem]'
					>
						<p>Reset Password</p>
					</button>
				</div>
			</form>
			<DialogBox
				isOpen={errorDialog.isOpen}
				message={errorDialog.message}
				onClose={onClose}
			/>
		</>
	)
}
