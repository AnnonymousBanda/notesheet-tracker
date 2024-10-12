'use client'

import { useAuth } from '@/contexts/AuthContext'
import withAuth from '@/hoc/withAuth'
import LazyBlurImage from '@/components/LazyBlurImage'

function Home() {
	const { user, isAuthenticated, isAdmin } = useAuth()

	console.log(user, isAuthenticated(), isAdmin())

	return (
		<div>
			<h1>Home</h1>
			<LazyBlurImage
				src='image.jpg'
				alt='Lazy Load'
				width={500}
				height={500}
			/>
		</div>
	)
}

export default withAuth(Home, ['user', 'admin'])
