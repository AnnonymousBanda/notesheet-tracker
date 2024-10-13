import './index.css'
import Body from './body'

export const metadata = {
	title: 'NoteSheet-Tracker',
	description:
		'To keep track of your payment notesheets and share them with others',
}

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<Body>{children}</Body>
		</html>
	)
}
