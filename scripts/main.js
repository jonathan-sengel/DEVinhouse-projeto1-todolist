import { createItemObject, validateIfExists } from "./helpers.js";

const $inputItem = document.getElementById('todo-input');
const $btnAdd = document.getElementById('btn-adicionar');
const $itemsList = document.getElementById('todo-ul');
const $btnDeleteAll = document.getElementById('delete-all');
const $btnDeleteFinished = document.getElementById('delete-finished');

$btnAdd.addEventListener('click', handleAddItemClick);
$inputItem.addEventListener('keyup', callButtonAdd);
document.addEventListener('DOMContentLoaded', loadTodoList);
$btnDeleteAll.addEventListener('click', handleRemoveAll);
$btnDeleteFinished.addEventListener('click', handleRemoveFinished);

let todoList = [];

function loadItemsFromLocalStorage() {
  todoList = JSON.parse(localStorage.getItem('todoList'));
}

function saveItemsOnLocalStorage() {
  localStorage.setItem('todoList', JSON.stringify(todoList));
}

function loadTodoList() {
  if (localStorage.getItem('todoList')) {
    loadItemsFromLocalStorage();
    for (let task of todoList) {
      const newItemLi = createNewItemElement(task);
      $itemsList.appendChild(newItemLi);
    }
  }
}

function handleAddItemClick() {
  const description = $inputItem.value;
  if (description && description.length > 2) {
    if (validateIfExists(description, todoList) < 0) {
      const newItemObject = createItemObject(description);
      const newItemLi = createNewItemElement(newItemObject);
      $itemsList.prepend(newItemLi);
      $inputItem.value = "";
      $inputItem.focus();
      todoList.unshift(newItemObject);
      saveItemsOnLocalStorage();
    } else {
      showErrorMessage('Tarefa com nome "' + description + '" já existe!');
      $inputItem.value = "";
    }
  } else {
    showErrorMessage('Informe um texto com pelo menos 3 caracteres!');
  }
}

// Create HTML Elements =================================================================
function createNewItemElement(itemObj) {
  const newLi = document.createElement('li');
  newLi.classList.add('todo-item');
  itemObj.checked ? newLi.classList.add('finished') : null;
  newLi.appendChild(createItemCheckbox(itemObj));
  newLi.appendChild(createItemDescription(itemObj));
  newLi.appendChild(createItemButton(itemObj));
  return newLi;
}

function createItemCheckbox(todoObj) {
  const { id, checked } = todoObj;
  let itemCheck = document.createElement('input');
  itemCheck.type = 'checkbox';
  itemCheck.name = id;
  itemCheck.id = id;
  itemCheck.checked = checked;
  itemCheck.addEventListener('click', handleCheckItem);
  return itemCheck;
}

function createItemDescription(todoObj) {
  const { id, description, checked } = todoObj;
  let itemDescription = document.createElement('label');
  itemDescription.classList.add('descricao');
  checked ? itemDescription.classList.add('descricao', 'checked') : itemDescription.classList.add('descricao');
  itemDescription.htmlFor = id;
  itemDescription.innerText = description;
  return itemDescription;
}

function createItemButton(todoObj) {
  let itemButton = document.createElement('button');
  itemButton.innerText = 'delete_forever';
  itemButton.addEventListener('click', handleRemoveButton);
  itemButton.setAttribute('parentId', todoObj.id);
  itemButton.title = "Remover tarefa";
  return itemButton;
}


function callButtonAdd(evt) {
  let firstLetter = $inputItem.value.charAt(0);
  $inputItem.value = $inputItem.value.replace(firstLetter, firstLetter.toUpperCase());

  if (evt.key === 'Enter') {
    $btnAdd.classList.add('scaleToLow');
    setTimeout(() => {
      $btnAdd.classList.remove('scaleToLow');
      handleAddItemClick();
    }, 100)
  }
}

function showErrorMessage(message) {
  let messageSpan = document.createElement('span');
  messageSpan.className = 'error';
  messageSpan.innerText = message;
  document.querySelector('.todo-container').prepend(messageSpan);
  setTimeout(() => {
    messageSpan.classList.add('remove');
    setTimeout(() => { messageSpan.remove(); }, 3350)
  }, 3000)
}

function createModalButtons() {
  document.getElementById('modal-window').innerHTML = '';

  let div = '<div>Confirma exclusão do(s) item(ns)?</div>';
  let button1 = '<button class="general-button confirm" id="confirm-delete">Confirmar</button>'
  let button2 = '<button class="general-button" id="cancel-delete">Cancelar</button>'

  document.getElementById('modal-window').innerHTML = div + button1 + button2;
}

// Events ========================================================================
async function showDeleteModal(_origem = null, _func = null) {
  let $modal = document.getElementById('modal-container');
  $modal.classList.add('show-modal');
  createModalButtons();
  let $btnConfirmDelete = document.getElementById('confirm-delete');
  let $btnCancelDelete = document.getElementById('cancel-delete');

  $btnConfirmDelete.addEventListener('click', () => {
    _origem ? removeItem(_origem) : _func();
    $modal.classList.remove('show-modal');
  });
  $btnCancelDelete.addEventListener('click', () => {
    $modal.classList.remove('show-modal');
  });
}

function removeItem(evt) {
  let id = evt.target.getAttribute('parentId');
  let itemLi = evt.target.parentElement;
  itemLi.classList.add('remove');
  setTimeout(() => {
    itemLi.remove();
  }, 350);
  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].id === id) {
      todoList.splice(i, 1);
      saveItemsOnLocalStorage();
    }
  }
}

function deleteElements(elementsList, interval = 50) {
  let timer = 50;
  for (let i = elementsList.length - 1; i >= 0; i--) {
    setTimeout(() => {
      elementsList[i].classList.add('remove');
      setTimeout(() => elementsList[i].remove(), timer);
    }, timer += interval);
  }
}

function handleCheckItem() {
  const checkedElementId = this.id;
  for (let task of todoList) {
    if (task.id === checkedElementId) {
      task.checked = !task.checked;
      saveItemsOnLocalStorage();
    }
  }
  this.parentElement.classList.toggle('finished');
  this.nextElementSibling.classList.toggle('checked');
}

function handleRemoveAll() {
  showDeleteModal(null, deleteAllTasks);
}

function handleRemoveFinished() {
  showDeleteModal(null, deleteAllFinished);
}

function handleRemoveButton(evt) {
  showDeleteModal(evt, null)
}

function deleteAllTasks() {
  let allTasksElements = $itemsList.getElementsByTagName('li');
  deleteElements(allTasksElements);
  todoList = [];
  saveItemsOnLocalStorage();
}

function deleteAllFinished() {
  let finishedTasksElements = document.querySelectorAll('.todo-item.finished');
  deleteElements(finishedTasksElements, 100);
  // roda todos os elementos da lista de trás para a frente para ver quais estão checados e apagar;
  for (let i = todoList.length - 1; i >= 0; i--) {
    if (todoList[i].checked) {
      todoList.splice(i, 1);
    }
  }
  saveItemsOnLocalStorage();
}



