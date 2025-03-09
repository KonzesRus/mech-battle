const tg = window.Telegram.WebApp;
tg.ready();

let playerId = tg.initDataUnsafe.user.id;
let playerMechs = [];
let gameStarted = false;

function updateStatus(message) {
    document.getElementById('game-status').innerText = message;
}

function renderMechs() {
    const mechsDiv = document.getElementById('mechs');
    mechsDiv.innerHTML = playerMechs.map(mech => 
        `<div>${mech.name}: HP ${mech.hp}, ${mech.position} ${mech.is_alive ? '' : '(Уничтожен)'}</div>`
    ).join('');
}

document.getElementById('join-btn').addEventListener('click', () => {
    tg.sendData(JSON.stringify({ command: 'join', player_id: playerId }));
});

document.getElementById('attack-btn').addEventListener('click', () => {
    const attacker = prompt('Введите имя вашего меха:');
    const target = prompt('Введите имя цели:');
    if (attacker && target) {
        tg.sendData(JSON.stringify({ command: 'attack', attacker, target, player_id: playerId }));
    }
});

tg.onEvent('web_app_data', (event) => {
    const data = JSON.parse(event.data);
    if (data.status === 'joined') {
        playerMechs = data.mechs;
        gameStarted = true;
        document.getElementById('join-btn').disabled = true;
        document.getElementById('attack-btn').disabled = false;
        updateStatus('Вы присоединились к игре!');
        renderMechs();
    } else if (data.status === 'attack_result') {
        updateStatus(data.message);
        playerMechs = data.player_mechs;
        renderMechs();
    } else if (data.status === 'game_over') {
        updateStatus(data.message);
        document.getElementById('attack-btn').disabled = true;
    }
});

updateStatus('Нажмите "Присоединиться", чтобы начать!');