const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

renderTasks();

form.addEventListener("submit", function(e){

    e.preventDefault();

    const task = {
        id: Date.now(),
        text: input.value,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    input.value = "";
});

function renderTasks(){

    taskList.innerHTML = "";

    tasks.forEach(task => {

        const li = document.createElement("li");

        li.classList.add("task");

        if(task.completed){
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span>${task.text}</span>

            <div class="actions">

                <button class="completeBtn"
                onclick="toggleTask(${task.id})">
                ✓
                </button>

                <button class="deleteBtn"
                onclick="deleteTask(${task.id})">
                ✕
                </button>

            </div>
        `;

        taskList.appendChild(li);
    });

    updateStats();
}

function toggleTask(id){

    tasks = tasks.map(task => {

        if(task.id === id){
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

function deleteTask(id){

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

function updateStats(){

    const completed = tasks.filter(task => task.completed).length;

    totalTasks.textContent =
        `${tasks.length} tarefas`;

    completedTasks.textContent =
        `${completed} concluídas`;
}

function saveTasks(){

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}