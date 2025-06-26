export function base64URLEncode(buffer) {
	return btoa(String.fromCharCode(...new Uint8Array(buffer)))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '')
}

export async function generatePKCE() {
	const array = new Uint8Array(32)
	window.crypto.getRandomValues(array)
	const verifier = base64URLEncode(array.buffer)
	const digest = await crypto.subtle.digest(
		'SHA-256',
		new TextEncoder().encode(verifier)
	)
	const challenge = base64URLEncode(digest)
	return { verifier, challenge }
}
