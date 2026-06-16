let initialData = [
    {id: "p1", name: "annaplusone", link: "https://mega.nz/folder/m0Jw2DhA#Jv9qh5hRprdYVsuvXJBbkQ", img: "https://i.imgur.com/w1Iz6nB.jpeg"},
    {id: "p2", name: "cheekymz", link: "https://mega.nz/folder/WFlmiLaS#baeU7J8RoJK175BXNu7K3Q", img: "https://i.imgur.com/wuBA3bh.jpeg"}
];

let data = JSON.parse(localStorage.getItem('myEntries_v8')) || initialData;

function render() {
    const container = document.getElementById('container');
    container.innerHTML = '';
    
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
    setTimeout(render, 100);
}

function deleteEntry(id) {
    data = data.filter(item => item.id !== id);
    localStorage.setItem('myEntries_v8', JSON.stringify(data));
    render();
}

function toggleMenu() { document.getElementById('admin-menu').style.display = 'block'; }
function openLightbox(src) { document.getElementById('lightbox-img').src = src; document.getElementById('lightbox').style.display = 'flex'; }
function closeLightbox() { document.getElementById('lightbox').style.display = 'none'; }
render();
