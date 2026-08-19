const taskNameInput = document.getElementById("taskName");
const subjectInput = document.getElementById("subject");
const priorityInput = document.getElementById("priority");
const deadlineInput = document.getElementById("deadline");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskFilter = document.getElementById("taskFilter");
const totalTasksElement = document.getElementById("totalTasks");
const completedTasksElement = document.getElementById("completedTasks");
const highPriorityTasksElement =
    document.getElementById("highPriorityTasks");
const progressValueElement = document.getElementById("progressValue");
const progressWheel = document.getElementById("progressWheel");

let tasks = JSON.parse(localStorage.getItem("studyFlowTasks")) || [];
addTaskBtn.addEventListener("click", function () {
    const taskName = taskNameInput.value.trim();
    const subject = subjectInput.value.trim();
    const priority = priorityInput.value;
    const deadline = deadlineInput.value;

    if (
        taskName ==="" ||
        subject ==="" ||
        deadline ===""
    ) {
        alert("Please fill in all fields.");
        return;
    }
    const newTask = {
        id: Date.now(),
        name: taskName,
        subject: subject,
        priority: priority,
        deadline: deadline,
        completed: false
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateDashboard();
    clearForm();
});
function clearForm() {
    taskNameInput.value = "";
    subjectInput.value = "";
    deadlineInput.value = "";
    priorityInput.value = "high";

}
function saveTasks() {
    localStorage.setItem(
        "studyFlowTasks",
        JSON.stringify(tasks)
    );

}
function renderTasks() {
    const selectedFilter = taskFilter.value;
    let filteredTasks = tasks;
    if (selectedFilter === "pending") {
        filteredTasks = tasks.filter(function (task) {
            return task.completed === false;
        });
    }
    if (selectedFilter === "completed") {
        filteredTasks = tasks.filter(function (task) {
            return task.completed === true;
        });
    }
    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <div class="empty-state">
                <h3>No tasks here</h3>
                <p>
                    Add a task or change the current filter.
                </p>
            </div>
        `;
        return;
    }

    taskList.innerHTML = "";

    filteredTasks.forEach(function (task) {
        const taskCard = document.createElement("div");
        taskCard.classList.add("task-card");

        if (task.completed) {
            taskCard.classList.add("completed-task");
        }
        taskCard.innerHTML = `
            <div class="task-info">
                <span class="subject-tag">
                    ${task.subject}
                </span>

                <h3>
                    ${task.name}
                </h3>
                <div class="task-meta">
                    <span class="priority ${task.priority}">
                        ${task.priority}
                    </span>

                    <span>
                        Due ${formatDate(task.deadline)}
                    </span>

                </div>
            </div>


            <div class="task-actions">
                <button
                    class="complete-btn"
                    data-id="${task.id}"
                >
                    ${task.completed ? "Undo" : "Complete"}
                </button>
                <button
                    class="delete-btn"
                    data-id="${task.id}"
                >
                    Delete
                </button>
            </div>
        `;
        taskList.appendChild(taskCard);
    });

    addTaskButtonEvents();
}
function addTaskButtonEvents() {
    const completeButtons =
        document.querySelectorAll(".complete-btn");
     const deleteButtons =
        document.querySelectorAll(".delete-btn");

    completeButtons.forEach(function (button) {
        button.addEventListener("click", function () {
              const taskId =
                 Number(button.dataset.id);
            toggleTask(taskId);
        });

    });
    deleteButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const taskId=
                Number(button.dataset.id);
            deleteTask(taskId);
        });
    });

}
function toggleTask(taskId) {
    tasks = tasks.map(function (task) {
        if (task.id=== taskId) {
            return {
                   ...task,
                   completed: !task.completed
            };

        }

        return task;

    });
    saveTasks();
    renderTasks();
    updateDashboard();
}


function deleteTask(taskId) {
    tasks = tasks.filter(function (task) {
        return task.id !== taskId;

    });
    saveTasks();

    renderTasks();

    updateDashboard();
}

function updateDashboard() {

    const totalTasks = tasks.length;
    const completedTasks =
        tasks.filter(function (task) {
            return task.completed;
        }).length;
    const highPriorityTasks =
        tasks.filter(function (task) {
            return (
                task.priority === "high" &&
                !task.completed
            );
        }).length;

    let progress = 0;
    if (totalTasks > 0) {

        progress = Math.round(
            (completedTasks / totalTasks) * 100
        );

    }
    totalTasksElement.textContent =
        totalTasks;
    completedTasksElement.textContent =
        completedTasks;
    highPriorityTasksElement.textContent =
        highPriorityTasks;
    progressValueElement.textContent =
        progress + "%";


    updateProgressWheel(progress);
}

function updateProgressWheel(progress) {
    const degrees =
        progress * 3.6;
    progressWheel.style.background = `
        conic-gradient(
            #3c8d82 0deg ${degrees}deg,
            #dcebe8 ${degrees}deg 360deg
        )
    `;

}
function formatDate(dateString) {

    const date =
        new Date(dateString + "T00:00:00");

    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}
taskFilter.addEventListener(
    "change",
    function () {

        renderTasks();

    }
);
taskNameInput.addEventListener(
    "keydown",
    function (event) {
        if (event.key === "Enter") {
            addTaskBtn.click();

        }

    }
);
renderTasks();
updateDashboard();