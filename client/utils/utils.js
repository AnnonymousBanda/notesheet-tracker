const { signImages, iitplogo, stclogo } = require("./signature");
import QrCode from "qrcode";
import { useEffect, useState } from "react";

const formatDate = (date) => {
  const newDate = new Date(date);
  const options = {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  const [day, month, year] = new Intl.DateTimeFormat("en-GB", options)
    .format(newDate)
    .split("/");

  return `${day}-${month}-${year}`;
};

const formatAmount = (amount) => {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });
  return formatter.format(amount);
};

const html = async (approvals, pendingApproval, pdf) => {
  console.log(approvals, "\n", pendingApproval);
  console.log(pdf);
  const generateQR = async (pdf) => {
    try {
      const qrbase64 = await QrCode.toDataURL(pdf);
      return qrbase64;
    } catch (error) {
      console.log(error);
    }
  };

  const qr = await generateQR(pdf);

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
			footer {
				position: absolute;
				bottom: 60px;
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				text-align: center;
			}
			footer img {
				width: 100px;
				height: 100px;
				padding: 0px;
				margin: 0px;
			}
			footer p {
				font-size: 1rem;
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 0px;
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
		<footer>
			<p>Scan the QR Code to view the </br> status of the Notesheet</p>
			<img src="${qr}" alt="QR Code" />
			<p>QR Code</p>
		</footer>
    </body>
    </html>`;

  return HTML;
};

export { formatDate, formatAmount, html };
