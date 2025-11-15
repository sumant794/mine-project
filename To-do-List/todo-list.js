const toDoList = JSON.parse(localStorage.getItem('toDoList')) ||
[];


renderList();

function renderList() {
  let html = '';

  toDoList.forEach((task, index) => {
    const name = task.name;
    const dueDate = task.dueDate;

    html += `
      <div class="todo-item ${task.completed ? 'completed' : ''}">
        <div class="task-name">
          <input type="checkbox" onclick="
            toDoList[${index}].completed = 
            this.checked;
            updateLocalStorage();
            renderList();
            " ${task.completed ? 'checked' : ''}>
            ${name}
        </div>

        <div>${dueDate}</div>
        <button onclick="
          editTaskInline(${index});
        ">Edit</button>
        <button class="js-delete" onclick="
          toDoList.splice(${index}, 1);
          renderList();
          updateLocalStorage();
        ">Delete</button>
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

  renderList();
  updateLocalStorage();
  console.log(toDoList);
}

function editTaskInline(index) {
  const taskDivs = document.querySelectorAll('.todo-item');
  const taskDiv = taskDivs[index];
  const task = toDoList[index];

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.value = task.name;
  nameInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
      saveButton.onclick();
    }
  });

  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.value = task.dueDate;
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

    if(newName === ''){
      errorMessage.textContent = 'Task name cannot be empty.';
      return;
    }

    if(newDate === '') {
      errorMessage.textContent = 'Please select a due date.';
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectDate = new Date(newDate);
    if (selectDate < today){
      errorMessage.textContent = 'Due date cannot be in past.';
      return;
    }

    task.name = nameInput.value;
    task.dueDate = dateInput.value;
    updateLocalStorage();
    renderList();
  };

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel'
  cancelButton.onclick = () => {
    renderList();
  }

  const errorMessage = document.createElement('div');
  errorMessage.style.color = 'red';
  errorMessage.style.MarginTop = '5px';
  errorMessage.style.fontSize = '14px';
  
  taskDiv.innerHTML = '';
  taskDiv.appendChild(nameInput);
  taskDiv.appendChild(dateInput);
  taskDiv.appendChild(saveButton);
  taskDiv.appendChild(cancelButton);
  taskDiv.appendChild(errorMessage);
  nameInput.focus();
}