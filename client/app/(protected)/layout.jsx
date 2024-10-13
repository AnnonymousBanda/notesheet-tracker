import Protected from '@/hoc/Protected'

export default function Layout({ children }) {
	return <Protected>{children}</Protected>
}
