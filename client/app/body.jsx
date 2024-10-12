'use client'

import React from 'react'
import Sidebar from '@/components/sidebar'
import Navbar from '@/components/navbar'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { AuthProvider } from '@/contexts/AuthContext'

export default function Body({ children }) {
	const pathname = usePathname()
	const islogin = pathname.slice(0, 5) == '/auth'
	const [issidebarOpen, setisSidebarOpen] = useState(false)
	
	return (
		<body>
			<AuthProvider>
				<div className='flex'>
					{!islogin && <Sidebar isSidebarOpen={issidebarOpen} />}
					<div className='w-full flex flex-col'>
						{!islogin && (
							<Navbar
								isSidebarOpen={issidebarOpen}
								setisSidebarOpen={setisSidebarOpen}
							/>
						)}
						{children}
					</div>
				</div>
			</AuthProvider>
		</body>
	)
}
