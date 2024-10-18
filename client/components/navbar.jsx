'use client'
import gsap from 'gsap'
import React from 'react'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DynamicLazyBlurImage, LazyBlurImage } from './LazyBlurImage'

export default function Navbar({ isSidebarOpen, setisSidebarOpen }) {
	const { user } = useAuth()
	const tl = gsap.timeline()
	useEffect(() => {
		if (isSidebarOpen) {
			tl.to('.one', {
				rotate: '45deg',
				y: '0.5rem',
				duration: 0.5,
			})
			tl.to(
				'.two',
				{
					opacity: 0,
					duration: 0.5,
				},
				'-=0.5'
			)
			tl.to(
				'.three',
				{
					rotate: '-45deg',
					y: '-0.5rem',
					duration: 0.5,
				},
				'-=0.5'
			)
		} else {
			tl.to('.one', {
				rotate: '0deg',
				y: '0rem',
				duration: 0.5,
			})
			tl.to(
				'.three',
				{
					rotate: '0deg',
					y: '0rem',
					duration: 0.5,
				},
				'-=0.5'
			)
			tl.to(
				'.two',
				{
					opacity: 1,
					delay: 0.3,
					duration: 0.3,
				},
				'-=0.5'
			)
		}
	}, [isSidebarOpen])
	return (
		<div className='w-full bg-gray-200 h-[8vh] px-8 py-4 flex justify-between items-center rounded-lg'>
			<div
				onClick={() => {
					setisSidebarOpen(!isSidebarOpen)
				}}
				className='relative z-[100] flex flex-col gap-1 lg:hidden'
			>
				<div className='one relative w-8 h-1 bg-black'></div>
				<div className='two relative w-8 h-1 bg-black'></div>
				<div className='three relative w-8 h-1 bg-black'></div>
			</div>
			<h4>DASHBOARD</h4>
			<div className='cursor-pointer h-full flex justify-center items-center'>
				{!!user?.photoURL ? (
					<DynamicLazyBlurImage
						src={user.photoURL}
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
						className='p-[0.1rem]'
					/>
				)}
			</div>
		</div>
	)
}
