'use client'

import Sidebar from '@/components/sidebar'
import Navbar from '@/components/navbar'
import { useState } from 'react'
import Protected from '@/hoc/Protected'

const layout = ({ children }) => {
	const [issidebarOpen, setisSidebarOpen] = useState(false)

	return (
		<Protected>
			<main className='flex h-screen w-screen max-container p-4 gap-4'>
				<Sidebar
					isSidebarOpen={issidebarOpen}
					setisSidebarOpen={setisSidebarOpen}
				/>
				<div className='w-full flex flex-col gap-5'>
					<Navbar
						isSidebarOpen={issidebarOpen}
						setisSidebarOpen={setisSidebarOpen}
					/>
					<div className='bg-gray-200 h-full rounded-lg p-5'>
						{children}
					</div>
				</div>
			</main>
		</Protected>
	)
}

export default layout
