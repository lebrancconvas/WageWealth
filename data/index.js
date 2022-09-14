const puppeteer = require('puppeteer');
const fs = require('fs');

let country; //0
let annualNominal; //2
let hourlyNominal; //5 
let workweek; //4

let countryData = {};
let countryList = [];

const app = async() => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto('https://en.wikipedia.org/wiki/List_of_countries_by_minimum_wage');

	for(let i = 1; i < 202; i++) {
		const selector = `#mw-content-text > div.mw-parser-output > table:nth-child(14) > tbody > tr:nth-child(${i})`;
		const element = await page.$(selector);
		let value = await page.evaluate(el => el.textContent, element);
		value = value.split('\n').filter(x => x !== "");
		countryData = {
			country: value[0],
			annualNominal: value[2],
			hourlyNominal: value[5],
			workweek: value[4]
		}
		countryList.push(countryData);
	}
	const jsonData = JSON.stringify(countryList);

	fs.writeFile('./data/data.json', jsonData, (err) => {
		if(err) throw err;
		console.log('Data written to file');
	});

	await browser.close();
};

app();