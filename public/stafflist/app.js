const defaultRoles = [
  "Режиссер-постановщик",
  "Второй режиссер",
  "Оператор-постановщик",
  "Монтажер",
  "Звукорежиссер",
  "Моушн-дизайнер",
  "Продюсер",
  "Сценарист"
];

const demoCsv = `Имя
Иван Иванов
Петр Петров
Алексей Смирнов
Мария Волкова
Дмитрий Орлов
Елена Морозова`;

const state = {
  members: [],
  roles: defaultRoles.map((title, index) => ({ id: index + 1, title, person: "", custom: false })),
  nextRoleId: defaultRoles.length + 1
};

const elements = {
  dropZone: document.querySelector("#drop-zone"),
  csvInput: document.querySelector("#csv-input"),
  csvText: document.querySelector("#csv-text"),
  rolesList: document.querySelector("#roles-list"),
  previewLines: document.querySelector("#preview-lines"),
  memberCount: document.querySelector("#member-count"),
  assignedCount: document.querySelector("#assigned-count"),
  rosterStatus: document.querySelector("#roster-status"),
  exportButton: document.querySelector("#export-docx"),
  copyButton: document.querySelector("#copy-preview"),
  toast: document.querySelector("#toast")
};

function parsePeople(csvText) {
  const result = Papa.parse(csvText.trim(), { skipEmptyLines: true });
  const rows = result.data
    .map((row) => Array.isArray(row) ? String(row[0] ?? "").trim() : String(row).trim())
    .filter(Boolean);

  if (!rows.length) return [];
  const first = rows[0].toLocaleLowerCase();
  const headerWords = ["name", "имя", "фио", "full name", "участник", "person"];
  const hasHeader = headerWords.some((word) => first === word || first.includes(word));
  return [...new Set((hasHeader ? rows.slice(1) : rows).filter((name) => name.length > 0))];
}

function loadMembers(csvText, sourceLabel) {
  try {
    const members = parsePeople(csvText);
    if (!members.length) throw new Error("empty");
    state.members = members;
    state.roles = state.roles.map((role) => ({ ...role, person: members.includes(role.person) ? role.person : "" }));
    render();
    elements.rosterStatus.textContent = `${sourceLabel}: список готов к назначению.`;
    showToast(`Загружено: ${members.length} ${pluralizePeople(members.length)}`);
  } catch {
    elements.rosterStatus.textContent = "Не удалось найти имена. Проверьте формат CSV.";
    showToast("Проверьте данные CSV");
  }
}

function pluralizePeople(count) {
  if (count % 10 === 1 && count % 100 !== 11) return "человек";
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return "человека";
  return "человек";
}

function render() {
  renderRoles();
  renderPreview();
  elements.memberCount.textContent = `${state.members.length} ${pluralizePeople(state.members.length)}`;
}

function renderRoles() {
  elements.rolesList.replaceChildren();
  state.roles.forEach((role) => {
    const row = document.createElement("div");
    row.className = "role-row";
    row.dataset.roleId = role.id;

    const title = document.createElement("span");
    title.className = "role-name";
    title.textContent = role.title;

    const select = document.createElement("select");
    select.setAttribute("aria-label", `Участник для роли ${role.title}`);
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "— Не выбрано —";
    select.append(placeholder);
    state.members.forEach((member) => {
      const option = document.createElement("option");
      option.value = member;
      option.textContent = member;
      option.selected = member === role.person;
      select.append(option);
    });
    select.addEventListener("change", () => {
      role.person = select.value;
      renderPreview();
    });

    const clearButton = document.createElement("button");
    clearButton.className = "clear-role";
    clearButton.type = "button";
    clearButton.title = "Очистить назначение";
    clearButton.setAttribute("aria-label", `Очистить роль ${role.title}`);
    clearButton.textContent = "×";
    clearButton.addEventListener("click", () => {
      role.person = "";
      renderRoles();
      renderPreview();
    });

    row.append(title, select);
    if (role.custom) {
      const removeButton = document.createElement("button");
      removeButton.className = "remove-role";
      removeButton.type = "button";
      removeButton.title = "Удалить роль";
      removeButton.setAttribute("aria-label", `Удалить роль ${role.title}`);
      removeButton.textContent = "−";
      removeButton.addEventListener("click", () => {
        state.roles = state.roles.filter((item) => item.id !== role.id);
        render();
      });
      row.append(clearButton, removeButton);
    } else {
      row.append(clearButton);
    }
    elements.rolesList.append(row);
  });
}

