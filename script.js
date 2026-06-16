let initialData = [
    {id: "p1", name: "annaplusone", link: "https://mega.nz/folder/m0Jw2DhA#Jv9qh5hRprdYVsuvXJBbkQ", img: "https://i.imgur.com/w1Iz6nB.jpeg"},
    {id: "p2", name: "cheekymz", link: "https://mega.nz/folder/WFlmiLaS#baeU7J8RoJK175BXNu7K3Q", img: "https://i.imgur.com/wuBA3bh.jpeg"}
];

let data = JSON.parse(localStorage.getItem('myEntries'));
if (!data || data.length === 0) {
    data = initialData;
    localStorage.setItem('myEntries', JSON.stringify(data));
}

function render() {
    const container = document.getElementById('container');
    container.innerHTML = '';
    data.sort((a, b) => (localStorage.getItem(a.id + '_clicks') || 0) < (localStorage.getItem(b.id + '_clicks') || 0) ? 1 : -1);

    data.forEach(item => {
        const clicks = localStorage.getItem(item.id + '_clicks') || 0;
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <button class="delete-btn" onclick="deleteEntry('${item.id}')">X</button>
            <img src="${item.img}" alt="${item.name}" onclick="openLightbox('${item.img}')">
            <h3>${item.name}</h3>
            <p>Aufrufe: ${clicks}</p>
            <a href="${item.link}" target="_blank" class="btn" onclick="addClick('${item.id}')">Öffnen</a>
        `;
        container.appendChild(card);
    });

    const addCard = document.createElement('div');
    addCard.className = 'add-card';
    addCard.innerHTML = `<div class="plus-icon">+</div><p>Neu hinzufügen</p>`;
    addCard.onclick = toggleMenu;
    container.appendChild(addCard);
}

function openLightbox(imgSrc) {
    document.getElementById('lightbox-img').src = imgSrc;
    document.getElementById('lightbox').style.display = 'flex';
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

function toggleMenu() {
    const menu = document.getElementById('admin-menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function addEntry() {
    const name = document.getElementById('name').value;
    const link = document.getElementById('link').value;
    const img = document.getElementById('img').value;
    if(name && link && img) {
        const newId = 'p' + Date.now();
        data.push({id: newId, name, link, img});
        localStorage.setItem('myEntries', JSON.stringify(data));
        render();
        toggleMenu();
    }
}

function deleteEntry(id) {
    if(confirm("Wirklich löschen?")) {
        data = data.filter(item => item.id !== id);
        localStorage.setItem('myEntries', JSON.stringify(data));
        localStorage.removeItem(id + '_clicks');
        render();
    }
}

function addClick(id) {
    let count = parseInt(localStorage.getItem(id + '_clicks') || 0);
    localStorage.setItem(id + '_clicks', count + 1);
    setTimeout(render, 100);
}

render();
