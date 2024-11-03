const signImages = require('./signature')

const formatDate = (date) => {
	const newDate = new Date(date)
	const options = {
		timeZone: 'Asia/Kolkata',
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	}
	const [day, month, year] = new Intl.DateTimeFormat('en-GB', options)
		.format(newDate)
		.split('/')

	return `${day}-${month}-${year}`
}

const formatAmount = (amount) => {
	const formatter = new Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: 'INR',
	})
	return formatter.format(amount)
}

const html = (...authorities) => {
	console.log('The authorities are\n\n\n\n', authorities)

	const HTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            body {
                margin: 0;
                padding: 100px 0;
                box-sizing: border-box;
                font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                display: flex;
                justify-content: center;
                align-items: flex-start;
            }
            main {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 100px;
            }
            div {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
            }
        
            img {
                width: 100px;
                height: 100px;
            }
            p {
                text-align: center;
                font-size: 1.8rem;
            }
        </style>
    </head>
    <body>
        <main>
        ${authorities.map(
			(authority) =>
				`<div>
                <img src="${signImages[authority.admin]}" alt="Signature">
                <p>${authority.name}, ${authority.admin}</p>
            </div>`
		)}
        </main>
    </body>
    </html>`

	console.log('The HTML is\n\n\n\n', HTML)

	return HTML
}

export { formatDate, formatAmount, html }
