import Link from 'next/link'

const Unauthorized = () => {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen text-center'>
			<h1 className='text-6xl font-bold'>403</h1>
			<h2 className='text-2xl mt-4'>Unauthorized Access</h2>
			<p className='mt-2'>
				Sorry, you don't have permission to view this page.
			</p>
			<Link
				href='/auth/login'
				className='mt-4 text-blue-500 hover:underline'
			>
				<p>Go to Login</p>
			</Link>
		</div>
	)
}

export default Unauthorized
