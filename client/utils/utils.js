const { signImages, iitplogo, stclogo } = require('./signature')

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

const html = (approvals, pendingApproval) => {
	console.log(approvals, '\n', pendingApproval)

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
				padding: 20px;
				box-sizing: border-box;
				font-family: 'Gill Sans', 'Gill Sans MT', Calibri,
					'Trebuchet MS', sans-serif;

				width: 100vw;
				height: 100vh;
			}
			.header-container {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 10px 20px;
				border-bottom: 3px solid black;
			}
			.header-container img {
				height: 80px;
			}
			.center-text {
				text-align: center;
				font-size: 14px;
				font-weight: 400;
			}
			.center-text p {
				margin: 5px 0;
			}
			.contact-info {
				text-align: right;
				font-size: 14px;
				font-weight: normal;
			}
			main {
				padding: 80px 0px;
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				align-items: flex-start;
				gap: 80px;

				width: 100%;
			}
			.container {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 0px;
			}
			.container img {
				width: 100px;
				height: 100px;
				object-fit: contain;
			}
			.signature {
				width: 100px;
				height: 100px;
			}
			.container p {
				text-align: center;
				font-size: 1.4rem;
				font-weight: 400;
				padding: 0;
				margin: 0;
			}
		</style>
    </head>
    <body>
		<header class="header-container">
			<img src="${iitplogo}" alt="Left Logo" />
			<div class="center-text">
				<p>INDIAN INSTITUTE OF TECHNOLOGY PATNA</p>
				<p>Students’ Technical Council</p>
				<p>Patna, India – 801 103</p>
			</div>
			<div class="contact-info">
				<p>Tel. (+91) 6115 233785</p>
			</div>
			<img src="${stclogo}" alt="Right Logo" />
		</header>
        <main>
        ${approvals.map(
			(authority) =>
				`<div class="container">
                    <img src="${signImages[authority.admin]}" alt="Signature">
                    <p>${authority.name}, ${authority.admin}</p>
            </div>`
		)}

        ${pendingApproval.map(
			(authority) =>
				`<div class="container">
                    <div class="signature"></div>
                    <p>${authority.name}, ${authority.admin}</p>
			</div>`
		)}
        </main>
    </body>
    </html>`

	return HTML
}

export { formatDate, formatAmount, html }
