const toDoList = JSON.parse(localStorage.getItem('toDoList')) ||
[];

let currentFilter = 'all';


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

  console.log(filteredList);

  filteredList.forEach((task) => {
    const name = task.name;
    const dueDate = task.dueDate;
    const index = toDoList.indexOf(task);
    html += `

      <div class="todo-item ${task.completed ? 'completed' : ''}">
        <ul>
          <li>
        <div class="task-name">
          <label class="check-container">
            <input type="checkbox" onclick="
              markCompleted(${index}, this)
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

function updateLocalStorage(){
  localStorage.setItem('toDoList', JSON.stringify(toDoList));
}



document.querySelector('.js-add-button')
  .addEventListener('click', () => {
    addToList();
});


function addToList () {
  const input  = document.querySelector('.js-input');
  let name = input.value;

  const dateInput = document.querySelector('.js-date-input');
  const dueDate = dateInput.value;

  toDoList.push({
    name: name,
    dueDate: dueDate,
    completed: false
  });
  input.value = '';
  dateInput.value = '';

  renderList();
  updateLocalStorage();
  console.log(toDoList);
}

function markCompleted(index, checkbox) {
  const item = checkbox.closest('.todo-item');

  if (checkbox.checked) {
    item.classList.add('completing');
    
    item.addEventListener('animationend', function handler () {
      item.classList.remove('completing');
      item.classList.add('completed');

      todoList[index].completed = true;
      updateLocalStorage();

      item.querySelector('.js-dueDate').textContent = 'completed';
      item.removeEventListener('animationend', handler);
    });
  } else {
    // Uncheck → remove completed
    item.classList.remove('completed');
    toDoList[index].completed = false;
    updateLocalStorage();
    item.querySelector('.js-dueDate').textContent = toDoList[index].dueDate;
  }
}

function editTaskInline(index) {
  const taskDivs = document.querySelectorAll('.todo-item');
  const taskDiv = taskDivs[index];
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
    const newDate = dateInput.value;
    let valid = true;

    nameInput.classList.remove('error');
    dateInput.classList.remove('error');

    if (newName === ''){
      nameInput.value = '';
      nameInput.placeholder = 'Invalid task name';
      nameInput.classList.add('error');
      valid = false;
    }

    if (newDate === ''){
      dateInput.type = 'text';
      dateInput.value = '';
      dateInput.placeholder = 'Invalid date selection';
      dateInput.classList.add('error');

      dateInput.addEventListener('focus', () => {
        dateInput.type = 'date';
      }, {once: true});

      valid = false;
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(newDate);

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

    if (!valid) return;

    task.name = newName;
    task.dueDate = newDate;
    updateLocalStorage();
    renderList();
  }

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.onclick = () => {
    renderList();
  }

  taskDiv.innerHTML = '';
  taskDiv.appendChild(nameInput);
  taskDiv.appendChild(dateInput);
  taskDiv.appendChild(saveButton);
  taskDiv.appendChild(cancelButton);

  nameInput.focus();
}

function setFilter(filterType) {
  currentFilter = filterType;
  document.querySelectorAll('.filters button').forEach((btn) => {
    btn.classList.remove('active');
  });

  const btn = document.querySelector(`.filters button[data-filter="${filterType}"]`);

  if(btn) btn.classList.add('active');
  renderList();
}
