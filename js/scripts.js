//  elementos
const tarefaForm = document.querySelector("#tarefa-form");
const tarefaInput = document.querySelector("#tarefa-input");
const tarefaList = document.querySelector("#tarefa-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

const savetarefa = (text, done = 0, save = 1) => {
  const tarefa = document.createElement("div");
  tarefa.classList.add("tarefa");

  const tarefaTitle = document.createElement("h3");
  tarefaTitle.innerText = text;
  tarefa.appendChild(tarefaTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-tarefa");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  tarefa.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-tarefa");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  tarefa.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-tarefa");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  tarefa.appendChild(deleteBtn);

  
  if (done) {
    tarefa.classList.add("done");
  }

  if (save) {
    savetarefaLocalStorage({ text, done: 0 });
  }

  tarefaList.appendChild(tarefa);

  tarefaInput.value = "";
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  tarefaForm.classList.toggle("hide");
  tarefaList.classList.toggle("hide");
};

const updatetarefa = (text) => {
  const tarefas = document.querySelectorAll(".tarefa");

  tarefas.forEach((tarefa) => {
    let tarefaTitle = tarefa.querySelector("h3");

    if (tarefaTitle.innerText === oldInputValue) {
      tarefaTitle.innerText = text;

     
      updatetarefaLocalStorage(oldInputValue, text);
    }
  });
};

const getSearchedtarefas = (search) => {
  const tarefas = document.querySelectorAll(".tarefa");

  tarefas.forEach((tarefa) => {
    const tarefaTitle = tarefa.querySelector("h3").innerText.toLowerCase();

    tarefa.style.display = "flex";

    console.log(tarefaTitle);

    if (!tarefaTitle.includes(search)) {
      tarefa.style.display = "none";
    }
  });
};

const filtertarefas = (filterValue) => {
  const tarefas = document.querySelectorAll(".tarefa");

  switch (filterValue) {
    case "all":
      tarefas.forEach((tarefa) => (tarefa.style.display = "flex"));

      break;

    case "done":
      tarefas.forEach((tarefa) =>
        tarefa.classList.contains("done")
          ? (tarefa.style.display = "flex")
          : (tarefa.style.display = "none")
      );

      break;

    case "tarefa":
      tarefas.forEach((tarefa) =>
        !tarefa.classList.contains("done")
          ? (tarefa.style.display = "flex")
          : (tarefa.style.display = "none")
      );

      break;

    default:
      break;
  }
};

// Eventos
tarefaForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = tarefaInput.value;

  if (inputValue) {
    savetarefa(inputValue);
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let tarefaTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    tarefaTitle = parentEl.querySelector("h3").innerText || "";
  }

  if (targetEl.classList.contains("finish-tarefa")) {
    parentEl.classList.toggle("done");

    updatetarefaStatusLocalStorage(tarefaTitle);
  }

  if (targetEl.classList.contains("remove-tarefa")) {
    parentEl.remove();

    
    removetarefaLocalStorage(tarefaTitle);
  }

  if (targetEl.classList.contains("edit-tarefa")) {
    toggleForms();

    editInput.value = tarefaTitle;
    oldInputValue = tarefaTitle;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    updatetarefa(editInputValue);
  }

  toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;

  getSearchedtarefas(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";

  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;

  filtertarefas(filterValue);
});


const gettarefasLocalStorage = () => {
  const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

  return tarefas;
};

const loadtarefas = () => {
  const tarefas = gettarefasLocalStorage();

  tarefas.forEach((tarefa) => {
    savetarefa(tarefa.text, tarefa.done, 0);
  });
};

const savetarefaLocalStorage = (tarefa) => {
  const tarefas = gettarefasLocalStorage();

  tarefas.push(tarefa);

  localStorage.setItem("tarefas", JSON.stringify(tarefas));
};

const removetarefaLocalStorage = (tarefaText) => {
  const tarefas = gettarefasLocalStorage();

  const filteredtarefas = tarefas.filter((tarefa) => tarefa.text != tarefaText);

  localStorage.setItem("tarefas", JSON.stringify(filteredtarefas));
};

const updatetarefaStatusLocalStorage = (tarefaText) => {
  const tarefas = gettarefasLocalStorage();

  tarefas.map((tarefa) =>
    tarefa.text === tarefaText ? (tarefa.done = !tarefa.done) : null
  );

  localStorage.setItem("tarefas", JSON.stringify(tarefas));
};

const updatetarefaLocalStorage = (tarefaOldText, tarefaNewText) => {
  const tarefas = gettarefasLocalStorage();

  tarefas.map((tarefa) =>
    tarefa.text === tarefaOldText ? (tarefa.text = tarefaNewText) : null
  );

  localStorage.setItem("tarefas", JSON.stringify(tarefas));
};

loadtarefas();
