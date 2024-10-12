import withAuth from '@/hoc/withAuth'

const Profile = () => {
	return <div>Profile</div>
}

export default withAuth(Profile, ['user', 'admin'])
