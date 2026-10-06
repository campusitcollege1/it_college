// --- РОБОТА З ГОЛОВНОЮ СТОРІНКОЮ ТА ТОВАРАМИ ---

// Початкові дефолтні речі (якщо localStorage порожній)
const defaultItems = [
    { id: 1, title: "Подовжувач на 3 метри", room: "Кімната 312 (3 поверх)", price: "Безкоштовно на день", icon: "🔌", category: "sharing" },
    { id: 2, title: "Сукня на студентську вечірку (S)", room: "Кімната 504 (5 поверх)", price: "Шоколадка за оренду", icon: "👗", category: "sharing" },
    { id: 3, title: "Підручник з вищої математики", room: "Кімната 201 (2 поверх)", price: "100 грн (Продаж)", icon: "📚", category: "sale" }
];

// Отримати речі з localStorage або записати дефолтні
function getItems() {
    let items = localStorage.getItem('dormItems');
    if (!items) {
        localStorage.setItem('dormItems', JSON.stringify(defaultItems));
        return defaultItems;
    }
    return JSON.parse(items);
}

// Зберегти речі
function saveItems(items) {
    localStorage.setItem('dormItems', JSON.stringify(items));
}

// Рендеринг карток на головній сторінці (index.html)
function renderItems() {
    const grid = document.getElementById('items-grid');
    if (!grid) return; // Якщо це не головна сторінка, виходимо

    const items = getItems();
    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = '<p style="color: #777; grid-column: 1/-1; text-align: center;">Поки що немає жодних оголошень у гуртожитку.</p>';
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.style.cssText = "background: var(--card-bg); border-radius: 15px; padding: 15px; border: 1px solid var(--border-color); box-shadow: 0 4px 10px rgba(0,0,0,0.03); display: flex; flex-direction: column; justify-content: space-between;";
        
        card.innerHTML = `
            <div>
                <div style="height: 140px; background: #ffd1dc; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 40px;">${item.icon || '📦'}</div>
                <h3 style="margin: 15px 0 5px; font-size: 18px;">${item.title}</h3>
                <p style="font-size: 13px; color: #777; margin-bottom: 5px;">📍 ${item.room}</p>
                <p style="font-size: 14px; font-weight: bold; color: var(--accent-purple);">💰 ${item.price}</p>
            </div>
            <button class="btn-pink" style="width: 100%; margin-top: 15px;" onclick="takeItem('${item.title}')">Взяти / Написати</button>
        `;
        grid.appendChild(card);
    });
}

// Функція кнопки "Взяти"
function takeItem(title) {
    alert(`Зв'язуємося з власником речі "${title}"! Сусід отримав ваше сповіщення у чаті гуртожитку. 💌`);
}

// Додавання нової речі (з add-item.html)
const addForm = document.getElementById('add-item-form');
if (addForm) {
    addForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('item-title').value;
        const room = document.getElementById('item-room').value;
        const price = document.getElementById('item-price').value;
        const icon = document.getElementById('item-icon').value || '📦';

        const newItem = {
            id: Date.now(),
            title,
            room,
            price,
            icon
        };

        const items = getItems();
        items.unshift(newItem); // Додаємо на початок списку
        saveItems(items);

        // Також додаємо в список оголошень поточного користувача для профілю
        let myAds = JSON.parse(localStorage.getItem('myAds')) || [];
        myAds.unshift(newItem);
        localStorage.setItem('myAds', JSON.stringify(myAds));

        alert('Оголошення успішно додано на дошку гуртожитку! 🎉');
        window.location.href = 'index.html';
    });
}


// --- РОБОТА З ПРОФІЛЕМ ТА РЕДАГУВАННЯМ ---

// Завантаження даних профілю
function loadProfile() {
    const profileName = document.getElementById('profile-name');
    if (!profileName) return; // Якщо не сторінка профілю

    const user = JSON.parse(localStorage.getItem('dormUser')) || {
        name: "Соломія",
        room: "Гуртожиток №1, Кімната 312 • 3 поверх",
        rating: "4.9"
    };

    document.getElementById('profile-name').innerText = user.name;
    document.getElementById('profile-room').innerText = user.room;
    
    renderMyAds();
}

