const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  alert("Your browser does not support Speech Recognition. Use Google Chrome.");
} else {
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';

  const taskList = document.getElementById('taskList');
  const startBtn = document.getElementById('start-btn');

  // Load saved tasks on page load
  window.onload = function () {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => addTaskToUI(task));
  };

  // Start listening
  startBtn.addEventListener('click', () => {
    recognition.start();
  });

  recognition.onstart = () => {
    startBtn.textContent = " Listening...";
    startBtn.disabled = true;
  };

  recognition.onend = () => {
    startBtn.textContent = " Start Listening";
    startBtn.disabled = false;
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    console.log("You said:", transcript);

    if (transcript.startsWith("add")) {
      const task = transcript.replace("add", "").trim();
      if (task.length > 0) {
        addTask(task);
      }
    } else if (transcript.startsWith("delete")) {
      const task = transcript.replace("delete", "").trim();
      if (task.length > 0) {
        deleteTask(task);
      }
    } else {
      alert("Please say 'Add [task]' or 'Delete [task]'");
    }
  };

  function addTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    addTaskToUI(task);
  }

  function addTaskToUI(task) {
    const li = document.createElement("li");
    li.textContent = task;
    taskList.appendChild(li);
  }

  function deleteTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let index = tasks.findIndex(t => t.toLowerCase() === task.toLowerCase());

    if (index !== -1) {
      tasks.splice(index, 1);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      refreshUI(tasks);
    } else {
      alert(`Task "${task}" not found.`);
    }
  }

  function refreshUI(tasks) {
    taskList.innerHTML = "";
    tasks.forEach(task => addTaskToUI(task));
  }
}
// Theme Toggle Logic
const toggleBtn = document.getElementById("theme-toggle");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
