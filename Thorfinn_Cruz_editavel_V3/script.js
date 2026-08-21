const THORFINN_ACCESS_KEY = "heresia-thorfinn-access";
const THORFINN_ACCESS_SALT = "heresia:thorfinn-cruz:v3:";
const THORFINN_ACCESS_HASH = "e7429131";

function thorfinnSimpleHash(value) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

function unlockThorfinn() {
  const gate = document.getElementById("passwordGate");
  if (gate) gate.hidden = true;
  document.documentElement.classList.remove("thorfinn-locked");
}

function initThorfinnPasswordGate() {
  const gate = document.getElementById("passwordGate");
  const form = document.getElementById("passwordForm");
  const input = document.getElementById("passwordInput");
  const error = document.getElementById("passwordError");

  if (!gate || !form || !input) {
    document.documentElement.classList.remove("thorfinn-locked");
    return;
  }

  if (sessionStorage.getItem(THORFINN_ACCESS_KEY) === "ok") {
    unlockThorfinn();
    return;
  }

  requestAnimationFrame(() => input.focus());

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    error.textContent = "";

    const attempt = thorfinnSimpleHash(THORFINN_ACCESS_SALT + input.value);

    if (attempt === THORFINN_ACCESS_HASH) {
      sessionStorage.setItem(THORFINN_ACCESS_KEY, "ok");
      input.value = "";
      unlockThorfinn();
    } else {
      error.textContent = "Senha incorreta.";
      input.select();
    }
  });
}

document.addEventListener("DOMContentLoaded", initThorfinnPasswordGate);

const STORAGE_KEY = "thorfinn-cruz-sheet-v3";

const defaultData = {
  bio: "Thorfinn Cruz é uma Pessoa-Vetor portador do Vetor Inviolável, com a habilidade de Impermeabilidade. Um homem cis branco de 24 anos, 1,75cm e 80kg.",
  defenses: "Contra-ataque, Bloqueio e Esquiva",
  skills: "Atletismo, Exploração, Luta corpo a corpo, Diplomacia e Sobrevivência (2D12 + ATRIBUTO).",
  skillFailures: "Crime, Medicina, Tecnologia, Ciências e Adestramento (1D10).",

  stats: {
    life: { label: "VIDA", current: 45, max: 45, color: "navy" },
    sanity: { label: "SANIDADE", current: 47, max: 60, color: "gold" },
    reputation: { label: "REPUTAÇÃO", current: 24, max: 24, color: "gold" },
    radiation: { label: "DESBLOQ.<br>NO ATO II", current: 5, min: 0, max: 100, color: "red" }
  },

  attributes: {
    strength: { label: "FORÇA", value: 3 },
    intelligence: { label: "INT.", value: 2 },
    dexterity: { label: "DESTREZA", value: 2 },
    credibility: { label: "CRED.", value: 2 },
    performance: { label: "PERF.", value: 5 },
    constitution: { label: "CONST.", value: 3 },
    perception: { label: "PERCEPÇÃO", value: 3 }
  },

  carry: { current: 4, max: 10 },

  possessions: [
    { item: "Paralaxe", tag: "Afiação e\nbatizada", damage: "2D4 + FORÇA\n2D6 + FORÇA", weight: "2" },
    { item: "Roupas\nEspeciais", tag: "", damage: "-", weight: "2" }
  ],

  vector: {
    tag: "Vetor Inviolável",
    title: "INTANGIBILIDADE",
    description: "Inviolável é o Vetor da intangibilidade absoluta. Ele altera sua interação com a matéria, permitindo que todas as partículas do usuário atravessem outras partículas sem gerar colisão. Cientificamente, o Vetor manipula temporariamente as forças eletromagnéticas responsáveis pela repulsão entre átomos, fazendo com que o corpo deixe de interagir fisicamente com o ambiente."
  },

  talents: [
    "Capacidade de se tornar intangível por um período de tempo.",
    "Capacidade de tornar intangível apenas uma parte do corpo.",
    "Ao se intangibilizar, atravessa paredes e estruturas.",
    "Resistir a ataques ao se intangiblizar."
  ],

  limitations: [
    "Objetos e roupas não-trabalhadas não se intangibilizam juntos.",
    "Perda de visão, audição, olfato e oxigênio ao se intangibilizar.",
    "Pela falta de oxigênio, não é possível permanecer intangível por muito tempo.",
    "Não é possível tornar outras pessoas intangíveis."
  ],

  failures: [
    "A intangiblidade não acontece.",
    "Há perda psicológica temporária de um membro.",
    "O Vetor é encerrado antes do esperado pelo portador.",
    "O usuário fica preso parcialmente dentro de um obstáculo.",
    "Uma região permanece intangível por mais tempo que o desejado.",
    "O portador fica imóvel por alguns turnos.",
    "O portador recebe o dano de ficar sem respirar por esse período.",
    "Retormar sem os sentidos."
  ],

  actions: [
    { action: "Testes de Atributos", roll: "1D12 + ATRIBUTO", dt: "7" },
    { action: "Testes de Arma", roll: "1D20 + 5 (POSSE)", dt: "11" },
    { action: "Testes de Vetor", roll: "2D20 + 5", dt: "11" },
    { action: "Testes de Esquiva", roll: "1D12 + 2 + 5", dt: "7" },
    { action: "Testes de Contra-ataque", roll: "1D12 + 2", dt: "7" },
    { action: "Testes de Bloqueio", roll: "1D12 + 3", dt: "7" }
  ],

  combos: [
    { action: "Combo 1", damage: "—", dt: "—" }
  ]
};