function renderPreview() {
  const assigned = state.roles.filter((role) => role.person);
  elements.previewLines.replaceChildren();
  if (!assigned.length) {
    const empty = document.createElement("span");
    empty.className = "empty-preview";
    empty.innerHTML = "Назначьте хотя бы одну роль,<br>и она появится здесь.";
    elements.previewLines.append(empty);
  } else {
    assigned.forEach((role) => {
      const line = document.createElement("div");
      line.className = "preview-line";
      const roleName = document.createElement("strong");
      roleName.textContent = role.title;
      const dash = document.createElement("span");
      dash.className = "dash";
      dash.textContent = " — ";
      line.append(roleName, dash, document.createTextNode(role.person));
      elements.previewLines.append(line);
    });
  }
  elements.assignedCount.textContent = `${assigned.length} назначено`;
  elements.exportButton.disabled = assigned.length === 0;
  elements.copyButton.disabled = assigned.length === 0;
}

function previewText() {
  const lines = state.roles.filter((role) => role.person).map((role) => `${role.title} — ${role.person}`);
  return ["СПИСОК СЪЕМОЧНОЙ ГРУППЫ", "", ...lines].join("\n");
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => elements.toast.classList.remove("show"), 2300);
}

function todayString() {
  return new Intl.DateTimeFormat("en-CA").format(new Date());
}

function exportDocx() {
  const assigned = state.roles.filter((role) => role.person);
  if (!assigned.length || !window.docx || !window.saveAs) return;
  const { Document, HeadingLevel, Packer, Paragraph, TextRun, AlignmentType } = window.docx;
  const children = [
    new Paragraph({
      text: "СПИСОК УЧАСТНИКОВ",
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 420 },
      run: { bold: true, color: "102525", size: 32, font: "Calibri" }
    }),
    ...assigned.map((role) => new Paragraph({
      spacing: { line: 276, after: 110 },
      children: [
        new TextRun({ text: role.title, bold: true, font: "Calibri", size: 24, color: "102525" }),
        new TextRun({ text: ` — ${role.person}`, font: "Calibri", size: 24, color: "263b37" })
      ]
    }))
  ];
  const document = new Document({ sections: [{ properties: {}, children }] });
  Packer.toBlob(document).then((blob) => {
    saveAs(blob, `Credits_List_${todayString()}.docx`);
    showToast("Документ Word создан");
  });
}

async function copyPreview() {
  if (elements.copyButton.disabled) return;
  try {
    await navigator.clipboard.writeText(previewText());
    showToast("Скопировано!");
  } catch {
    showToast("Не удалось скопировать");
  }
}

document.querySelector("#choose-file").addEventListener("click", () => elements.csvInput.click());
elements.csvInput.addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => loadMembers(reader.result, file.name);
  reader.readAsText(file, "UTF-8");
});

elements.dropZone.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") elements.csvInput.click();
});
["dragenter", "dragover"].forEach((eventName) => elements.dropZone.addEventListener(eventName, (event) => {
  event.preventDefault();
  elements.dropZone.classList.add("is-dragging");
}));
["dragleave", "drop"].forEach((eventName) => elements.dropZone.addEventListener(eventName, (event) => {
  event.preventDefault();
  elements.dropZone.classList.remove("is-dragging");
}));
elements.dropZone.addEventListener("drop", (event) => {
  const [file] = event.dataTransfer.files;
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => loadMembers(reader.result, file.name);
  reader.readAsText(file, "UTF-8");
});

document.querySelector("#load-paste").addEventListener("click", () => loadMembers(elements.csvText.value, "Вставленные данные"));
document.querySelector("#load-demo").addEventListener("click", () => {
  elements.csvText.value = demoCsv;
  loadMembers(demoCsv, "Демо-данные");
});
document.querySelector("#add-role-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#new-role");
  const title = input.value.trim();
  if (!title) return input.focus();
  state.roles.push({ id: state.nextRoleId++, title, person: "", custom: true });
  input.value = "";
  render();
});
elements.copyButton.addEventListener("click", copyPreview);
elements.exportButton.addEventListener("click", exportDocx);

render();
