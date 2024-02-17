const todoContainer = document.getElementById("todo-container");
const todoInput = document.getElementById("todo-input");
const todoButton = document.getElementById("add-todo");

const progressDone = document.querySelector(".progress-done");
const progressInProgress = document.querySelector(".progress-inprogress");
const progressInList = document.querySelector(".progress-inlist");

// Array to store the todo items
let todosList;
let complPerc = 100;
let inProgressPerc = 0;
let lengthTodosPerc = 0;

// Retrieve todos from local storage
const storedTodos = localStorage.getItem("todos");
if (storedTodos) {
  todos = JSON.parse(storedTodos);
} else {
  todos = [];
}

function getProgressValues(todos) {
  let lengthTodos = todos.length;
  let completedTodos = 0;
  let inProgressTodos = 0;

  // count how many of todos are completed
  for (let i = 0; i < lengthTodos; i++) {
    if (todos[i].isCompleted) {
      completedTodos++;
    }
  }

  // count how many of todos are completed
  for (let i = 0; i < lengthTodos; i++) {
    if (todos[i].isInProgress) {
      inProgressTodos++;
    }
  }

  if (lengthTodos === 0) {
    complPerc = 100;
    inProgressPerc = 0;
    lengthTodosPerc = 0;
  } else {
    complPerc = (completedTodos / lengthTodos) * 100;
    inProgressPerc = (inProgressTodos / lengthTodos) * 100;
    lengthTodosPerc =
      ((lengthTodos - inProgressTodos - completedTodos) / lengthTodos) * 100;
  }

  return [complPerc, inProgressPerc, lengthTodosPerc];
}
// Function to add a new todo item
function addTodoItem(item) {
  if (item === "" || item.length < 2) return;
  const newTodo = {
    id: Date.now(),
    text: item,
    isInProgress: false,
    isCompleted: false,
  };
  todos.push(newTodo);
  saveTodosToLocalStorage();
}

// Function to remove a todo item
function removeTodoItem(index) {
  todos.splice(index, 1);
  saveTodosToLocalStorage();
}

function updateTodoItem(index) {
  if (todos[index].isInProgress && !todos[index].isCompleted) {
    todos[index].isInProgress = false;
  } else if (!todos[index].isInProgress && !todos[index].isCompleted) {
    todos[index].isInProgress = true;
  }
  saveTodosToLocalStorage();
}

// Function to save todos to local storage
function saveTodosToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Function to display all todo items
function displayTodoItems() {
  if (todos.length === 0) {
    const noTodoItem = document.createElement("div");
    noTodoItem.classList.add("no-todo-item");
    noTodoItem.innerText = "No tasks planned! 🎉";
    noTodoItem.classList.add("text-gray-500", "text-lg", "text-center");
    todoContainer.appendChild(noTodoItem);
    return;
  }
  todos.forEach((item, index) => {
    const todoItem = document.createElement("div");
    todoItem.classList.add("todo-item");
    todoItem.classList.add(
      "relative",
      "p-3",
      "mb-2",
      "rounded-md",
      "shadow-md",
      "w-full"
    );
    if (item.isCompleted) {
      todoItem.classList.add("bg-green-100");
    } else if (item.isInProgress) {
      todoItem.classList.add("bg-yellow-100");
    } else {
      todoItem.classList.add("bg-gray-100");
    }
    todoItem.innerText = `${item.text}`;

    // Change the background color of the todo item when clicked
    todoItem.addEventListener("click", () => {
      if (item.isCompleted) {
        item.isCompleted = false;
        item.isInProgress = false;
      } else if (!item.isCompleted) {
        item.isCompleted = true;
        item.isInProgress = false;
      }
      saveTodosToLocalStorage();
      todoContainer.innerText = "";
      displayTodoItems();
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerText = "X";
    deleteButton.classList.add(
      "absolute",
      "right-0",
      "top-2",
      "text-white",
      "rounded-md",
      "p-1",
      "px-3",
      "mr-2"
    );
    if (item.isCompleted) {
      deleteButton.classList.add("bg-green-500", "hover:bg-green-600");
    } else if (item.isInProgress) {
      deleteButton.classList.add("bg-yellow-500", "hover:bg-yellow-600");
    } else {
      deleteButton.classList.add("bg-gray-300", "hover:bg-gray-400");
    }
    deleteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      removeTodoItem(index);
      todoContainer.innerText = "";
      displayTodoItems();
    });

    const inProgressButton = document.createElement("button");
    inProgressButton.classList.add("inprogress-button");
    inProgressButton.innerText = "→";
    inProgressButton.classList.add(
      "absolute",
      "bg-gray-300",
      "right-10",
      "top-2",
      "text-white",
      "rounded-md",
      "p-1",
      "px-3",
      "mr-2"
    );
    inProgressButton.addEventListener("click", (e) => {
      e.stopPropagation();
      updateTodoItem(index);
      todoContainer.innerText = "";
      displayTodoItems();
    });
    if (item.isCompleted) {
      inProgressButton.classList.add("bg-green-500", "hover:bg-green-600");
    } else if (item.isInProgress) {
      inProgressButton.classList.add("bg-yellow-500", "hover:bg-yellow-600");
    } else {
      inProgressButton.classList.add("bg-gray-300", "hover:bg-gray-400");
    }

    todoItem.appendChild(deleteButton);
    todoItem.appendChild(inProgressButton);
    todoContainer.appendChild(todoItem);

    itemValues = getProgressValues(todos);
    progressDone.style.width = `${Math.round(itemValues[0], 0).toString()}%`;
    progressInProgress.style.width = `${Math.round(
      itemValues[1],
      0
    ).toString()}%`;
    progressInList.style.width = `${Math.round(itemValues[2], 0).toString()}%`;
    progressDone.innerText = `${Math.round(itemValues[0], 0).toString()}%`;
    progressInProgress.innerText = `${Math.round(
      itemValues[1],
      0
    ).toString()}%`;
    progressInList.innerText = `${Math.round(itemValues[2], 0).toString()}%`;
  });
}

// Event listener to add a new todo item when Enter key is pressed
todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTodoItem(todoInput.value);
    todoInput.value = "";
    todoContainer.innerText = "";
    displayTodoItems();
  }
});

// Event listener to add a new todo item when button is clicked
todoButton.addEventListener("click", () => {
  addTodoItem(todoInput.value);
  todoInput.value = "";
  todoContainer.innerText = "";
  displayTodoItems();
});

itemValues = getProgressValues(todos);
progressDone.style.width = `${Math.round(itemValues[0], 0).toString()}%`;
progressInProgress.style.width = `${Math.round(itemValues[1], 0).toString()}%`;
progressInList.style.width = `${Math.round(itemValues[2], 0).toString()}%`;
progressDone.innerText = `${Math.round(itemValues[0], 0).toString()}%`;
progressInProgress.innerText = `${Math.round(itemValues[1], 0).toString()}%`;
progressInList.innerText = `${Math.round(itemValues[2], 0).toString()}%`;
displayTodoItems();

// date fetchers
const date = new Date();
const day = date.getDate();
const month = date.getMonth();

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
document.querySelector(".day-number").innerText = `${day.toString()}`;
document.querySelector(".month-name").innerText = `${months[month]}`;

// display time
function displayTime() {
  const updateTime = () => {
    const date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    const second = date.getSeconds();

    hour = hour < 10 ? `0${hour}` : hour;
    minute = minute < 10 ? `0${minute}` : minute;

    document.querySelector(
      ".time"
    ).innerText = `${hour.toString()}:${minute.toString()}`;
  };
  updateTime();
  setInterval(updateTime, 1000);
}

displayTime();
