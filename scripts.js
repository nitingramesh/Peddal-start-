document.addEventListener("DOMContentLoaded", () => {
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskModal = document.getElementById("task-modal");
  const taskDetailModal = document.getElementById("task-detail-modal");
  const closeModalBtn = document.querySelector(".close-btn");
  const closeDetailModalBtn = document.querySelector(".close-detail-btn");
  const taskForm = document.getElementById("task-form");
  const taskList = document.getElementById("task-list");
  const taskDetails = document.getElementById("task-details");
  const editTaskBtn = document.getElementById("edit-task-btn");
  const deleteTaskBtn = document.getElementById("delete-task-btn");

  const apiUrl = "http://localhost:3000/tasks";
  let isEditing = false;
  let editingTaskId = null;

  // Show the modal to add a new task
  addTaskBtn.addEventListener("click", () => {
    taskModal.style.display = "block";
    isEditing = false;
    taskForm.reset();
    document.getElementById("modal-title").textContent = "Add Task";
  });

  // Close the modal
  closeModalBtn.addEventListener("click", () => {
    taskModal.style.display = "none";
  });

  // Close the detail modal
  closeDetailModalBtn.addEventListener("click", () => {
    taskDetailModal.style.display = "none";
  });

  // Load tasks from the server
  function loadTasks() {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((tasks) => {
        taskList.innerHTML = "";
        tasks.forEach((task) => {
          const taskItem = document.createElement("div");
          taskItem.className = "task-item";
          taskItem.dataset.id = task.id;
          taskItem.innerHTML = `
              <h3>${task.title}</h3>
              <p>${task.description}</p>
              <p>Due Date: ${task.due_date}</p>
            `;
          taskList.appendChild(taskItem);
        });
      })
      .catch((error) => console.error("Error loading tasks:", error));
  }

  loadTasks();

  // Submit the task (either add new or update existing)
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-desc").value;
    const dueDate = document.getElementById("task-date").value;

    const taskData = { title, description, due_date: dueDate };

    if (isEditing) {
      fetch(`${apiUrl}/${editingTaskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })
        .then((response) => response.json())
        .then(() => {
          loadTasks();
          taskForm.reset();
          taskModal.style.display = "none";
          isEditing = false;
          editingTaskId = null;
        })
        .catch((error) => console.error("Error updating task:", error));
    } else {
      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })
        .then((response) => response.json())
        .then(() => {
          loadTasks();
          taskForm.reset();
          taskModal.style.display = "none";
        })
        .catch((error) => console.error("Error adding task:", error));
    }
  });

  // Handle task item click to view details
  taskList.addEventListener("click", (e) => {
    const taskItem = e.target.closest(".task-item");
    if (taskItem) {
      const id = taskItem.dataset.id;
      fetch(`${apiUrl}/${id}`)
        .then((response) => response.json())
        .then((task) => {
          taskDetails.innerHTML = `
              <h3>${task.title}</h3>
              <p>${task.description}</p>
              <p>Due Date: ${task.due_date}</p>
            `;
          taskDetailModal.style.display = "block";
          editingTaskId = id;
        })
        .catch((error) => console.error("Error fetching task details:", error));
    }
  });

  // Edit task from details modal
  editTaskBtn.addEventListener("click", () => {
    fetch(`${apiUrl}/${editingTaskId}`)
      .then((response) => response.json())
      .then((task) => {
        document.getElementById("task-title").value = task.title;
        document.getElementById("task-desc").value = task.description;
        document.getElementById("task-date").value = task.due_date;
        taskDetailModal.style.display = "none";
        taskModal.style.display = "block";
        isEditing = true;
      })
      .catch((error) =>
        console.error("Error fetching task for editing:", error)
      );
  });

  // Delete task from details modal
  deleteTaskBtn.addEventListener("click", () => {
    fetch(`${apiUrl}/${editingTaskId}`, {
      method: "DELETE",
    })
      .then(() => {
        loadTasks();
        taskDetailModal.style.display = "none";
      })
      .catch((error) => console.error("Error deleting task:", error));
  });
});
