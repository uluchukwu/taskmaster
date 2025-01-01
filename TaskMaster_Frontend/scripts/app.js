document.addEventListener("DOMContentLoaded", function () {
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskModal = document.getElementById("task-modal");
    const closeModal = document.getElementById("close-modal");
    const taskForm = document.getElementById("task-form");
    const taskList = document.querySelector(".task-list");

    let editingTaskId = null;  // To keep track of the task being edited

    function showToast(message, type = "success") {
        const toastContainer = document.getElementById("toast-container");
    
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.innerText = message;
    
        toastContainer.appendChild(toast);
    
        setTimeout(() => {
            toast.remove();
        }, 4000); 
    }
    

    // Open modal for creating a new task
    addTaskBtn.addEventListener("click", () => {
        taskModal.style.display = "flex";
        taskForm.reset(); 
        editingTaskId = null;  // Clear any existing task ID (indicating new task)
    });

    // Close modal
    closeModal.addEventListener("click", () => {
        taskModal.style.display = "none";
    });

    // Form submission for adding or updating a task
    taskForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = document.getElementById("task-title").value;
        const description = document.getElementById("task-description").value;
        const priority = document.getElementById("task-priority").value;
        const deadline = document.getElementById("task-deadline").value;
        const status = document.getElementById("task-status").value;

        const taskData = {
            title,
            description,
            priority,
            deadline,
            status
        };

        if (editingTaskId) {
            // If there's an editing task ID, send a PUT request to update the existing task
            const updateResponse = await fetch(
                `https://taskmaster-9drx.onrender.com/api/taskmanager/tasks/${editingTaskId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(taskData),
                }
            );

            if (updateResponse.ok) {
                // Fetch the updated task from the server
                const fetchResponse = await fetch(`https://taskmaster-9drx.onrender.com/api/taskmanager/tasks/${editingTaskId}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });
            
                if (!fetchResponse.ok) {
                    showToast("Failed to fetch updated task details.", "error");
                    return;
                }
            
                const updatedTask = await fetchResponse.json();
            
                // Locate and update the task card
                const taskCard = document.querySelector(`.task-card[data-id="${editingTaskId}"]`);
                if (taskCard) {
                    // Update text content
                    taskCard.querySelector(".task-title").innerText = updatedTask.title;
                    taskCard.querySelector(".task-description").innerText = updatedTask.description;
            
                    // Update Status
                    const statusElement = taskCard.querySelector(".task-status");
                    statusElement.innerText = updatedTask.status;
            
                    // Remove old status classes and add the new one
                    statusElement.classList.remove("inprogress", "completed", "cancelled");
                    const statusClass =
                        updatedTask.status === "In progress"
                            ? "inprogress"
                            : updatedTask.status === "Completed"
                            ? "completed"
                            : "cancelled";
                    statusElement.classList.add(statusClass);
            
                    // Update Priority
                    const priorityElement = taskCard.querySelector(".task-priority");
                    priorityElement.innerText = updatedTask.priority;
            
                    // Remove old priority classes and add the new one
                    priorityElement.classList.remove("low", "medium", "high");
                    const priorityClass =
                        updatedTask.priority === "low"
                            ? "low"
                            : updatedTask.priority === "medium"
                            ? "medium"
                            : "high";
                    priorityElement.classList.add(priorityClass);
            
                    // Update Deadline
                    taskCard.querySelector(".task-deadline").innerText = `Due: ${new Date(
                        updatedTask.deadline
                    ).toLocaleDateString()}`;
                }
            
                // Close the modal and show a success message
                taskModal.style.display = "none";
                showToast("Task Updated Successfully.", "success");
            } else {
                showToast(fetchResponse.message || "Failed to update task.", "error");
            }
            
            
            
        } else {
            // If there's no editing task ID, send a POST request to create a new task
            const createResponse = await fetch(
                "https://taskmaster-9drx.onrender.com/api/taskmanager/tasks",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(taskData),
                }
            );
            
            if (createResponse.ok) {
            
                taskModal.style.display = "none";
            
                loadTasks()
            
                showToast("Task added successfully.", "success");
            } else {
                showToast(createResponse.message || "Failed to add task.", "error");
            }
            
        }
    });

    // Loading tasks from the server
    const loadTasks = async () => {
        const response = await fetch(
            "https://taskmaster-9drx.onrender.com/api/taskmanager/tasks",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        );
        const tasks = await response.json();
        renderTasks(tasks);
    };

    // Function to render tasks in the task list
    const renderTasks = (tasks) => {
        taskList.innerHTML = "";  
    
        if (tasks.length === 0) {
            taskList.innerHTML = "<h1 class='no_task'>No Task Record Found!</h1>";
            return;
        }
    
        tasks.forEach((task, index) => {
            const taskCard = document.createElement("div");
            taskCard.classList.add("task-card");
            taskCard.setAttribute("data-id", task._id); // Set a data-id attribute for identification
    
            let status_color =
                task.status === "In progress"
                    ? "inprogress"
                    : task.status === "Completed"
                    ? "completed"
                    : task.status === "Cancelled"
                    ? "cancelled"
                    : "";
            let priority_color =
                task.priority === "high"
                    ? "high"
                    : task.priority === "medium"
                    ? "medium"
                    : task.priority === "low"
                    ? "low"
                    : "";
    
            // Build user info section if the user is admin
            let userInfoSection = "";
            if (task.createdBy.role === "admin") {
                userInfoSection = `
                    <div class="user-info">
                        <div class="user-icon">
                            <i class="fa-solid fa-user"></i>
                        </div>
                        <p class="username">${task.createdBy.username}</p>
                    </div>
                `;
            }
    
            taskCard.innerHTML = `
                <div class="task-header">
                    ${userInfoSection}  
                    <div class="task-head-head">
                        <h1>Task ${index + 1}</h1>
                        <span class="task-status ${status_color}">${task.status}</span>
                    </div>
                    <h3 class="task-title">${task.title}</h3>
                </div>
                <p class="task-description">${task.description}</p>
                <div class="task-footer">
                    <div class="task-meta">
                        <span class="task-priority ${priority_color}">${task.priority}</span>
                        <span class="task-deadline">Due: ${new Date(task.deadline).toLocaleDateString()}</span>
                    </div>
                    <div class="task-actions">
                        <button class="edit-task-btn" data-id="${task._id}">Edit</button>
                        <button class="delete-task-btn" data-id="${task._id}">Delete</button>
                    </div>
                </div>
            `;
    
            taskList.appendChild(taskCard);
        });
    };
    
    

    // Event listener for edit button
    taskList.addEventListener("click", async (e) => {
        if (e.target.classList.contains("edit-task-btn")) {
            const taskId = e.target.getAttribute("data-id");

            const response = await fetch(`https://taskmaster-9drx.onrender.com/api/taskmanager/tasks/${taskId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (response.ok) {
                const task = await response.json();

                // Populate the form with existing task data
                document.getElementById("task-title").value = task.title;
                document.getElementById("task-description").value = task.description;
                document.getElementById("task-priority").value = task.priority;
                document.getElementById("task-deadline").value = new Date(task.deadline).toISOString().slice(0, 10);
                document.getElementById("task-status").value = task.status;

                taskModal.style.display = "flex";

                // Set the editing task ID
                editingTaskId = taskId;
            }
        }
    });


    const deleteTaskModal = document.getElementById("delete-task-modal");
    const deleteTaskConfirm = document.getElementById("delete-task-confirm");
    const deleteTaskCancel = document.getElementById("delete-task-cancel");

    let taskToDeleteId = null

    // Event listener for delete button
    taskList.addEventListener("click", async (e) => {
        if (e.target.classList.contains("delete-task-btn")) {
            const taskId = e.target.getAttribute("data-id");

            taskToDeleteId = taskId

            deleteTaskModal.style.display = "flex"
        }
    });

    // Confirm task deletion
    deleteTaskConfirm.addEventListener("click", async () => {
        const response = await fetch(`https://taskmaster-9drx.onrender.com/api/taskmanager/tasks/${taskToDeleteId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (response.ok) {
            // Hide the modal and remove the task from the UI
            deleteTaskModal.style.display = "none";
            document.querySelector(`.task-card[data-id="${taskToDeleteId}"]`).remove();
            showToast("Task deleted successfully", "success");
        } else {
            showToast(response.message || "Failed to delete task", "error");
        }
    });

    // Cancel task deletion
    deleteTaskCancel.addEventListener("click", () => {
        // Close the modal without deleting
        deleteTaskModal.style.display = "none";
    });


    // Task filters
    const searchBar = document.getElementById("search-bar");
    const priorityFilter = document.getElementById("priority-filter");
    const deadlineFilter = document.getElementById("deadline-filter");

  // Searching tasks by title or descritpion

  searchBar.addEventListener("input", () => {
    const searchQuery = searchBar.value.toLowerCase();
    const tasks = [...taskList.children];
    tasks.forEach((task) => {
        const taskTitle = task
            .querySelector(".task-title")
            .innerText.toLowerCase();
        const taskDescription = task
            .querySelector(".task-description")
            .innerText.toLowerCase();

        if (
            taskTitle.includes(searchQuery) ||
            taskDescription.includes(searchQuery)
        ) {
            task.style.display = "block";
        } else {
            task.style.display = "none";
        }
    });
});

// Filter tasks by priority
priorityFilter.addEventListener("change", () => {
    const priorityValue = priorityFilter.value.toLowerCase();
    const tasks = [...taskList.children];
    tasks.forEach((task) => {
        const taskPriority = task
            .querySelector(".task-footer span:first-child")
            .innerText.toLowerCase();
        if (priorityValue === "" || taskPriority === priorityValue) {
            task.style.display = "block";
        } else {
            task.style.display = "none";
        }
    });
});

// Filter tasks by deadline
deadlineFilter.addEventListener("change", () => {
    const deadlineValue = deadlineFilter.value;
    const tasks = [...taskList.children];
    tasks.forEach((task) => {
        const taskDeadline = task.querySelector(
            ".task-footer span:last-child"
        ).innerText;
        if (
            deadlineValue === "" ||
            new Date(taskDeadline) <= new Date(deadlineValue)
        ) {
            task.style.display = "block";
        } else {
            task.style.display = "none";
        }
    });
});


    // Initial load of tasks when the page is loaded
    loadTasks();
});
