const initialData = [
    {name: "annaplusone", link: "https://mega.nz/folder/m0Jw2DhA#Jv9qh5hRprdYVsuvXJBbkQ", img: "https://i.imgur.com/w1Iz6nB.jpeg"},
    {name: "cheekymz", link: "https://mega.nz/folder/WFlmiLaS#baeU7J8RoJK175BXNu7K3Q", img: "https://i.imgur.com/wuBA3bh.jpeg"}
    // Hier kannst du weitere Karten hinzufügen...
];

const container = document.getElementById('container');
initialData.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="${item.img}">
        <h3>${item.name}</h3>
        <a href="${item.link}" target="_blank" class="btn">Öffnen</a>
    `;
    container.appendChild(card);
});
