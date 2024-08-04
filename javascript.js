// Utility functions to handle cookies
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

function getItems() {
    let items = getCookie('items');
    return items ? JSON.parse(items) : [];
}

function setItems(items) {
    setCookie('items', JSON.stringify(items), 365);
}

function addItem(name, description) {
    let items = getItems();
    items.push({ id: Date.now(), name: name, description: description });
    setItems(items);
    renderItems();
}

function updateItem(id, name, description) {
    let items = getItems();
    let index = items.findIndex(item => item.id === id);
    if (index !== -1) {
        items[index].name = name;
        items[index].description = description;
        setItems(items);
        renderItems();
    }
}

function deleteItem(id) {
    let items = getItems();
    items = items.filter(item => item.id !== id);
    setItems(items);
    renderItems();
}

function renderItems() {
    let items = getItems();
    let tbody = document.getElementById('itemsTableBody');
    tbody.innerHTML = '';
    items.forEach(item => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="editItem(${item.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteItem(${item.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editItem(id) {
    let items = getItems();
    let item = items.find(item => item.id === id);
    if (item) {
        document.getElementById('itemId').value = item.id;
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemDescription').value = item.description;
    }
}

document.getElementById('crudForm').addEventListener('submit', function (event) {
    event.preventDefault();
    let id = document.getElementById('itemId').value;
    let name = document.getElementById('itemName').value;
    let description = document.getElementById('itemDescription').value;
    if (id) {
        updateItem(parseInt(id), name, description);
    } else {
        addItem(name, description);
    }
    document.getElementById('crudForm').reset();
    document.getElementById('itemId').value = '';
});

renderItems();
