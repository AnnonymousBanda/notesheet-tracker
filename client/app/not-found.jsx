import Link from 'next/link'

const NotFoundPage = () => {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen text-center'>
			<h1 className='text-6xl font-bold'>404</h1>
			<h2 className='text-2xl mt-4'>Page Not Found</h2>
			<p className='mt-2'>
				Sorry, the page you are looking for does not exist.
			</p>
			<Link href='/' className='mt-4 text-blue-500 hover:underline'>
				<p>Go back home</p>
			</Link>
		</div>
	)
}

export default NotFoundPage
