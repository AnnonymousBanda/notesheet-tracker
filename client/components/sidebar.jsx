'use client'

import gsap from 'gsap'
import React from 'react'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

import { LazyBlurImage } from '@/components/LazyBlurImage'
import Link from 'next/link'

function SidebarButton({ text, image, alt, route, onClick }) {
	return (
		<Link
			href={route}
			className='flex items-center justify-start gap-4 rounded-lg transition-all duration-500 cursor-pointer hover:bg-blue-200 p-6 lg:py-6 lg:px-4 xl:p-8'
		>
			<img
				src={`/images/${image}`}
				className='w-[2.5rem] h-[2.5rem]'
				alt={alt}
			/>
			<p className='text-[2rem]'>{text}</p>
		</Link>
	)
}

export default function Sidebar({ isSidebarOpen, setisSidebarOpen }) {
	const onClick = () => {
		setisSidebarOpen(!isSidebarOpen)
	}
	const tl = gsap.timeline()
	useEffect(() => {
		if (isSidebarOpen) {
			tl.to('.bgblur', {
				opacity: 1,
				duration: 0.5,
			})
			tl.to('.sidebar', {
				left: '1.5%',
				duration: 0.5,
			})
		} else {
			tl.to('.sidebar', {
				left: '-100%',
				duration: 0.5,
			})
			tl.to('.bgblur', {
				opacity: 0,
				duration: 0.5,
			})
		}
	}, [isSidebarOpen])
	const { logout } = useAuth()

	return (
		<>
			<div className='lg:z-0 z-10 top-0 lg:left-0 left-[-100%] sidebar lg:static absolute lg:w-4/12 md:w-1/2 lg:p-0 p-4 w-[95vw] flex justify-around items-center h-full'>
				<div className='min-h-96 overflow-y-auto w-full md:p-4 px-10 lg:px-8 h-full bg-gray-200 rounded-lg flex flex-col py-[5rem] lg:gap-[5rem] gap-[3rem] '>
					<div className='w-full flex justify-center'>
						<LazyBlurImage
							src='iitplogo.png'
							alt='IITP logo'
							width={120}
							height={120}
							onClick={onClick}
						/>
					</div>
					<div className='flex flex-col justify-around gap-[0.3rem]'>
						<SidebarButton
							text='Dashboard'
							image='dashboard.svg'
							alt='Dashboard icon'
							route='/'
							onClick={onClick}
						/>
						<SidebarButton
							text='Notesheets'
							image='notesheet.svg'
							alt='Notesheet icon'
							route='/my-notesheets'
							onClick={onClick}
						/>
						<SidebarButton
							text='New Notesheet'
							image='newnotesheet.svg'
							alt='New notesheet icon'
							route='/new-notesheet'
							onClick={onClick}
						/>
						<SidebarButton
							text='Profile'
							image='user.svg'
							alt='Profile icon'
							route='/profile'
							onClick={onClick}
						/>
						<button>
							<div
								onClick={() => {
									logout()
									onClick()
								}}
								className='flex items-center justify-start gap-4 rounded-lg transition-all duration-500 cursor-pointer hover:bg-red-300 p-6 lg:py-6 lg:px-4 xl:p-8'
							>
								<img
									src='/images/logout.svg'
									className='w-[2.5rem] h-[2.5rem]'
									alt='Logout icon'
								/>
								<p className='text-[2rem]'>Logout</p>
							</div>
						</button>
					</div>
				</div>
			</div>
			<div className='bgblur opacity-0 fixed top-0 left-0 backdrop-blur-sm lg:hidden block h-screen w-screen bg-[#1e1e1eae]'></div>{' '}
		</>
	)
}
