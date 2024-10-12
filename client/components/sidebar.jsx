import gsap from 'gsap'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useEffect } from 'react'

import LazyBlurImage from '@/components/LazyBlurImage'

function SidebarButton({ text, image, alt, route }) {
	const router = useRouter()
	return (
		<button
			onClick={() => {
				router.push(route)
			}}
			className='flex items-center justify-start gap-4 rounded-lg transition-all duration-500 cursor-pointer hover:bg-blue-200 p-6 lg:py-6 lg:px-4 xl:p-8'
		>
			<img
				src={`/images/${image}`}
				className='w-[2.5rem] h-[2.5rem]'
				alt={alt}
			/>
			<h4 className='xl:text-[2.5rem]'>{text}</h4>
		</button>
	)
}

export default function Sidebar({ isSidebarOpen }) {
	const tl = gsap.timeline()
	useEffect(() => {
		if (isSidebarOpen) {
			tl.to('.sidecontainer', {
				left: '0',
				opacity: 1,
				duration: 0.5,
			})
			tl.to('.sidecontainer', {
				backgroundColor: 'rgba(0, 0, 0, 0.3)',
				backdropFilter: 'blur(10px)',
				duration: 0.5,
			})
		} else {
			tl.to('.sidecontainer', {
				backgroundColor: 'transparent',
				backdropFilter: 'blur(0px)',
				duration: 0.5,
			})
			tl.to('.sidecontainer', {
				left: '-100%',
				duration: 0.5,
			})
		}
	}, [isSidebarOpen])
	return (
		<div
			className={`sidecontainer lg:opacity-100 opacity-0 lg:w-4/12 w-full left-[100%] lg:static absolute p-4 h-screen`}
		>
			<div className='lg:w-full w-1/2 h-full lg:px-8 bg-gray-200 rounded-lg flex flex-col justify-around'>
				<div className='w-full flex justify-center'>
					<LazyBlurImage
						src='iitplogo.png'
						alt='IITP logo'
						width={130}
						height={130}
						className='rounded-full'
					/>
				</div>
				<div className='w-full h-[40vh] text-center flex flex-col justify-evenly gap-[1.5rem] container mx-auto'>
					<SidebarButton
						text='Dashboard'
						image='dashboard.svg'
						alt='Dashboard icon'
						route='/'
					/>
					<SidebarButton
						text='Notesheets'
						image='notesheet.svg'
						alt='Notesheet icon'
						route='/my-notesheets'
					/>
					<SidebarButton
						text='New Notesheet'
						image='newnotesheet.svg'
						alt='New notesheet icon'
						route='/new-notesheet'
					/>
					<SidebarButton
						text='Profile'
						image='user.svg'
						alt='Profile icon'
						route='/profile'
					/>
				</div>
				<button className='flex justify-start items-center gap-8 rounded-lg transition-all duration-500 cursor-pointer p-8 hover:bg-green-300'>
					<img
						src='/images/logout.svg'
						width={30}
						height={30}
						alt='Logout icon'
					/>
					<h4 className='xl:text-[2.5rem]'>LOGOUT</h4>
				</button>
			</div>
		</div>
	)
}
