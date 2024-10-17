'use client'

import Loader from '@/components/Loader'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const AuthSuccess = () => {
	const router = useRouter()
	const { login } = useAuth()
	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	useEffect(() => {
		console.log(token)
		if (token) {
			localStorage.setItem('jwt', token)

			console.log('Log in successful')

			login(token)
			router.push('/')
		}
	}, [token])

	return <Loader />
}

export default AuthSuccess
