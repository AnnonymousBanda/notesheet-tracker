import React from 'react'
import Loginform from '@/components/Loginform'

export default function Login() {
	return (
		<div className=' flex flex-col items-center justify-center min-h-screen p-5 bg-gray-200'>
			<div className='w-full max-w-xl p-10 pb-20 bg-white rounded-lg shadow-lg flex flex-col gap-8 items-center border border-gray-300'>
				<div className='flex flex-col items-center gap-4 w-full text-center'>
					<h3>Login</h3>
				</div>
				<Loginform />
			</div>
		</div>
	)
}
