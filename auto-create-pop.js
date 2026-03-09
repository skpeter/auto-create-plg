function FindReact(dom, traverseUp = 0) { //https://stackoverflow.com/a/39165137
    const key = Object.keys(dom).find(key=>{
        return key.startsWith("__reactFiber$") // react 17+
            || key.startsWith("__reactInternalInstance$"); // react <17
    });
    const domFiber = dom[key];
    if (domFiber == null) return null;

    // react <16
    if (domFiber._currentElement) {
        let compFiber = domFiber._currentElement._owner;
        for (let i = 0; i < traverseUp; i++) {
            compFiber = compFiber._currentElement._owner;
        }
        return compFiber._instance;
    }

    // react 16+
    const GetCompFiber = fiber=>{
        //return fiber._debugOwner; // this also works, but is __DEV__ only
        let parentFiber = fiber.return;
        while (typeof parentFiber.type == "string") {
            parentFiber = parentFiber.return;
        }
        return parentFiber;
    };
    let compFiber = GetCompFiber(domFiber);
    for (let i = 0; i < traverseUp; i++) {
        compFiber = GetCompFiber(compFiber);
    }
    return compFiber.stateNode;
}


function waitForElm(selector) { // https://stackoverflow.com/a/61511955
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

fetch('https://momentjs.com/downloads/moment.min.js')
    .then(response => response.text())
    .then(text => eval(text))
    .then(() => { 


let d = new Date(); // https://stackoverflow.com/a/33078673
d.setDate(d.getDate() + (((5 + 7 - d.getDay()) % 7) || 7)); // get next friday. will return the following friday even if its currently a friday
// d.setDate(d.getDate() + (((d.getDay()) - 5 % 7))); // uncomment this if you want to return the current date if already a friday 

var startAt = moment(d).set("hour", 19).set("minute", 0).set("second", 0); //7pm
var endAt = moment(d).set("hour", 23).set("minute", 0).set("second", 0); //11pm

var startofStation = moment("24-08-2022", "DD-MM-YYYY");
var numOfStation = Math.floor(moment.duration(startAt.diff(startofStation)).asWeeks() / 2); //biweekly
numOfStation -= 71; //offset

const isEven = num => num % 2 === 0; // lol
var sidegame = isEven(numOfStation) ? "Ultimate + RoA 2" : "Ultimate + Slap City"

FindReact(document.querySelectorAll('[name="name"]')[0].parentElement.parentElement.parentElement).changeValue("Smash Station #" + numOfStation)

inputFields = document.getElementsByClassName("mui-dzz0xc"); // this sucks

// FindReact(inputFields[0].children[0]).changeValue("discord");
// FindReact(inputFields[1].children[0]).changeValue("https://discord.gg/4sP2weDDHm");
// campsmash não tem discord pois se trata de uma organização profissional

FindReact(inputFields[2].children[0]).changeValue(startAt);
FindReact(inputFields[3].children[0]).changeValue(endAt);

document.getElementsByClassName("copySection-sgg-6rfu")[0].children[0].children[0].click(); // this sucks

waitForElm('.Select--single:not(.is-loading)').then((elm) => {
	var prevTournaments = document.getElementsByClassName("Select--single")[0]; // this sucks
	var options = FindReact(prevTournaments).props.options;
	var prevEventWithSameSidegame = options.find(o => o.label.match("Station #" + (numOfStation - 4)));
	
	FindReact(prevTournaments).setValue(prevEventWithSameSidegame);
	
	document.querySelectorAll('[name="startAt"]')[0].value = startAt.format("MM/DD/yyyy hh:mm a"); // this is because while setting it works, it doesn't seem to update the actual input field in the react component so this fixes that (at least until the react component refresh and then it will disappear again sadly)
	document.querySelectorAll('[name="startAt"]')[0].required = false; // even after its disappeared its technically still in the input and it will submit successfully. removing the 'required' flag allows us to submit the form without the browser stopping us
	document.querySelectorAll('[name="endAt"]')[0].value = endAt.format("MM/DD/yyyy hh:mm a");	
	document.querySelectorAll('[name="endAt"]')[0].required = false;
});

waitForElm('.tournamentAdminProfile').then((elm) => {
	fetch("https://www.start.gg/api/-/gql", {
		"headers": {
			"client-version": "20"
		},
		"body": `
		[
			{
				"operationName":"TournamentPageHead",
				"variables":{
					"slug":"${window.location.href.split("https://www.start.gg/admin/tournament/")[1].split("/")[0]}"
				},
				"query":"query TournamentPageHead($slug: String!) { tournament(slug: $slug) { ...tournamentPageHead } } fragment tournamentPageHead on Tournament { id }"
			}
		]`,
		"method": "POST",
		"mode": "cors"
	}).then(response => response.json()).then((json) => {
		fetch("https://www.start.gg/api/-/gql", {
			"headers": {
				"client-version": "20"
			},
			"body": `
			[
				{
					"operationName":"UpdateBasicDetailsTournament",
					"variables":{
						"tournamentId":${json[0].data.tournament.id},
						"fields":{
							"shortSlug":"campinas"
						},
						"validationKey":"updateTournament"
					},
					"query": "mutation UpdateBasicDetailsTournament($tournamentId: ID!, $fields: UpdateBasicFieldsTournament!) { updateBasicFieldsTournament(tournamentId: $tournamentId, fields: $fields) {id ...detailsSettings } } fragment detailsSettings on Tournament { shortSlug }"
				}
			]`,
			"method": "POST",
			"mode": "cors"
		});
	});
});

console.log(`
__**Smash Station #${numOfStation}**__

Mais um Smash Station se aproxima! Dessa vez teremos torneios de ${sidegame}, além de freeplay gratuito.

QUANDO: ${startAt.format("dddd, MMMM Do")} (<t:${startAt.unix()}:R>!), estaremos no local às 19h, campeonato começa às 19h30
ONDE: Muito Colecionáveis, Av. Brasil, 1456, Campinas - SP
VALOR: $10, pague no local, caso seja seu primeiro torneio, a entrada é gratuita.

Traga seu console e/ou controle - teremos controles disponíveis para alugar, caso necessário!

Inscrições:
https://start.gg/campinas
`);

		
})
