'use client'
import Loader from '@/components/Loader'
import ResetPasswordForm from '@/components/Resetpasswordform'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function ForgotPassword() {
	const [loading, setLoading] = useState(true)
	const { token } = useParams()
	const Router = useRouter()

	useEffect(() => {
		const verifyToken = async () => {
			try {
				const response = await fetch(
					`http://localhost:8000/auth/verify-password-reset-token`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ token }),
					}
				)

				const result = await response.json()

				if (response.ok) {
					setLoading(false)
				} else {
					Router.push('/not-found')
				}
			} catch (error) {
				console.error(error.message)
			}
		}
		verifyToken()
	}, [])

	if (loading) {
		return <Loader />
	}

	return (
		<>
			<div className=' flex flex-col items-center justify-center min-h-screen p-5 bg-gray-200'>
				<div className='w-full max-w-xl p-10 pb-20  bg-white rounded-lg shadow-lg flex flex-col gap-8 items-center border border-gray-300'>
					<div className='flex flex-col items-center gap-4 w-full text-center'>
						<h3>Reset Password</h3>
					</div>
					<ResetPasswordForm token={token} />
				</div>
			</div>
		</>
	)
}
