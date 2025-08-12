// Eleman Seçimi
const form = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

// --- KALICI: Kaydetme & Yükleme (submit'in DIŞINDA) ---
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#task-list .task").forEach((li) => {
    tasks.push({
      text: li.childNodes[0].textContent.trim(), // ilk metin düğümü
      completed: li.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addButtons(li) {
  // Tamamlandı
  const completedBtn = document.createElement("button");
  completedBtn.type = "button";
  completedBtn.textContent = "Tamamlandı";
  completedBtn.style.marginRight = "8px";
  completedBtn.style.color = "white";
  completedBtn.style.background = "green";
  completedBtn.addEventListener("click", function (e) {
    li.classList.toggle("completed");
    saveTasks(); // <-- durum değişince kaydet
  });
  li.appendChild(completedBtn);

  // Sil
  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.textContent = "Sil";
  deleteBtn.style.marginLeft = "8px";
  deleteBtn.style.color = "white";
  deleteBtn.style.background = "red";
  deleteBtn.addEventListener("click", function () {
    li.remove();
    saveTasks(); // <-- silince kaydet
  });
  li.appendChild(deleteBtn);
}

function loadTasks() {
  const saved = JSON.parse(localStorage.getItem("tasks")) || [];
  saved.forEach((task) => {
    const li = document.createElement("li");
    li.classList.add("task");
    li.textContent = task.text;
    if (task.completed) li.classList.add("completed");
    addButtons(li);                // <-- butonları ekle
    taskList.appendChild(li);
  });
}

// Sayfa açılır açılmaz yükle
loadTasks();

// Form Submit Olduğunda Çalışacak Fonksiyon
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  // Görev elemanı oluştur
  const li = document.createElement("li");
  li.textContent = taskText;
  li.classList.add("task");

  // Butonları ekle
  addButtons(li);

  // Listeye ekle
  taskList.appendChild(li);

  // Input temizle
  taskInput.value = "";

  // Kaydet
  saveTasks();
});
