'use client'
import Navbar from '@/components/navbar'
import Protected from '@/hoc/Protected'

const layout = ({ children }) => {

	return (
		<Protected>
			<main className='flex h-screen w-screen max-container overflow-hidden p-4 gap-4 relative'>
				<div className='w-full flex flex-col gap-5'>
					<Navbar/>
					<div className='bg-gray-200 h-full rounded-lg p-5 overflow-auto'>
						{children}
					</div>
				</div>
			</main>
		</Protected>
	)
}

export default layout
