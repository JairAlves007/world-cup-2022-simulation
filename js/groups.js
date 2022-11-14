const baseCDN = "https://countryflagsapi.com/svg";
const baseURL = "https://flagcdn.com/en/codes.json";
const groups = {
	A: ["QA", "EC", "SN", "NL"],
	B: ["GB-ENG", "IR", "US", "GB-WLS"],
	C: ["AR", "SA", "MX", "PL"],
	D: ["FR", "AU", "DK", "TN"],
	E: ["ES", "CR", "DE", "JP"],
	F: ["BE", "CA", "MA", "HR"],
	G: ["BR", "RS", "CH", "CM"],
	H: ["PT", "GH", "UY", "KR"]
};

let stage = 0;
const groupsContainer = document.querySelector("section .groups");
const whoPassGroupStage = {
	1: [],
	2: []
};

let eliminations = [];

let flags = {};

window.onload = async () => {
	await getCountries();
	renderGroupStage();
	verifyNextPhaseAction();
	activeMenu();
};

async function getCountries() {
	await fetch(baseURL)
		.then(data => data.json())
		.then(res => (flags = res))
		.catch(err => console.error(err));
}

function renderGroupStage() {
	const groupLetters = Object.keys(groups);
	const groupCountries = Object.values(groups);

	groupCountries.forEach((countries, index) => {
		const group = document.createElement("div");
		group.classList.add("group");

		if (index > 0) {
			group.classList.add("disabled");
		}

		group.innerHTML += `<h1>Group ${groupLetters[index]}</h1>`;

		countries.forEach(country => {
			group.innerHTML += `
			
				<div class="country" onclick="selectCountry('${country}', 2)">
					<div class="country-flag" style="background: #fff url(${baseCDN}/${country}) center center; background-size: cover;"></div>
				
					<p class="country-name">
						${flags[country.toLowerCase()]} 
					</p>
				</div>
			
			`;
		});

		groupsContainer.appendChild(group);
	});
}

function renderEliminationPhase(
	firstPlaceConfrontation,
	secondPlaceConfrontation
) {
	let id = 0;

	firstPlaceConfrontation.forEach((order, index) => {
		let firstPlaces = Object.values(whoPassGroupStage)[0];
		let secondPlaces = Object.values(whoPassGroupStage)[1];
		const group = document.createElement("div");

		if (currentStage !== STAGES[1]) {
			firstPlaces = secondPlaces = eliminations;
		}

		group.classList.add("group");

		if (index > 0) {
			group.classList.add("disabled");
		}

		group.innerHTML += `
			
			<div class="country" onclick="selectCountry('${
				firstPlaces[order]
			}', 1)" data-id="${id}">
				<div class="country-flag" style="background: #fff url(${baseCDN}/${
			firstPlaces[order]
		}) center center; background-size: cover;"></div>
			
				<p class="country-name">
					${flags[firstPlaces[order].toLowerCase()]} 
				</p>
			</div>
			
			<p class="versus-text">VS.</p>

			<div class="country" onclick="selectCountry('${
				secondPlaces[secondPlaceConfrontation[index]]
			}', 1)" data-id="${id}">
				<div class="country-flag" style="background: #fff url(${baseCDN}/${
			secondPlaces[secondPlaceConfrontation[index]]
		}) center center; background-size: cover;"></div>
			
				<p class="country-name">
					${flags[secondPlaces[secondPlaceConfrontation[index]].toLowerCase()]} 
				</p>
			</div>
		`;

		id++;

		groupsContainer.appendChild(group);
	});
}

function renderChampion() {
	const champion = eliminations[0];

	document.querySelector(".title").innerHTML = "The Champion Is...";

	groupsContainer.innerHTML = `
	
		<div class="champion-container">
			<h1 class="champion-name">${flags[champion.toLowerCase()]}!!!!</h1>
			<div class="champion-flag-trophy">
				<img src="${baseCDN}/${champion}" alt="${
		flags[champion.toLowerCase()]
	}" class="champion-flag">
				<img src="./assets/images/fifa-world-cup-trophy-2022.svg" alt="Trophy Cup">
			</div>
			<h1 class="champion-name">CONGRATULATIONS!!</h1>
		</div>
	
	`;
}

function selectCountry(country, limitCountriesCanBeSelected) {
	const countrySelected = event.target;
	let countCountriesHasBeenSelected =
		countrySelected.parentNode.querySelectorAll(".country.selected").length;

	if (countCountriesHasBeenSelected < limitCountriesCanBeSelected) {
		if (!countrySelected.classList.contains("selected")) {
			const nextGroup = countrySelected.parentNode.nextSibling;
			const place = ++countCountriesHasBeenSelected;
			countrySelected.classList.add("selected");

			if (nextGroup) {
				nextGroup.classList.remove("disabled");
			}

			if (currentStage === STAGES[0]) {
				countrySelected.querySelector(
					"p.country-name"
				).innerHTML += ` - ${place}º Place`;

				whoPassGroupStage[place].push(country);
			} else {
				const countryGroup =
					countrySelected.parentNode.querySelectorAll(".country");

				countryGroup.forEach(country => {
					if (!country.classList.contains("selected")) {
						country.classList.add("defeated");
					}
				});

				eliminations[countrySelected.dataset.id] = country;
			}

			verifyNextPhaseAction();
		}
	}
}

function activeMenu() {
	const ancientLinkActive = document.querySelector('main .stages li.active');
	const activeLink = document.getElementById(`${currentStage}`);

	ancientLinkActive.classList.remove("active");
	activeLink.classList.add("active");
}

function verifyNextPhaseAction() {
	let goToNextPhase = false;

	if (currentStage === STAGES[0]) {
		const COUNTRIES_PASS_LIMIT = 8;

		goToNextPhase =
			Object.values(whoPassGroupStage)[0].length === COUNTRIES_PASS_LIMIT &&
			Object.values(whoPassGroupStage)[1].length === COUNTRIES_PASS_LIMIT;
	} else {
		const countGroups = document.querySelectorAll(".group").length;
		const countCountriesSelected = document.querySelectorAll(
			".group .country.selected"
		).length;

		goToNextPhase = countCountriesSelected >= countGroups
	}

	if (goToNextPhase) {
		nextPhase(++stage);
	}
}

function nextPhase(newStage) {
	currentStage = STAGES[newStage];
	groupsContainer.innerHTML = "";

	if (currentStage) {
		activeMenu();

		if (currentStage !== STAGES[0]) {
			renderEliminationPhase(
				confrontations[currentStage][0],
				confrontations[currentStage][1]
			);

			groupsContainer.scroll({
				left: -10000,
				top: 0,
				behavior: "smooth"
			});
		}
	} else {
		renderChampion();
	}
}
