let currentEndpoint = '/items/page/1'; 
let isSortedState = false; 

const loadData = (endpoint) => {
    currentEndpoint = endpoint;
    $.ajax(`${endpoint}`, {
        type: 'GET',
        dataType: 'html',
        success: InsertHTML,
        error: ErrorHandle
    });
};

window.onload = () => loadData('/items/page/1');

const ShowAllCards = () => loadData(currentEndpoint);

const InsertHTML = (data) => {
    document.getElementById("view").innerHTML = data;
}

function ErrorHandle(jqXHR, StatusStr, ErrorStr) {
    const serverMessage = jqXHR.responseText;
    alert(serverMessage || (StatusStr + ' ' + ErrorStr));
    
    InsertHTML(`<div style="color: #ab0303; text-align: center; margin-top: 20px; font-size: 18px; font-weight: bold;">
                    ${serverMessage || "Произошла ошибка при загрузке данных"}
                </div>`);
}

const CreateNew = () => {
    document.getElementById('form').setAttribute('data-method', 'POST');
    OpenForm();
}

const ShowDefault = () => {
    isSortedState = false;
    loadData('/items/page/1');
}

const ShowById = () => {
    const id = prompt("Введите ID танца:");
    if (id !== null && id.trim() !== "") {
        loadData(`/items/${id}`);
    }
}

const ShowByName = () => {
    const name = prompt("Введите название танца (или его часть):");
    if (name !== null && name.trim() !== "") {
        loadData(`/items/search/${name}`);
    }
}

const SortByName = () => {
    isSortedState = true;
    loadData('/items/sorted/page/1');
}

const ShowPage = (pageIdx) => {
    if (isSortedState) {
        loadData(`/items/sorted/page/${pageIdx}`);
    } else {
        loadData(`/items/page/${pageIdx}`);
    }
}

const updateCardHandle = (e) => {
    const cont = e.currentTarget.parentElement.parentElement;
    const id = cont.getAttribute('data-id');
    document.getElementById('form').setAttribute('data-method', 'PUT');
    document.getElementById('form').setAttribute('data-id', id);
    
    const name = cont.getAttribute('data-name');
    const desc = cont.getAttribute('data-desc');
    document.getElementById("name-input").value = name;
    document.getElementById("desc-input").value = desc;
    
    OpenForm();
}

const deleteCardHandle = (e) => {
    const id = e.currentTarget.parentElement.parentElement.getAttribute('data-id');
    $.ajax(`items/${id}`, {
        type: 'DELETE', 
        dataType: 'json',
        success: ShowAllCards, 
        error: ErrorHandle,
    });
}

const OpenForm = () => {
    document.getElementById("form-wrapper").classList.toggle("ds-none");
}

const CloseForm = () => {
    document.getElementById("form-wrapper").classList.toggle("ds-none");
    document.getElementById("name-input").value = "";
    document.getElementById("desc-input").value = "";
}

const SubmitForm = () => {
    const name = document.getElementById("name-input").value;
    const desc = document.getElementById("desc-input").value;

    if (name === "" || desc === "") {
        alert("Заполните все поля!");
        return;
    }

    const method = document.getElementById("form").getAttribute("data-method");
    const id = document.getElementById("form").getAttribute('data-id');
    
    const payload = JSON.stringify({ "name": name, "desc": desc });

    if (method === 'POST') {
        $.ajax("items", {
            type: 'POST', 
            contentType: 'application/json',
            dataType: 'json',
            data: payload,
            success: ShowAllCards, 
            error: ErrorHandle,
        });
    } else if (method === 'PUT') {
        $.ajax(`items/${id}`, {
            type: 'PUT', 
            contentType: 'application/json',
            dataType: 'json',
            data: payload,
            success: ShowAllCards, 
            error: ErrorHandle,
        });
    }
    CloseForm();
}
