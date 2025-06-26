'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
	const searchParams = useSearchParams()
	const [profile, setProfile] = useState(null)
	const [photoURL, setPhotoURL] = useState(null)

	useEffect(() => {
		const accessToken = searchParams.get('access_token')
		if (!accessToken) return

		const fetchProfile = async () => {
			const res = await fetch('https://graph.microsoft.com/v1.0/me', {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			const data = await res.json()
			setProfile(data)
		}

		const fetchPhoto = async () => {
			const res = await fetch(
				'https://graph.microsoft.com/v1.0/me/photo/$value',
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			)
			const blob = await res.blob()
			setPhotoURL(URL.createObjectURL(blob))
		}

		fetchProfile()
		fetchPhoto()
	}, [searchParams]) // Dependency added here

	if (!profile) return <div>Loading...</div>

	return (
		<div>
			<h1>{profile.displayName}</h1>
			<p>{profile.mail || profile.userPrincipalName}</p>
			{photoURL && <img src={photoURL} alt='Profile' width={100} />}
		</div>
	)
}
