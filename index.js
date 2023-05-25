const divPlayers = document.querySelector(".playerList");
const divTeam = document.querySelector(".teamList");
const btnPlayer = document.getElementById("submitPlayer");
const btnTeam = document.getElementById("submitTeam");
const inputPlayer = document.getElementById("inputPlayer");
const inputTeam = document.getElementById("inputTeam");

btnPlayer.addEventListener('click', addPlayer);
btnTeam.addEventListener('click', addTeam);

let teamsSort = [];

function addPlayer(e) {
    e.preventDefault();
    validateFormPlayer();
}

function addTeam(e) {
    e.preventDefault();
    validateFormTeam();
}

// VALIDATE IF THE INPUT VALUE ISN'T ""/FALSE
function validateFormPlayer() {
    const player = inputPlayer.value;
    const id = new Date().getTime().toString();
    const team = "";
    if (player) {
        createPlayer(id, player, team);
        addPlayersLocalStorage(id, player, team);
        clearInputPlayer();
    }
}
// VALIDATE IF THE INPUT VALUE ISN'T ""/FALSE
function validateFormTeam() {
    const team = inputTeam.value;
    const id = new Date().getTime().toString();
    const state = false;
    if (team) {
        createTeam(id, team, state);
        addTeamsLocalStorage(id, team, state);
        clearInputTeam();
    }
}

// FUNCTION TO CREATE A PLayer WHEN ADDED
function createPlayer(id, player, team) {
    const playersList = document.createElement("div");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    playersList.setAttributeNode(attr);
    playersList.classList.add("player");
    playersList.innerHTML = `
    <p>${player}</p><div><button class='clearBtn'><i class="fas fa-trash"></i></button></div>`
    const btnDeletePlayer = playersList.querySelector(".clearBtn");
    btnDeletePlayer.addEventListener('click', deletePlayer);
    divPlayers.appendChild(playersList);
}

// FUNCTION TO CREATE A Team WHEN ADDED
function createTeam(id, team) {
    const teamsList = document.createElement("div");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    teamsList.setAttributeNode(attr);
    teamsList.classList.add("team");
    teamsList.innerHTML = `
    <p>${team}</p><div><button class='clearBtn'><i class="fas fa-trash"></i></button></div>`
    const btnDeleteTeam = teamsList.querySelector(".clearBtn");
    btnDeleteTeam.addEventListener('click', deleteTeam);
    divTeam.appendChild(teamsList);
}

function deletePlayer(e) {
    const el = e.currentTarget.parentElement.parentElement;
    const id = el.dataset.id;

    divPlayers.removeChild(el);

    removePlayersFromLocalStorage(id)
}

function deleteTeam(e) {
    const el = e.currentTarget.parentElement.parentElement;
    const id = el.dataset.id;

    divTeam.removeChild(el);

    removeTeamsFromLocalStorage(id)
}

function clearInputPlayer() {
    inputPlayer.value = "";
}

function clearInputTeam() {
    inputTeam.value = "";
}

// FUNCTIONS TO ADD, GET, REMOVE AND SETUP ITEMS ON LOCALSTORAGE
function addPlayersLocalStorage(id, player, team) {
    const playerList = { id, player, team };
    let players = getPlayersLocalStorage();
    players.push(playerList);
    localStorage.setItem("players", JSON.stringify(players));
}

function addTeamsLocalStorage(id, team, state) {
    const teamList = { id, team, state };
    let teams = getTeamsLocalStorage();
    teams.push(teamList);
    localStorage.setItem("teams", JSON.stringify(teams));
}

function getPlayersLocalStorage() {
    return localStorage.getItem("players") ? JSON.parse(localStorage.getItem("players")) : [];
}

function getTeamsLocalStorage() {
    return localStorage.getItem("teams") ? JSON.parse(localStorage.getItem("teams")) : [];
}

function removePlayersFromLocalStorage(id) {
    let players = getPlayersLocalStorage();

    players = players.filter(function (player) {
        if (player.id !== id) {
            return player;
        }
    });

    localStorage.setItem("players", JSON.stringify(players));
}

function removeTeamsFromLocalStorage(id) {
    let teams = getTeamsLocalStorage();

    teams = teams.filter(function (team) {
        if (team.id !== id) {
            return team;
        }
    });

    localStorage.setItem("teams", JSON.stringify(teams));
}

function setupPlayers() {
    let players = getPlayersLocalStorage();

    if (players.length > 0) {
        players.forEach((player) => {
            createPlayer(player.id, player.player, player.team);
        });
    }
}

function setupTeams() {
    let teams = getTeamsLocalStorage();

    if (teams.length > 0) {
        teams.forEach((team) => {
            createTeam(team.id, team.team, team.state);
        });
    }
}

function sortearTime(availableTeams) {
    const maxTimes = availableTeams.length;

    if (maxTimes === 0) {
        return null;
    }

    const timeSorteado = availableTeams[Math.floor(Math.random() * maxTimes)];
    teamsSort.push(timeSorteado);
    return timeSorteado;
}


function sorteio() {
    const players = getPlayersLocalStorage();
    let teams = getTeamsLocalStorage();
    teamsSort = [];

    // Resetar os estados dos times para false
    teams = teams.map(team => {
        team.state = false;
        return team;
    });

    for (let i = 0; i < players.length; i++) {
        let availableTeams = teams.filter(team => !team.state);

        if (availableTeams.length === 0) {
            console.log("Todos os times já foram sorteados!");
            return;
        }

        let timeAtual = sortearTime(availableTeams);

        players[i].team = timeAtual.team;
        timeAtual.state = true;
        updateTeamsInLocalStorage(teams);
    }

    updatePlayersInLocalStorage(players);
    renderizarSorteio();
    console.log(players);
}

function updatePlayersInLocalStorage(players) {
    localStorage.setItem("players", JSON.stringify(players));
}

function updateTeamsInLocalStorage(teams) {
    localStorage.setItem("teams", JSON.stringify(teams));
}

function renderizarSorteio() {
    const containerSorteio = document.querySelector(".container-sorteio");
    containerSorteio.innerHTML = ""; // Limpar o conteúdo atual

    const players = getPlayersLocalStorage();

    players.forEach((player) => {
        const playerElement = document.createElement("div");
        playerElement.classList.add("player-item");
        playerElement.innerHTML = `
        <p>${player.player}</p>
        <p>Time: ${player.team}</p>
        `;
        containerSorteio.appendChild(playerElement);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupPlayers();
    setupTeams();
    renderizarSorteio();
})