// Редагування профілю
function editProfile() {
    const currentName = document.getElementById('profile-name').innerText;
    const currentRoom = document.getElementById('profile-room').innerText;

    const newName = prompt("Введіть ваше ім'я:", currentName);
    const newRoom = prompt("Введіть ваш гуртожиток та кімнату:", currentRoom);

    if (newName && newRoom) {
        const user = { name: newName, room: newRoom, rating: "5.0" };
        localStorage.setItem('dormUser', JSON.stringify(user));
        loadProfile();
        alert('Профіль успішно оновлено! ✨');
    }
}

// Відображення моїх оголошень у профілі з можливістю видалення
function renderMyAds() {
    const container = document.getElementById('my-ads-container');
    if (!container) return;

    let myAds = JSON.parse(localStorage.getItem('myAds')) || [];
    container.innerHTML = '';

    if (myAds.length === 0) {
        container.innerHTML = '<p style="color: #777; font-size: 14px;">У вас поки немає активних оголошень.</p>';
        return;
    }

    myAds.forEach((ad, index) => {
        const adCard = document.createElement('div');
        adCard.style.cssText = "background: white; padding: 15px; border-radius: 12px; border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;";
        
        adCard.innerHTML = `
            <div>
                <h4 style="margin: 0 0 5px; font-size: 16px;">${ad.icon || '📦'} ${ad.title}</h4>
                <p style="margin: 0; font-size: 13px; color: #777;">Ціна/Умови: ${ad.price}</p>
            </div>
            <button style="background: #ffe6ee; color: #ff758c; border: none; padding: 6px 12px; border-radius: 8px; font-weight: bold; cursor: pointer;" onclick="deleteMyAd(${index})">Видалити</button>
        `;
        container.appendChild(adCard);
    });
}

// Видалення оголошення
function deleteMyAd(index) {
    let myAds = JSON.parse(localStorage.getItem('myAds')) || [];
    let items = getItems();

    // Видаляємо з локальних оголошень користувача
    const removed = myAds.splice(index, 1)[0];
    localStorage.setItem('myAds', JSON.stringify(myAds));

    // Також видаляємо із загальної дошки (index.html) за назвою
    items = items.filter(item => item.title !== removed.title);
    saveItems(items);

    renderMyAds();
    alert('Оголошення видалено!');
}

// Автоматичний запуск рендерингу залежно від сторінки
window.onload = function() {
    renderItems();
    loadProfile();
};

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const floorFilter = document.getElementById("floor-filter");

    // Функція живого пошуку та фільтрації
    function filterItems() {
        const searchText = searchInput ? searchInput.value.toLowerCase() : "";
        const selectedFloor = floorFilter ? floorFilter.value : "all";

        // Знаходимо всі картки на сторінці (як статичні, так і згенеровані)
        const cards = document.querySelectorAll(".item-card, [class*='card']"); // адаптуй під свій клас карток

        cards.forEach(card => {
            const titleElement = card.querySelector("h3, h4, .item-title");
            const roomElement = card.querySelector("p, .item-room");

            const titleText = titleElement ? titleElement.textContent.toLowerCase() : "";
            const roomText = roomElement ? roomElement.textContent.toLowerCase() : "";

            // Перевірка на збіг по тексту пошуку
            const matchesSearch = titleText.includes(searchText) || roomText.includes(searchText);

            // Перевірка на збіг по поверху (шукаємо цифру поверху в тексті кімнати)
            const matchesFloor = selectedFloor === "all" || roomText.includes(`${selectedFloor} поверх`);

            if (matchesSearch && matchesFloor) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    }

    if (searchInput) searchInput.addEventListener("input", filterItems);
    if (floorFilter) floorFilter.addEventListener("change", filterItems);

    // Інтерактивні кнопки бронювання (зміна статусу в реальному часі)
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-pink") && e.target.textContent.includes("Взяти")) {
            e.preventDefault();
            e.target.textContent = "✅ Заброньовано";
            e.target.style.background = "#4bb543"; // зелений колір успіху
            e.target.style.color = "white";
            e.target.disabled = true;
        }
    });
});
