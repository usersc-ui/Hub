const initialData = [
    {id: "p1", name: "annaplusone", link: "https://mega.nz/folder/m0Jw2DhA#Jv9qh5hRprdYVsuvXJBbkQ", img: "https://i.imgur.com/w1Iz6nB.jpeg"},
    {id: "p2", name: "cheekymz", link: "https://mega.nz/folder/WFlmiLaS#baeU7J8RoJK175BXNu7K3Q", img: "https://i.imgur.com/wuBA3bh.jpeg"},
    {id: "p3", name: "UrFavBellaBby", link: "https://mega.nz/folder/QjEGkKgY#B1xbO-2J95onN_qosU7DWw", img: "https://i.imgur.com/TYdDLj0.jpeg"},
    {id: "p4", name: "alina_rose", link: "https://mega.nz/folder/WQlFBbgS#5Make9tPNyO6Ta7htdd4yfg", img: "https://i.imgur.com/6aEoOaa.jpeg"},
    {id: "p5", name: "brattygappy", link: "https://mega.nz/folder/g7kgWT7Y#ICDXShb9sBrjbggO8fF3JQ", img: "https://i.imgur.com/MwkX4qc.jpeg"},
    {id: "p6", name: "aaliyah yasin", link: "https://mega.nz/folder/xUFARK7B#mCvpc18rJYr171vOA9TKvg", img: "https://i.imgur.com/blV0wEK.jpeg"},
    {id: "p7", name: "annywalker", link: "https://mega.nz/folder/q9A1VQLQ#7MHvNUDfDEgkEB_CARrEJQ", img: "https://i.imgur.com/KG9wrc2.jpeg"},
    {id: "p8", name: "lexi marvel", link: "https://mega.nz/folder/bZM2VRAK#6wBv39rbrItW8YOdYMtjVQ", img: "https://i.imgur.com/XyFJ2Du.jpeg"},
    {id: "p9", name: "Comatozze", link: "https://mega.nz/folder/hywlGJDY#dDp9Q3NFv_9cDkroIRlL4Q", img: "https://i.imgur.com/XZyrg68.jpeg"},
    {id: "p10", name: "ambergianna", link: "https://mega.nz/folder/OFljlCQa#Euxx9eB5S5uhDDPOCjNEOw", img: "https://i.imgur.com/7goIJ8U.jpeg"},
    {id: "p11", name: "creamyspot", link: "https://mega.nz/folder/FQtBHIoA#bMNIVyAAPrtinorDC0JeJA", img: "https://i.imgur.com/gI0CfNC.jpeg"},
    {id: "p12", name: "gabbyblessings", link: "https://mega.nz/folder/uCxzFRgJ#Opwp5C5UzHMzmmtz_c2q5A", img: "https://i.imgur.com/9MafsCv.png"}
];

const container = document.querySelector('.grid') || document.getElementById('container');
const searchInput = document.getElementById('searchInput');
const historyContainer = document.getElementById('searchHistory');

let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

function getEditDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

function renderCards(data) {
    if (!container) return;
    container.innerHTML = '';
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.img}">
            <h3>${item.name}</h3>
            <a href="${item.link}" target="_blank" class="btn">Öffnen</a>
        `;
        container.appendChild(card);
    });
}

function renderHistory() {
    if (!historyContainer) return;
    historyContainer.innerHTML = '';
    
    searchHistory.slice(-5).reverse().forEach(term => {
        const tag = document.createElement('span');
        tag.className = 'history-tag';
        tag.textContent = term;
        tag.addEventListener('click', () => {
            if (searchInput) searchInput.value = term;
            filterModels(term);
        });
        historyContainer.appendChild(tag);
    });
}

function filterModels(query) {
    const cleanQuery = query.toLowerCase().trim();
    
    if (cleanQuery === '') {
        renderCards(initialData);
        return;
    }

    const scoredData = initialData.map(item => {
        const name = item.name.toLowerCase();
        let score = 0;

        if (name.includes(cleanQuery)) {
            score = 100;
        } else {
            const distance = getEditDistance(cleanQuery, name);
            score = 100 - (distance * 15);
        }

        return { item, score };
    });

    const filtered = scoredData
        .filter(entry => entry.score > 45)
        .sort((a, b) => b.score - a.score)
        .map(entry => entry.item);

    renderCards(filtered);
}

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        filterModels(e.target.value);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const value = searchInput.value.trim();
            if (value && !searchHistory.includes(value)) {
                searchHistory.push(value);
                localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
                renderHistory();
            }
        }
    });
}

// Sofort beim Laden starten
renderCards(initialData);
renderHistory();
