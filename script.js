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
    {id: "p11", name: "creamyspot", link: "https://mega.nz/folder/FQtBHIoA#bMNIVyAAPrtlnorDC0JeJA", img: "https://i.imgur.com/gI0CfNC.jpeg"},
    {id: "p12", name: "gabbyblessings", link: "https://mega.nz/folder/uCxzFRgJ#Opwp5C5UzHMzmmtz_c2q5A", img: "https://i.imgur.com/9MafsCv.png"}
];

const container = document.getElementById('container');
const searchInput = document.getElementById('searchInput');
const menuToggle = document.getElementById('menuToggle');
const dropdownMenu = document.getElementById('dropdownMenu');
const favToggle = document.getElementById('favToggle');

// Speicher für Favoriten-IDs aus dem Browser laden
let favorites = JSON.parse(localStorage.getItem('modelFavorites')) || [];
// Zustand des Toggles laden
let showFavsOnTop = JSON.parse(localStorage.getItem('showFavsOnTop')) || false;

// Setze den Schalter beim Start auf den gespeicherten Wert
if (favToggle) {
    favToggle.checked = showFavsOnTop;
}

// 2-Striche-Menü öffnen/schließen beim Drücken
if (menuToggle && dropdownMenu) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
    });

    // Schließen, wenn man irgendwo anders hinklickt
    document.addEventListener('click', () => {
        dropdownMenu.classList.remove('show');
    });
    
    dropdownMenu.addEventListener('click', (e) => {
        e.stopPropagation(); // Verhindert Schließen beim Klicken im Menü
    });
}

// Wenn man den Toggle umschaltet
if (favToggle) {
    favToggle.addEventListener('change', (e) => {
        showFavsOnTop = e.target.checked;
        localStorage.setItem('showFavsOnTop', JSON.stringify(showFavsOnTop));
        applyFilterAndSort(); // Liste sofort neu ordnen!
    });
}

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

function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('modelFavorites', JSON.stringify(favorites));
    applyFilterAndSort(); // Karten aktualisieren
}

function renderCards(data) {
    if (!container) return;
    container.innerHTML = '';
    
    data.forEach(item => {
        const isFav = favorites.includes(item.id);
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <span class="fav-star ${isFav ? 'active' : ''}" data-id="${item.id}">★</span>
            <img src="${item.img}">
            <h3>${item.name}</h3>
            <a href="${item.link}" target="_blank" class="btn">Öffnen</a>
        `;
        
        // Stern-Klick-Event verknüpfen
        const star = card.querySelector('.fav-star');
        star.addEventListener('click', (e) => {
            e.preventDefault();
            toggleFavorite(item.id);
        });
        
        container.appendChild(card);
    });
}

function applyFilterAndSort() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    let currentList = [...initialData];

    // 1. Falls gesucht wird, filtern
    if (query !== '') {
        const scoredData = initialData.map(item => {
            const name = item.name.toLowerCase();
            let score = 0;
            if (name.includes(query)) {
                score = 100;
            } else {
                const distance = getEditDistance(query, name);
                score = 100 - (distance * 15);
            }
            return { item, score };
        });

        currentList = scoredData
            .filter(entry => entry.score > 45)
            .sort((a, b) => b.score - a.score)
            .map(entry => entry.item);
    }

    // 2. Falls der Favoriten-Toggle aktiv ist, Favoriten ganz nach oben sortieren
    if (showFavsOnTop) {
        currentList.sort((a, b) => {
            const aIsFav = favorites.includes(a.id) ? 1 : 0;
            const bIsFav = favorites.includes(b.id) ? 1 : 0;
            return bIsFav - aIsFav; // Favoriten (1) kommen vor Nicht-Favoriten (0)
        });
    }

    renderCards(currentList);
}

if (searchInput) {
    searchInput.addEventListener('input', applyFilterAndSort);
}

// Erstmaliger Start beim Laden der Seite
applyFilterAndSort();
