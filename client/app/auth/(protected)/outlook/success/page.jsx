'use client'

import Loader from '@/components/Loader'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const AuthSuccess = () => {
	const router = useRouter()
	const { setUser } = useAuth()
	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	useEffect(() => {
		if (token) {
			const login = async () => {
				try {
					const res = await fetch(
						'http://localhost:8000/api/user/me',
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					)

					const data = await res.json()

					if (res.status === 200) {
						localStorage.setItem('jwt', token)
						setUser(data.user)
						router.push('/')
					} else router.push('/auth/login')
				} catch (error) {
					router.push('/not-found')
				}
			}
			login()
		} else {
			router.push('/not-found')
		}
	}, [])

	return <Loader />
}

export default AuthSuccess