let data = loadData();
let editMode = false;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeData(raw) {
  const base = clone(defaultData);
  const merged = Object.assign(base, raw || {});
  merged.stats = Object.assign({}, base.stats, raw?.stats || {});
  merged.attributes = Object.assign({}, base.attributes, raw?.attributes || {});
  merged.carry = Object.assign({}, base.carry, raw?.carry || {});

  const rad = merged.stats.radiation || {};
  const rawCurrent = rad.current;
  if (typeof rawCurrent === "string") {
    const cleaned = rawCurrent.trim();
    const num = Number(cleaned.replace('%',''));
    rad.current = cleaned === '' || cleaned.toLowerCase() === 'nan' || cleaned.toLowerCase() === 'nan%' || !Number.isFinite(num) ? 5 : num;
  } else if (!Number.isFinite(rawCurrent)) {
    rad.current = 5;
  }
  merged.stats.radiation = rad;
  return merged;
}

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? normalizeData(JSON.parse(saved)) : clone(defaultData);
  } catch {
    return clone(defaultData);
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getPath(path) {
  return path.split(".").reduce((obj, key) => obj?.[key], data);
}

function setPath(path, value) {
  const parts = path.split(".");
  const last = parts.pop();
  const target = parts.reduce((obj, key) => obj[key], data);
  target[last] = value;
  saveData();
}

function hexSvg(className = "outline") {
  return `<svg viewBox="0 0 100 116" aria-hidden="true">
    <polygon class="${className}" points="50,2 98,29 98,87 50,114 2,87 2,29"></polygon>
  </svg>`;
}

function renderMainStats() {
  const el = document.getElementById("mainStats");
  const defs = [
    ["life", data.stats.life],
    ["sanity", data.stats.sanity],
    ["reputation", data.stats.reputation],
    ["radiation", data.stats.radiation]
  ];

  el.innerHTML = defs.map(([key, stat]) => {
    const isRadiation = key === "radiation";
    const fillClass = `fill-${stat.color}`;
    const shown = isRadiation
      ? (Number.isFinite(stat.current) ? `${stat.current}%` : `${stat.current || "XXX"}`)
      : `${stat.current}/${stat.max}`;
    return `
      <div class="stat-card ${isRadiation ? "radiation" : ""}">
        <div class="hex-control">
          ${hexSvg(fillClass)}
          <button class="stepper minus" type="button" data-stat="${key}" data-delta="-1">‹</button>
          <span class="value">${shown}</span>
          <button class="stepper plus-step" type="button" data-stat="${key}" data-delta="1">›</button>
        </div>
        <span class="stat-label">${stat.label}</span>
      </div>`;
  }).join("");
}

function renderAttributes() {
  const el = document.getElementById("attributesGrid");
  const ordered = [
    ["strength", data.attributes.strength],
    ["intelligence", data.attributes.intelligence],
    ["dexterity", data.attributes.dexterity],
    ["credibility", data.attributes.credibility],
    ["performance", data.attributes.performance],
    ["constitution", data.attributes.constitution]
  ];

  el.innerHTML = ordered.map(([key, attr]) => `
    <div class="attr-card">
      <div class="attr-hex">
        ${hexSvg("outline")}
        <button class="stepper minus" type="button" data-attr="${key}" data-delta="-1">‹</button>
        <span class="attr-value">${attr.value}</span>
        <button class="stepper plus-step" type="button" data-attr="${key}" data-delta="1">›</button>
      </div>
      <span class="attr-label">${attr.label}</span>
    </div>
  `).join("") + `
    <div class="carry-card">
      CARGA:&nbsp;<b>
        <span class="editable-text" data-bind="carry.current">${data.carry.current}</span>/<span class="editable-text" data-bind="carry.max">${data.carry.max}</span>
      </b>
    </div>
    <div class="attr-card perception-card">
      <div class="attr-hex">
        ${hexSvg("outline")}
        <button class="stepper minus" type="button" data-attr="perception" data-delta="-1">‹</button>
        <span class="attr-value">${data.attributes.perception.value}</span>
        <button class="stepper plus-step" type="button" data-attr="perception" data-delta="1">›</button>
      </div>
      <span class="attr-label">${data.attributes.perception.label}</span>
    </div>
  `;
}

function renderPossessions() {
  const table = document.getElementById("possessionsTable");
  table.innerHTML = `
    <div class="head">Item</div><div class="head">Dano</div><div class="head">Peso</div><div></div>
    ${data.possessions.map((row, i) => `
      <div class="pos-item"><span class="cell-edit" data-list="possessions" data-index="${i}" data-field="item">${escapeHtml(row.item).replace(/\n/g,"<br>")}</span>${row.tag ? ` <small class="cell-edit" data-list="possessions" data-index="${i}" data-field="tag">${escapeHtml(row.tag)}</small>` : `<small class="cell-edit empty-tag" data-list="possessions" data-index="${i}" data-field="tag"></small>`}</div>
      <div class="cell-edit" data-list="possessions" data-index="${i}" data-field="damage">${escapeHtml(row.damage).replace(/\n/g,"<br>")}</div>
      <div class="cell-edit" data-list="possessions" data-index="${i}" data-field="weight">${escapeHtml(row.weight)}</div>
      <button class="remove-row" type="button" data-remove="possessions" data-index="${i}" aria-label="Remover posse">×</button>
    `).join("")}
  `;
}

function renderTextList(id, listName, withIcon = true) {
  const el = document.getElementById(id);
  el.innerHTML = data[listName].map((text, i) => `
    <li>
      <span class="cell-edit" data-list="${listName}" data-index="${i}">${escapeHtml(text)}</span>
      <button class="remove-row" type="button" data-remove="${listName}" data-index="${i}" aria-label="Remover item">×</button>
    </li>
  `).join("");
}

function renderActions() {
  document.getElementById("actionsTable").innerHTML = data.actions.map((row, i) => `
    <div class="action-row">
      <span class="cell-edit" data-list="actions" data-index="${i}" data-field="action">${escapeHtml(row.action)}</span>
      <span class="cell-edit" data-list="actions" data-index="${i}" data-field="roll">${escapeHtml(row.roll)}</span>
      <span class="cell-edit" data-list="actions" data-index="${i}" data-field="dt">${escapeHtml(row.dt)}</span>
    </div>
  `).join("");
}

function renderCombos() {
  document.getElementById("combosTable").innerHTML = data.combos.map((row, i) => `
    <div class="combo-row">
      <span class="cell-edit" data-list="combos" data-index="${i}" data-field="action">${escapeHtml(row.action)}</span>
      <span class="cell-edit" data-list="combos" data-index="${i}" data-field="damage">${escapeHtml(row.damage)}</span>
      <span class="cell-edit" data-list="combos" data-index="${i}" data-field="dt">${escapeHtml(row.dt)}</span>
    </div>
  `).join("");
}

function renderBoundText() {
  document.querySelectorAll("[data-bind]").forEach(el => {
    const path = el.dataset.bind;
    const value = getPath(path);
    if (value !== undefined && value !== null) el.textContent = value;
  });
}

function renderAll() {
  renderMainStats();
  renderAttributes();
  renderPossessions();
  renderTextList("talentsList", "talents");
  renderTextList("limitationsList", "limitations");
  renderTextList("failuresList", "failures");
  renderActions();
  renderCombos();
  renderBoundText();
  applyEditMode();
}

function applyEditMode() {
  document.getElementById("sheet").classList.toggle("editing", editMode);
  document.getElementById("editToggle").textContent = editMode ? "Concluir Edição" : "Modo de Edição";

  document.querySelectorAll(".editable-text, .cell-edit").forEach(el => {
    el.contentEditable = editMode ? "true" : "false";
    el.spellcheck = false;
  });
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function changeStat(key, delta) {
  const stat = data.stats[key];
  if (!stat) return;
  const min = stat.min ?? 0;
  const max = stat.max ?? 999;
  const current = Number(stat.current);
  stat.current = Number.isFinite(current) ? clamp(current + delta, min, max) : min;
  saveData();
  renderMainStats();
}

function changeAttribute(key, delta) {
  const attr = data.attributes[key];
  if (!attr) return;
  attr.value = clamp(Number(attr.value) + delta, 0, 20);
  saveData();
  renderAttributes();
  applyEditMode();
}

function addRow(type) {
  if (type === "possessions") {
    data.possessions.push({ item: "Novo item", tag: "", damage: "–", weight: "0" });
    renderPossessions();
  }
  if (type === "talents") {
    data.talents.push("Novo talento");
    renderTextList("talentsList", "talents");
  }
  if (type === "limitations") {
    data.limitations.push("Nova limitação");
    renderTextList("limitationsList", "limitations");
  }
  saveData();
  if (!editMode) editMode = true;
  applyEditMode();

  requestAnimationFrame(() => {
    const selector = type === "possessions"
      ? `[data-list="possessions"][data-index="${data.possessions.length - 1}"][data-field="item"]`
      : `[data-list="${type}"][data-index="${data[type].length - 1}"]`;
    const target = document.querySelector(selector);
    target?.focus();
  });
}

function removeRow(type, index) {
  if (!Array.isArray(data[type])) return;
  data[type].splice(index, 1);
  saveData();
  if (type === "possessions") renderPossessions();
  else if (type === "talents") renderTextList("talentsList", "talents");
  else if (type === "limitations") renderTextList("limitationsList", "limitations");
  else if (type === "failures") renderTextList("failuresList", "failures");
  applyEditMode();
}

function updateEditableElement(el) {
  const clean = el.innerText.replace(/\u00a0/g, " ").trim();

  if (el.dataset.bind) {
    const path = el.dataset.bind;
    const numericPaths = new Set(["carry.current", "carry.max"]);
    setPath(path, numericPaths.has(path) ? Number(clean || 0) : clean);
    return;
  }

  const list = el.dataset.list;
  const index = Number(el.dataset.index);
  const field = el.dataset.field;

  if (!list || Number.isNaN(index)) return;

  if (field) {
    data[list][index][field] = clean;
  } else {
    data[list][index] = clean;
  }
  saveData();
}

function exportJson() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "thorfinn-cruz-ficha.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importJson(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      data = imported;
      saveData();
      renderAll();
    } catch {
      alert("O arquivo JSON não pôde ser lido.");
    }
  };
  reader.readAsText(file);
}

