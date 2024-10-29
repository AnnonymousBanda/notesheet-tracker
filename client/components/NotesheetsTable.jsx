import React from 'react'
import { LazyBlurImage } from './LazyBlurImage'
import eye from '@/public/images/eye.svg'
import download from '@/public/images/download.svg'
import Image from 'next/image'
import { formatDate } from '@/utils/utils'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

export default function NotesheetsTable({ notesheets }) {
	const pathname = usePathname()
	const searchparams = useSearchParams()
	const params = new URLSearchParams(searchparams)
	const { replace, router } = useRouter()

	return (
		<div className='flex flex-col gap-3 items'>
			{notesheets?.map((notesheet, index) => (
				<div
					onClick={() => {
						window.open(`/notesheet/${notesheet?._id}`, '_blank')
					}}
					key={notesheet?.id}
					className={`flex items-center ${index === notesheets.length - 1 ? 'rounded-b-xl' : ''} justify-around text-gray-700 font-semibold cursor-pointer hover:bg-blue-200 transition-colors duration-300`}
				>
					<p className='w-1/12 p-3 rounded-xl'>{index + 1}</p>
					<p className='w-5/12 p-3 rounded-xl'>
						{notesheet?.subject}
					</p>
					<p className='w-2/12 p-3 rounded-xl text-center'>
						{formatDate(notesheet?.raisedAt)}
					</p>
					<p className='w-1/12 p-3 rounded-xl'>
						₹{notesheet?.amount}
					</p>
					{(params.get('type') === 'to-approve' ||
					params.get('type') === 'approved') ? (
						<p className='w-2/12 p-3 rounded-xl text-center'>
							{notesheet?.raiser}
						</p>
					) : null}
					{params.get("status") === "rejected" && (
              			<p className="w-2/12 min-w-[16.66666%] p-3 rounded-xl">
							{notesheet?.status?.rejectedBy?.comment}
						</p>
            		)}
					<p className='w-[8rem] p-3 rounded-xl flex justify-center'>
						<LazyBlurImage
							src={`icons/${notesheet?.status?.state}.png`}
							width={25}
							height={25}
							rounded={false}
							bgColor={false}
						/>
					</p>
					<p className='w-[14rem] p-3 rounded-xl flex justify-center gap-[2rem]'>
						<a
							onClick={(e) => e.stopPropagation()}
							href={notesheet?.pdf}
							target='_blank'
							rel='noopener noreferrer'
						>
							<Image
								src={eye}
								alt='eye icon'
								width={25}
								height={25}
							/>
						</a>
						<a
							onClick={(e) => e.stopPropagation()}
							href={`http://localhost:8000/api/download/notesheet/${notesheet?.pdf.split('/').pop()}`}
							target='_blank'
							download
						>
							<Image
								src={download}
								alt='download icon'
								width={25}
								height={25}
							/>
						</a>
					</p>
				</div>
			))}
		</div>
	)
}
