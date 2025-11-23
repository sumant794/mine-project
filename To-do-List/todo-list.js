// Loading the todoList array from localStorage and if localStorage is empty an empty array will be created.
const toDoList = JSON.parse(localStorage.getItem('toDoList')) ||
[];

// Setting the filter button to all so that from the moment when page loads we can see all tasks.
let currentFilter = 'all';

// This fuction displays all the tasks on page. 
renderList();

function renderList() {
  let html = '';
  const filteredList = toDoList.filter((task) => {
    if(currentFilter === 'completed')
      return task.completed === true;
    if(currentFilter === 'pending')
      return task.completed === false;
    return true;
  });   

  filteredList.forEach((task) => {
    const name = task.name;
    const dueDate = task.dueDate;
    const index = toDoList.indexOf(task);
    html += `
      <div class="todo-item ${task.completed ? 'completed' : ''}">
        <ul>
            <li>
              <span class="left-border"></span>

              <div class="task-name">
                <label class="check-container">
                  <input type="checkbox" onclick="
                    toDoList[${index}].completed = 
                    this.checked;
                    updateLocalStorage();
                    renderList();
                    " ${task.completed ? 'checked' : ''}>
                    <span class="checkmark"></span>
                    ${name}
                </label>
              </div>

              <div class="js-dueDate ${task.complted ? 'completed-text' : ''}">
                ${task.completed ? 'completed' : task.dueDate}
              </div>


              <button class="edit-button" onclick="
                editTaskInline(${index});
              ">Edit</button>

              <button class="js-delete delete-button" onclick="
                toDoList.splice(${index}, 1);
                renderList();
                updateLocalStorage();
              "><i class="fa-solid fa-trash-can"></i></button>
            </li>
        </ul>
      </div>
      `;
    });

    document.querySelector('.js-list')
      .innerHTML = html;
}
// Saving all the tasks to localStorage.
function updateLocalStorage(){
  localStorage.setItem('toDoList', JSON.stringify(toDoList));
}

//Making add button interactive so that when we click it it adds the task to list.
document.querySelector('.js-add-button')
  .addEventListener('click', () => {
    addToList();
});

// Creating a function which adds the task to list and then it updates the page. 
function addToList () {
  const nameInput  = document.querySelector('.js-input');
  const newName = nameInput.value;

  const dateInput = document.querySelector('.js-date-input');
  const dueDate = dateInput.value;

  nameInput.classList.remove('error');
  dateInput.classList.remove('error');
  const valid = validTaskDate(newName, nameInput, dueDate,dateInput);

  if(!valid) return;

  toDoList.push({
    name: newName,
    dueDate: dueDate,
    completed: false
  });
  nameInput.value = '';
  dateInput.value = '';
  nameInput.placeholder = 'Enter a task';
  renderList();
  updateLocalStorage();
  console.log(toDoList);
}

//Here we are changing the filter button to whatever button we click.
const filterButton = document.querySelectorAll('.filters button');
filterButton.forEach((btn) => {
  if(btn.textContent === 'All') {
    btn.addEventListener('click', () => {
      setFilter('all');
  });
  }

  if(btn.textContent === 'Completed') {
    btn.addEventListener('click', () => {
      setFilter('completed');
  });
  }

   if(btn.textContent === 'Pending') {
    btn.addEventListener('click', () => {
      setFilter('pending');
  });
  }

});

//This function actually changes the filter button whenever we call this function.
function setFilter(filterType) {
  currentFilter = filterType;
  document.querySelectorAll('.filters button').forEach((btn) => {
    btn.classList.remove('active');
  });

  const btn = document.querySelector(`.filters button[data-filter="${filterType}"]`);

  renderList();
}

//This function let us edit the task name and duedate and then let us to save it or cancel in the same line.
function editTaskInline(index) {
  const taskDivs = document.querySelectorAll('.todo-item');
  const taskDiv = taskDivs[index];

  console.log(taskDivs);
  console.log(taskDiv);
  const task = toDoList[index];

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.value = task.name;
  nameInput.className = 'edit-input';
  nameInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
      saveButton.onclick();
    }
  });

  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.value = task.dueDate;
  dateInput.className = 'edit-input';
  dateInput.addEventListener('keydown', (e) => {
  if(e.key === 'Enter'){
    saveButton.onclick();
    }
  });


  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save';
  saveButton.onclick = () => {
  
    const newName = nameInput.value.trim();
    const dueDate = dateInput.value;

    nameInput.classList.remove('error');
    dateInput.classList.remove('error');
    const valid = validTaskDate(newName, nameInput, dueDate, dateInput);
  
    if (!valid) return;

    task.name = newName;
    task.dueDate = dueDate;
    updateLocalStorage();
    renderList(); 
  }

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.onclick = () => {
    renderList();
  }

  taskDiv.innerHTML = '';

  const editContainer = document.createElement('div');
  editContainer.className = 'edit-container';

  editContainer.appendChild(nameInput);
  editContainer.appendChild(dateInput);
  editContainer.appendChild(saveButton);
  editContainer.appendChild(cancelButton);

  taskDiv.appendChild(editContainer);
  nameInput.focus();
}

//All the inputs are valid or not is cheked by this function.
function validTaskDate(newName, nameInput, dueDate, dateInput){
  let valid = true;
  if(newName === ''){
    nameInput.value = '';
    nameInput.placeholder = 'Invalid task name';
    nameInput.classList.add('error');
    valid = false;
  }

  if (dueDate === ''){
    dateInput.type = 'text';
    dateInput.value = '';
    dateInput.placeholder = 'Invalid date';
    dateInput.classList.add('error');

    dateInput.addEventListener('focus', () => {
    dateInput.type = 'date';
    }, {once: true});

    valid = false;
} else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(dueDate);

  if(selectedDate < today){
    dateInput.type = 'text';
    dateInput.value = '';
    dateInput.placeholder = 'Invalid date selection';
    dateInput.classList.add('error');

    dateInput.addEventListener('focus', () => {
    dateInput.type = 'date';
    }, {once: true});

    valid = false;
    }
  }

  return valid;
}

