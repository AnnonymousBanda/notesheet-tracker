'use client'

import Sidebar from '@/components/sidebar'
import Navbar from '@/components/navbar'
import { useState } from 'react'
import Protected from '@/hoc/Protected'

const layout = ({ children }) => {
	const [issidebarOpen, setisSidebarOpen] = useState(false)

	return (
		<Protected>
			<div className='flex'>
				<Sidebar isSidebarOpen={issidebarOpen} />
				<div className='w-full flex flex-col'>
					<Navbar
						isSidebarOpen={issidebarOpen}
						setisSidebarOpen={setisSidebarOpen}
					/>
					{children}
				</div>
			</div>
		</Protected>
	)
}

export default layout
