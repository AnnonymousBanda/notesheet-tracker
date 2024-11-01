const fs = require('fs')
const { PDFDocument } = require('pdf-lib')
const pdf = require('html-pdf')
const path = require('path')
const { removePDF } = require('./../utils/api.util')
const { catchAsync } = require('../utils/error.util')

const createPdfAsync = (html, filePath) => {
	return new Promise((resolve, reject) => {
		pdf.create(html).toFile(filePath, (err, res) => {
			if (err) {
				return reject(err)
			}
			resolve(res)
		})
	})
}

const createSign = catchAsync(async (req, res) => {
	const html = req.body.html
	const filename = req.body.filename

	const filePath = path.join(
		__dirname,
		'..',
		'public',
		'uploads',
		`${filename.replace('.pdf', '-sign.pdf')}`
	)

	const result = await createPdfAsync(html, filePath)

	res.status(200).json({ message: 'PDF created successfully', result })
})

const mergeSign = catchAsync(async (req, res) => {
	const filename = req.body.filename

	const filenameSign = filename.replace('.pdf', '-sign.pdf')
	const pdfPaths = [filename, filenameSign].map((pdfPath) =>
		path.join(__dirname, '..', 'public', 'uploads', pdfPath)
	)

	const mergedPdf = await PDFDocument.create()
	for (const pdfPath of pdfPaths) {
		const pdfBytes = fs.readFileSync(pdfPath)
		const pdfDoc = await PDFDocument.load(pdfBytes)
		const copiedPages = await mergedPdf.copyPages(
			pdfDoc,
			pdfDoc.getPageIndices()
		)
		copiedPages.forEach((page) => mergedPdf.addPage(page))
	}
	const mergedPdfBytes = await mergedPdf.save()

	removePDF(filenameSign)

	fs.writeFileSync(
		path.join(__dirname, '..', 'public', 'uploads', filename),
		mergedPdfBytes
	)

	res.status(200).json({ message: 'PDFs merged successfully', filename })
})

module.exports = { createSign, mergeSign }
