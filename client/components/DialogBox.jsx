'use client'
const DialogBox = ({ isOpen, message, onClose }) => {
	if (!isOpen) return null

	return (
		<div className='fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center'>
			<div className='bg-white p-6 rounded-lg shadow-lg max-w-lg'>
				<p className='text-[1.5rem] font-medium text-gray-800'>
					{message}
				</p>
				<div className='flex justify-end mt-4'>
					<button
						className='bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-[1.4rem]'
						onClick={onClose}
					>
						close
					</button>
				</div>
			</div>
		</div>
	)
}

export default DialogBox
