'use client'
import { DynamicLazyBlurImage, LazyBlurImage } from '@/components/LazyBlurImage'
import { useAuth } from '@/contexts/AuthContext'
import { useDialog } from '@/contexts/DialogBoxContext'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'

const Profile = () => {
	const [showPassword, setShowPassword] = useState(false)
	const [shownewPassword, setShowNewPassword] = useState(false)
	const [showconfirmPassword, setShowConfirmPassword] = useState(false)
	const { openDialog } = useDialog()
	const { logout } = useAuth()
	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword)
	}
	const toggleNewPasswordVisibility = () => {
		setShowNewPassword(!shownewPassword)
	}
	const toggleConfirmPasswordVisibility = () => {
		setShowConfirmPassword(!showconfirmPassword)
	}
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm()
	const { user } = useAuth()

	const onProfileError = (errorList) => {
		console.log('ErrorList', errorList)
	}
	const onProfileSubmit = (data) => {
		console.log('Data', data)
	}

	const onPasswordError = (errorList) => {
		if (errorList.oldPassword) {
			openDialog(errorList.oldPassword.message)
		} else if (errorList.newPassword) {
			openDialog(errorList.newPassword.message)
		} else if (errorList.confirmPassword) {
			openDialog(errorList.confirmPassword.message)
		}
	}

	const onPasswordSubmit = async (data) => {
		if (!data.oldPassword) {
			openDialog('Please provide the old password to change the password')
			reset()
		} else if (!data.newPassword) {
			openDialog('Please provide the new password to change the password')
			return
		} else if (!data.confirmPassword) {
			openDialog('Please re-enter the new password')
			return
		} else if (data.newPassword !== data.confirmPassword) {
			openDialog('New password and confirm password should be same')
			return
		}
		console.log('Data', data)

		try {
			const response = await axios.patch(
				'http://localhost:8000/auth/change-password',
				{
					oldPassword: data.oldPassword,
					password: data.newPassword,
					confirmPassword: data.confirmPassword,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						authorization: `Bearer ${localStorage.getItem('jwt')}`,
					},
				}
			)

			openDialog(response.data.message)
			setTimeout(() => {
				logout()
			}, 2000)
		} catch (error) {
			openDialog(error.response.data.message)
		}
	}
	return (
		<div className='flex flex-col justify-center items-center gap-8 lg:w-screen-md  mx-auto'>
			<div className='cursor-pointer h-full flex justify-center items-center'>
				{user?.photoURL ? (
					<DynamicLazyBlurImage
						src={user?.photoURL}
						alt='profile picture'
						width={35}
						height={35}
						className='p-[3rem]'
					/>
				) : (
					<LazyBlurImage
						src='user.png'
						alt='profile picture'
						width={150}
						height={150}
						className='p-[0.2rem]'
					/>
				)}
			</div>
			<form
				onSubmit={handleSubmit(onProfileSubmit, onProfileError)}
				className='md:w-1/2 flex flex-col gap-8'
			>
				<div className='flex flex-col gap-3'>
					<label className='text-[2rem] font-medium text-gray-700'>
						Name
					</label>
					<input
						{...register('raisedBy', {
							required:
								'Please provide the name of the authority raising the notesheet',
						})}
						className='text-[2rem] border-gray-400 focus:border-blue-400 border-solid w-full p-2'
						defaultValue={user?.name}
						type='text'
						placeholder='Authority raising the notesheet'
					/>
				</div>
				<div className='flex flex-col gap-3'>
					<label className='block text-[2rem] font-medium text-gray-700'>
						Email
					</label>
					<input
						{...register('email', {
							pattern: {
								value: /^[a-zA-Z0-9._%+-]+@(outlook\.com|hotmail\.com|live\.com|msn\.com|iitp\.ac\.in)$/,
								message:
									'Please provide a valid outlook email address!',
							},
						})}
						disabled
						value={user?.email}
						className='text-[2rem] border-gray-400 focus:border-blue-400 border-solid w-full p-2 cursor-not-allowed'
						type='email'
						placeholder='Email'
					/>
				</div>
			</form>
			<form
				onSubmit={handleSubmit(onPasswordSubmit, onPasswordError)}
				className='md:w-1/2 flex flex-col gap-8'
			>
				<div className='flex flex-col gap-3 relative'>
					<label className='block text-[2rem] font-medium text-gray-700'>
						Old Password
					</label>
					<div className='flex justify-between items-center gap-6 text-[2rem] border-gray-400 focus:border-blue-400 border-solid p-2'>
						<input
							{...register('oldPassword', {
								minLength: {
									value: 8,
									message:
										'Password should have at least 8 characters',
								},
							})}
							className='w-full p-2'
							type={showPassword ? 'text' : 'password'}
							placeholder='Old Password'
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
					<label className='block text-[2rem] font-medium text-gray-700'>
						New Password
					</label>
					<div className='flex justify-between items-center gap-6 text-[2rem] border-gray-400 focus:border-blue-400 border-solid p-2'>
						<input
							{...register('newPassword', {
								minLength: {
									value: 8,
									message:
										'Password should have at least 8 characters',
								},
							})}
							className='w-full p-2'
							type={shownewPassword ? 'text' : 'password'}
							placeholder='New Password'
						/>
						<button
							type='button'
							onClick={toggleNewPasswordVisibility}
						>
							{shownewPassword ? (
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
					<label className='block text-[2rem] font-medium text-gray-700'>
						Confirm New Password
					</label>
					<div className='flex justify-between items-center gap-6 text-[2rem] border-gray-400 focus:border-blue-400 border-solid p-2'>
						<input
							{...register('confirmPassword', {
								minLength: {
									value: 8,
									message:
										'Password should have at least 8 characters',
								},
							})}
							className='w-full p-2'
							type={showconfirmPassword ? 'text' : 'password'}
							placeholder='Confirm new Password'
						/>
						<button
							type='button'
							onClick={toggleConfirmPasswordVisibility}
						>
							{showconfirmPassword ? (
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
						className='flex items-center justify-center bg-[#2f2f2f] text-white h-[45px] px-4 rounded-sm hover:bg-[#0e0202] text-[1.7rem]'
					>
						<p>Change Password</p>
					</button>
				</div>
			</form>
		</div>
	)
}

export default Profile