function resetSheet() {
  if (!confirm("Restaurar todos os dados originais da ficha?")) return;
  data = clone(defaultData);
  saveData();
  renderAll();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/* EVENT DELEGATION */
document.addEventListener("click", event => {
  const statBtn = event.target.closest("[data-stat]");
  if (statBtn) {
    changeStat(statBtn.dataset.stat, Number(statBtn.dataset.delta));
    return;
  }

  const attrBtn = event.target.closest("[data-attr]");
  if (attrBtn) {
    changeAttribute(attrBtn.dataset.attr, Number(attrBtn.dataset.delta));
    return;
  }

  const addBtn = event.target.closest("[data-add]");
  if (addBtn) {
    addRow(addBtn.dataset.add);
    return;
  }

  const removeBtn = event.target.closest("[data-remove]");
  if (removeBtn) {
    removeRow(removeBtn.dataset.remove, Number(removeBtn.dataset.index));
  }
});

document.addEventListener("input", event => {
  if (!editMode) return;
  const el = event.target.closest(".editable-text, .cell-edit");
  if (el) updateEditableElement(el);
});

document.getElementById("editToggle").addEventListener("click", () => {
  editMode = !editMode;
  applyEditMode();
});

document.getElementById("exportBtn").addEventListener("click", exportJson);

document.getElementById("importInput").addEventListener("change", event => {
  const file = event.target.files?.[0];
  if (file) importJson(file);
  event.target.value = "";
});

document.getElementById("resetBtn").addEventListener("click", resetSheet);

renderAll();
