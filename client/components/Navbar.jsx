'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DynamicLazyBlurImage, LazyBlurImage } from './LazyBlurImage'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const DropdownMenu = ({ isOpen, setIsOpen }) => {
	const handlecloseMenu = () => {
		setIsOpen(false)
	}
	const { logout } = useAuth()
	const handleLogout = async () => {
		await logout()
		handlecloseMenu()
	}

	useEffect(() => {
		if (isOpen) {
			document.onkeydown = function (event) {
				if (event.key === 'Escape') {
					setIsOpen(false)
				}
			}
		}
		return () => {
			document.onkeydown = null
		}
	}, [isOpen])

	return (
		<div
			className={`${
				isOpen ? 'block' : 'hidden'
			} absolute z-10 bg-white w-72 right-[2.5rem] top-[8.5rem] p-2 rounded-md transition-transform duration-1000 shadow-xl`}
		>
			<div className='flex flex-col'>
				<Link
					onClick={handlecloseMenu}
					href='/'
					className='flex gap-3 hover:bg-gray-100 p-4 transition-all duration-500'
				>
					<img
						src='/images/dashboard.svg'
						alt='Home icon'
						className='w-8'
					/>
					<p className='text-[1.5rem] text-gray-500 font-bold'>
						HOME
					</p>
				</Link>
				<Link
					onClick={handlecloseMenu}
					href='/profile'
					className='flex gap-3 hover:bg-gray-100 p-4 transition-all duration-500'
				>
					<img
						src='/images/user.svg'
						alt='User icon'
						className='w-8 '
					/>
					<p className='text-[1.5rem] text-gray-500 font-bold'>
						PROFILE
					</p>
				</Link>

				<button
					onClick={handleLogout}
					className='flex gap-3 items-center hover:bg-red-300  p-4 transition-all duration-500'
				>
					<img
						src='/images/logout.svg'
						alt='Logout icon'
						className='w-8'
					/>
					<p className='text-[1.5rem] text-gray-500 font-bold'>
						LOGOUT
					</p>
				</button>
			</div>
		</div>
	)
}

export default function Navbar() {
	const pathname = usePathname()
	const pathSegments = pathname.split('/')
	const route =
		pathSegments.length > 2 ? pathSegments[1] : pathSegments[1] || ''

	const [isOpen, setIsOpen] = useState(false)
	const toggleMenu = () => setIsOpen(!isOpen)
	const { user } = useAuth()

	return (
		<div className='w-full bg-gray-200 min-h-[7rem] h-[8rem] px-8 py-4 flex justify-between items-center rounded-lg'>
			<h4 className='text-gray-500 font-bold'>
				{route.toUpperCase() == '' ? 'DASHBOARD' : route.toUpperCase()}
			</h4>
			<div
				onClick={toggleMenu}
				className='cursor-pointer h-full flex justify-center items-center'
			>
				{user?.picture ? (
					<DynamicLazyBlurImage
						src={user.picture}
						alt='profile picture'
						width={35}
						height={35}
						className='p-[3rem]'
					/>
				) : (
					<LazyBlurImage
						src='user.png'
						alt='profile picture'
						width={40}
						height={40}
						className='p-[0.2rem]'
					/>
				)}
			</div>
			<DropdownMenu isOpen={isOpen} setIsOpen={setIsOpen} />
		</div>
	)
}
