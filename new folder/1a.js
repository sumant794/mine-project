const toDoList = JSON.parse(localStorage.getItem('toDoList')) || [];
let currentFilter = 'all';

renderList();

function renderList() {
  let html = '';
  const filteredList = toDoList.filter(task => {
    if (currentFilter === 'completed') return task.completed;
    if (currentFilter === 'pending') return !task.completed;
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
            <div class="task-name">
              <label class="check-container">
                <input type="checkbox" 
                  onclick="markCompleted(${index}, this)" 
                  ${task.completed ? 'checked' : ''}>
                <span class="checkmark"></span>
                ${name}
              </label>
            </div>

            <div class="js-dueDate">
              ${task.completed ? 'Completed' : dueDate}
            </div>

            <button class="edit-button" onclick="editTaskInline(${index})">Edit</button>
            <button class="js-delete delete-button" onclick="
              toDoList.splice(${index}, 1);
              updateLocalStorage();
              renderList();
            ">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </li>
        </ul>
      </div>
    `;
  });

  document.querySelector('.js-list').innerHTML = html;
}

function updateLocalStorage() {
  localStorage.setItem('toDoList', JSON.stringify(toDoList));
}

document.querySelector('.js-add-button')
  .addEventListener('click', addToList);

function addToList() {
  const input = document.querySelector('.js-input');
  const dateInput = document.querySelector('.js-date-input');

  toDoList.push({
    name: input.value,
    dueDate: dateInput.value,
    completed: false
  });

  input.value = '';
  dateInput.value = '';

  updateLocalStorage();
  renderList();
}

function markCompleted(index, checkbox) {
  const item = checkbox.closest('.todo-item');
  
  if (checkbox.checked) {
    item.classList.add('completing'); // start slide animation

    // After animation ends, mark completed
    item.addEventListener('animationend', function handler() {
      item.classList.remove('completing');
      item.classList.add('completed');

      toDoList[index].completed = true;
      updateLocalStorage();

      item.querySelector('.js-dueDate').textContent = 'Completed';
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

// Keep your editTaskInline and setFilter functions unchanged
