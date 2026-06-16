let initialData = [
    {id: "p1", name: "annaplusone", link: "https://mega.nz/folder/m0Jw2DhA#Jv9qh5hRprdYVsuvXJBbkQ", img: "https://i.imgur.com/w1Iz6nB.jpeg"},
    {id: "p2", name: "cheekymz", link: "https://mega.nz/folder/WFlmiLaS#baeU7J8RoJK175BXNu7K3Q", img: "https://i.imgur.com/wuBA3bh.jpeg"},
    {id: "p3", name: "UrFavBellaBby", link: "https://mega.nz/folder/QjEGkKgY#B1xbO-2J95onN_qosU7DWw", img: "https://i.imgur.com/TYdDLj0.jpeg"},
    {id: "p4", name: "alina_rose", link: "https://mega.nz/folder/WQlFBbgS#5Mak9tPNyO6Ta7htdd4yfg", img: "https://i.imgur.com/6aEoOaa.jpeg"},
    {id: "p5", name: "brattygappy", link: "https://mega.nz/folder/g7kgWT7Y#ICDXShb9sBrjbggO8fF3JQ", img: "https://i.imgur.com/MwkX4qc.jpeg"},
    {id: "p6", name: "aaliyah yasin", link: "https://mega.nz/folder/xUFARK7B#mCvpc18rJYr171vOA9TKvg", img: "https://i.imgur.com/blV0wEK.jpeg"},
    {id: "p7", name: "annywalker", link: "https://mega.nz/folder/q9A1VQLQ#7MHvNUDfDEgkEB_CARrEJQ", img: "https://i.imgur.com/KG9wrc2.jpeg"},
    {id: "p8", name: "lexi marvel", link: "https://mega.nz/folder/bZM2VRAK#6wBv39rbrItW8YOdYMtjVQ", img: "https://i.imgur.com/XyFJ2Du.jpeg"},
    {id: "p9", name: "Comatozze", link: "https://mega.nz/folder/hywlGJDY#dDp9Q3NFv_9cDkroIRlL4Q", img: "https://i.imgur.com/XZyrg68.jpeg"},
    {id: "p10", name: "ambergianna", link: "https://mega.nz/folder/OFljlCQa#Euxx9eB5S5uhDDPOCjNEOw", img: "https://i.imgur.com/7goIJ8U.jpeg"}
];

// Lade Daten aus dem Speicher (mit v11 ID, um alten Cache zu erzwingen)
let data = JSON.parse(localStorage.getItem('myEntries_v11'));

// Falls keine Daten da sind oder die Liste zu kurz ist: Überschreibe mit initialData
if (!data || data.length < 10) {
    data = initialData;
    localStorage.setItem('myEntries_v11', JSON.stringify(data));
}

function render() {
    const container = document.getElementById('container');
    container.innerHTML = '';

    // Sortierung: Karte mit den meisten Aufrufen nach oben
    data.sort((a, b) => {
        let clicksA = parseInt(localStorage.getItem(a.id + '_c') || 0);
        let clicksB = parseInt(localStorage.getItem(b.id + '_c') || 0);
        return clicksB - clicksA;
    });

    data.forEach(item => {
        const clicks = localStorage.getItem(item.id + '_c') || 0;
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <button class="delete-btn" onclick="deleteEntry('${item.id}')">X</button>
            <img src="${item.img}" onclick="openLightbox('${item.img}')">
            <h3>${item.name}</h3>
            <p>Aufrufe: ${clicks}</p>
            <a href="${item.link}" target="_blank" class="btn" onclick="addClick('${item.id}')">Öffnen</a>
        `;
        container.appendChild(card);
    });

    const addCard = document.createElement('div');
    addCard.className = 'add-card';
    addCard.innerHTML = `<h3>+ Neu hinzufügen</h3>`;
    addCard.onclick = toggleMenu;
    container.appendChild(addCard);
}

function addClick(id) {
    let count = parseInt(localStorage.getItem(id + '_c') || 0);
    localStorage.setItem(id + '_c', count + 1);
    // Render neu aufrufen, damit sich die Reihenfolge sofort aktualisiert
    render();
}

function deleteEntry(id) {
    if(confirm("Wirklich löschen?")) {
        data = data.filter(item => item.id !== id);
        localStorage.setItem('myEntries_v11', JSON.stringify(data));
        render();
    }
}

function toggleMenu() { 
    let menu = document.getElementById('admin-menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block'; 
}

function openLightbox(src) { 
    document.getElementById('lightbox-img').src = src; 
    document.getElementById('lightbox').style.display = 'flex'; 
}

function closeLightbox() { 
    document.getElementById('lightbox').style.display = 'none'; 
}

function addEntry() {
    const name = document.getElementById('name').value;
    const link = document.getElementById('link').value;
    const img = document.getElementById('img').value;
    if(name && link && img) {
        data.push({id: 'p'+Date.now(), name, link, img});
        localStorage.setItem('myEntries_v11', JSON.stringify(data));
        render(); 
        toggleMenu();
        // Input Felder leeren
        document.getElementById('name').value = '';
        document.getElementById('link').value = '';
        document.getElementById('img').value = '';
    }
}

// Initialer Aufruf
render();
