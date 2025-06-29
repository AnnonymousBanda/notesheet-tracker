'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function OutlookCallback() {
	const router = useRouter()
	const searchParams = useSearchParams()

	useEffect(() => {
		const getToken = async () => {
			const code = searchParams.get('code')
			const verifier = sessionStorage.getItem('pkce_verifier')
			if (!code || !verifier) {
				alert('Something went wrong! Please try again.')
				router.push('/auth/login')
			}

			const data = new URLSearchParams({
				client_id: process.env.NEXT_PUBLIC_OUTLOOK_CLIENT_ID,
				grant_type: 'authorization_code',
				code,
				redirect_uri: `${process.env.NEXT_PUBLIC_CLIENT_URL}/outlook`,
				code_verifier: verifier,
			})

			const response = await fetch(
				`https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_OUTLOOK_TENANT_ID}/oauth2/v2.0/token`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					body: data.toString(),
				}
			)

			const result = await response.json()

			console.log('Access token:', result.access_token)
			alert(result.access_token)

			sessionStorage.setItem('access_token', result.access_token)
			router.push('/profile?access_token=' + result.access_token)
		}

		getToken()
	}, [searchParams])

	return <h1>Authenticating with Outlook...</h1>
}
