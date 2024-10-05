import Image from 'next/image'
import { getPlaiceholder } from 'plaiceholder'
import fs from 'node:fs/promises'

const LazyBlurImage = async ({ src, alt, width, height, className = '' }) => {
	const buffer = await fs.readFile(`./public/images/${src}`)
	const { base64 } = await getPlaiceholder(buffer)

	return (
		<div
			style={{
				width: `${width/10}rem`,
				height: `${height/10}rem`,
				position: 'relative',
			}}
		>
			<Image
				src={`/images/${src}`}
				alt={alt}
				className={`object-cover object-center ${className}`}
				loading='lazy'
				placeholder='blur'
				blurDataURL={base64}
				layout='fill'
				objectFit='cover'
				objectPosition='center'
			/>
		</div>
	)
}

export default LazyBlurImage
