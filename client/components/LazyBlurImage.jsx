import Image from 'next/image'

const LazyBlurImage = ({ src, alt, width, height, className = '' }) => {
	return (
		<div
			style={{
				width: `${width / 10}rem`,
				height: `${height / 10}rem`,
				position: 'relative',
			}}
		>
			<Image
				src={`/images/${src}`}
				alt={alt}
				className={`object-cover object-center ${className}`}
				loading='lazy'
				placeholder='blur'
				blurDataURL={`/images/blurred/${src}`}
				layout='fill'
				objectFit='cover'
				objectPosition='center'
			/>
		</div>
	)
}

export default LazyBlurImage
