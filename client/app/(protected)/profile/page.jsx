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
	const onProfileSubmit = async (data) => {
		if (!data.name) {
			openDialog('Please provide the new name to update')
			return
		}

		try {
			const response = await axios.patch(
				'http://localhost:8000/auth/update-profile',
				{
					name: data.name,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						authorization: `Bearer ${localStorage.getItem('jwt')}`,
					},
				}
			)

			openDialog(response.data.message)
		} catch (error) {
			openDialog(error.response.data.message)
		}
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
			return
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
		<div className='flex flex-col justify-center items-center gap-8 lg:w-screen-md  mx-auto py-[5rem]'>
			<div className='cursor-pointer h-full flex justify-center items-center'>
				{user?.picture ? (
					<DynamicLazyBlurImage
						src={user?.picture}
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
				className='md:w-1/2 flex flex-col gap-[1rem]'
			>
				<div className='flex flex-col gap-3 relative'>
					<label className='text-[2rem] font-medium text-gray-700 px-[1.5rem]'>
						Name
					</label>
					<input
						{...register('name', {
							required: 'Please provide the new name to update',
						})}
						className='text-[2rem] w-full rounded-full px-[1.5rem] py-[0.5rem]'
						defaultValue={user?.name}
						type='text'
						placeholder='Name'
					/>
					<button
						type='submit'
						className='absolute right-0 bottom-0 translate-x-[150%]'
					>
						<LazyBlurImage
							src='icons/change.png'
							alt={'change name'}
							width={30}
							height={30}
							rounded={false}
							bgColor={false}
						/>
					</button>
				</div>
				<div className='w-full flex justify-center'></div>
				<div className='flex flex-col gap-3'>
					<label className='block text-[2rem] font-medium text-gray-700 px-[1.5rem]'>
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
						className='text-[2rem] w-full rounded-full px-[1.5rem] py-[0.5rem] bg-white cursor-not-allowed opacity-50'
						type='email'
						placeholder='Email'
					/>
				</div>
			</form>
			{user?.admin ? (
				<form
					onSubmit={handleSubmit(onPasswordSubmit, onPasswordError)}
					className='md:w-1/2 flex flex-col gap-[1rem] relative'
				>
					<div className='flex flex-col gap-3 relative'>
						<label className='block text-[2rem] font-medium text-gray-700 px-[1.5rem]'>
							Old Password
						</label>
						<div className='flex justify-between items-center gap-6 text-[2rem] bg-gray-300 rounded-full pr-[1rem]'>
							<input
								{...register('oldPassword', {
									minLength: {
										value: 8,
										message:
											'Password should have at least 8 characters',
									},
								})}
								className='w-full p-2 rounded-l-full px-[1.5rem] py-[0.5rem]'
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
										alt='show password'
									/>
								) : (
									<img
										className='w-9'
										src='/images/eyeslash.svg'
										alt='show password'
									/>
								)}
							</button>
						</div>
					</div>

					<div className='flex flex-col gap-3 relative'>
						<label className='block text-[2rem] font-medium text-gray-700 px-[1.5rem]'>
							New Password
						</label>
						<div className='flex justify-between items-center gap-6 text-[2rem] bg-gray-300 rounded-full pr-[1rem]'>
							<input
								{...register('newPassword', {
									minLength: {
										value: 8,
										message:
											'Password should have at least 8 characters',
									},
								})}
								className='w-full rounded-l-full px-[1.5rem] py-[0.5rem]'
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
										alt='show password'
									/>
								) : (
									<img
										className='w-9'
										src='/images/eyeslash.svg'
										alt='show password'
									/>
								)}
							</button>
						</div>
					</div>

					<div className='flex flex-col gap-3 relative'>
						<label className='block text-[2rem] font-medium text-gray-700 px-[1.5rem]'>
							Confirm New Password
						</label>
						<div className='flex justify-between items-center gap-6 text-[2rem] bg-gray-300 rounded-full pr-[1rem]'>
							<input
								{...register('confirmPassword', {
									minLength: {
										value: 8,
										message:
											'Password should have at least 8 characters',
									},
								})}
								className='w-full rounded-l-full px-[1.5rem] py-[0.5rem]'
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
										alt='show password'
									/>
								) : (
									<img
										className='w-9'
										src='/images/eyeslash.svg'
										alt='show password'
									/>
								)}
							</button>
						</div>
					</div>

					<button
						type='submit'
						className='absolute right-0 bottom-0 translate-x-[150%]'
					>
						<LazyBlurImage
							src='icons/change.png'
							alt={'change password'}
							width={30}
							height={30}
							rounded={false}
							bgColor={false}
						/>
					</button>
				</form>
			) : null}
		</div>
	)
}

export default Profile
