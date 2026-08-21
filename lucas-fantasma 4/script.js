
const LUCAS_ACCESS_KEY = "heresia-lucas-fantasma-access";
const LUCAS_ACCESS_SALT = "heresia:lucas-fantasma:v1:";
const LUCAS_ACCESS_HASH = "4f3970b3";

function lucasSimpleHash(value) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

function unlockLucas() {
  const gate = document.getElementById("passwordGate");
  if (gate) gate.hidden = true;
  document.documentElement.classList.remove("lucas-locked");
}

function initLucasPasswordGate() {
  const gate = document.getElementById("passwordGate");
  const form = document.getElementById("passwordForm");
  const input = document.getElementById("passwordInput");
  const error = document.getElementById("passwordError");

  if (!gate || !form || !input) {
    document.documentElement.classList.remove("lucas-locked");
    return;
  }

  if (sessionStorage.getItem(LUCAS_ACCESS_KEY) === "ok") {
    unlockLucas();
    return;
  }

  requestAnimationFrame(() => input.focus());

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    error.textContent = "";
    const attempt = lucasSimpleHash(LUCAS_ACCESS_SALT + input.value);

    if (attempt === LUCAS_ACCESS_HASH) {
      sessionStorage.setItem(LUCAS_ACCESS_KEY, "ok");
      input.value = "";
      unlockLucas();
    } else {
      error.textContent = "Senha incorreta.";
      input.select();
    }
  });
}

document.addEventListener("DOMContentLoaded", initLucasPasswordGate);

const STORAGE_KEY = "lucas-fantasma-sheet-v4";

const defaultData = {
  lucas: {
    bio: "Lucas é uma Pessoa-Vetor portador do Vetor Nexo, com a habilidade de Zoopatia. Um homem cis branco de 19 anos, 1,78cm e 68kg.",
    defenses: "Contra-ataque e Esquiva",
    skills: "Adestramento (3D12 + CREDIBILIDADE), Exploração (Inteligência), Ciências (Inteligência), Medicina e Atletismo (2D12 + ATRIBUTO).",
    skillFailures: "Conhecimentos Gerais, Pilotagem, Intimidação, Crime e Artesanato (1D10).",
    stats: {
      life: { label: "VIDA", current: 40, max: 40, color: "navy" },
      sanity: { label: "SANIDADE", current: 78, max: 90, color: "gold" },
      reputation: { label: "REPUTAÇÃO", current: 26, max: 26, color: "gold" },
      radiation: { label: "RADIAÇÃO", current: 5, min: 0, max: 100, color: "red" }
    },
    attributes: {
      strength: { label: "FORÇA", value: 2 },
      intelligence: { label: "INT.", value: 4 },
      dexterity: { label: "DESTREZA", value: 3 },
      credibility: { label: "CRED.", value: 3 },
      performance: { label: "PERF.", value: 3 },
      constitution: { label: "CONST.", value: 2 },
      perception: { label: "PERCEPÇÃO", value: 3 }
    },
    carry: { current: "", max: 10, note: "" },
    possessions: [
      { item: "Faca Militar", tag: "Batizada", damage: "1D6 + FORÇA\n1D4 (SANGR.)", weight: "1" },
      { item: "Afiação e\nBatizada", tag: "", damage: "2D6\n2D6 + 5", weight: "3" },
      { item: "Revolver 38", tag: "", damage: "", weight: "2" },
      { item: "Mochila", tag: "", damage: "", weight: "3" },
      { item: "Chave", tag: "", damage: "", weight: "0" },
      { item: "Petiscos", tag: "", damage: "", weight: "0" },
      { item: "3x Granadas", tag: "", damage: "", weight: "0" },
      { item: "5x Ataduras", tag: "", damage: "", weight: "0" },
      { item: "Kit Médico", tag: "", damage: "", weight: "0" },
      { item: "Cantil", tag: "", damage: "", weight: "0" }
    ],
    vector: {
      tag: "Vetor Nexo",
      title: "ZOOPATIA",
      description: "Nexo é o Vetor da habilidade Zoopatia, que estabelece uma ponte neural e psíquica bidirecional entre a consciência humana e as frequências instintivas da fauna. Longe de ser uma mera ferramenta de domesticação ou subjugação unilateral (como um parasitismo mental), esse vetor forja uma simbiose de empatia crua."
    },
    talents: [
      "Conectar-se telepaticamente com animais, insetos e aves",
      "Controlar animais, aves e insetos através da consciência",
      "Sentir a presença de seres vivos conscientes no ambiente",
      "Causar dano cerebral ao ser vivo conectado"
    ],
    limitations: [
      "Controlar mais de um ser vivo por vez",
      "Pode receber resistências do ser vivo a ser controlado",
      "Conectar-se com seres desconhecidos à longa distância",
      "É preciso conhecer previamente a consciência do ser ou estar visualizando ele"
    ],
    failures: [
      "A conexão não é estabelecido",
      "O animal entra em pânico",
      "O portador recebe um traço emocional intenso do animal",
      "O animal interpreta incorretamente o comando",
      "O usuário fica desorientado até o próximo turno",
      "A conexão é interrompida imediatamente",
      "Todos os animais conectados tornam-se temporariamente desorientados",
      "Dificuldade para distinguir pensamentos próprios",
      "Hipersensibilidade auditiva e de olfato",
      "Esquecimento temporário",
      "Animal se revolta contra Lucas e ataca"
    ],
    actions: [
      { action: "Testes de Atributos", roll: "1D12 + ATRIBUTO", dt: "7" },
      { action: "Testes de Arma", roll: "1D20 + 5 (POSSE)", dt: "11" },
      { action: "Testes de Vetor", roll: "2D20 + 3", dt: "11" },
      { action: "Testes de Esquiva", roll: "1D12 + 3", dt: "7" },
      { action: "Testes de Contra-ataque", roll: "1D12 + 3", dt: "7" }
    ],
    combos: [
      { action: "Combo 1", damage: "1D8 + FORÇA", dt: "2" }
    ]
  },
  fantasma: {
    bio: "Fantasma é um Cão-Lobo-Checoslováquio jovem-adulto, companheiro de Lucas há pouco mais de dois anos.",
    stats: {
      life: { label: "VIDA", current: 40, max: 40, color: "navy" },
      sanity: { label: "SANIDADE", current: 45, max: 45, color: "gold" },
      reputation: { label: "REPUTAÇÃO", current: 24, max: 24, color: "gold" },
      radiation: { label: "RADIAÇÃO", current: 5, min: 0, max: 100, color: "red" }
    },
    attributes: {
      strength: { label: "FORÇA", value: 3 },
      intelligence: { label: "INT.", value: 1 },
      dexterity: { label: "DESTREZA", value: 4 },
      credibility: { label: "CRED.", value: 2 },
      performance: { label: "PERF.", value: 0 },
      constitution: { label: "CONST.", value: 2 },
      perception: { label: "PERCEPÇÃO", value: 3 }
    },
    carry: { current: 1, max: 5, note: "Máx. 15 Pts" },
    attacks: [
      { item: "Mordida de\nLobo", tag: "", damage: "2D6 + FORÇA", weight: "–" },
      { item: "Arranhão\nde Lobo", tag: "", damage: "2D4 + FORÇA", weight: "–" },
      { item: "Investida de\nLobo", tag: "", damage: "2D6 + FORÇA +\nDESTREZA", weight: "–" },
      { item: "Colete\npolicial", tag: "Heresia", damage: "", weight: "1" }
    ],
    actions: [
      { action: "Testes de Atributos", roll: "1D12 + ATRIBUTO", dt: "7" },
      { action: "Testes de Ataque", roll: "1D20 + 5 (ANIMAL)", dt: "11" },
      { action: "Testes de Contra-ataque", roll: "1D12 + 4", dt: "7" }
    ]
  }
};

let data = loadData();
let editMode = false;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function mergeDeep(target, source) {
  for (const key of Object.keys(source || {})) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      if (!target[key] || typeof target[key] !== "object") target[key] = {};
      mergeDeep(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? mergeDeep(clone(defaultData), JSON.parse(saved)) : clone(defaultData);
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

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function hexSvg(className = "outline") {
  return `<svg viewBox="0 0 100 116" aria-hidden="true"><polygon class="${className}" points="50,2 98,29 98,87 50,114 2,87 2,29"></polygon></svg>`;
}

function renderMainStats(section, containerId) {
  const block = data[section];
  const el = document.getElementById(containerId);
  const defs = ["life", "sanity", "reputation", "radiation"];
  el.innerHTML = defs.map((key) => {
    const stat = block.stats[key];
    if (key === "radiation") {
      return `
      <div class="stat-card radiation">
        <div class="hex-control">
          ${hexSvg("fill-red")}
          <button class="stepper minus" type="button" data-section="${section}" data-stat="${key}" data-delta="-1">‹</button>
          <span class="value">${stat.current}%</span>
          <button class="stepper plus-step" type="button" data-section="${section}" data-stat="${key}" data-delta="1">›</button>
        </div>
        <span class="stat-label">${stat.label}</span>
      </div>`;
    }
    const shown = `${stat.current}/${stat.max}`;
    return `
      <div class="stat-card">
        <div class="hex-control">
          ${hexSvg(`fill-${stat.color}`)}
          <button class="stepper minus" type="button" data-section="${section}" data-stat="${key}" data-delta="-1">‹</button>
          <span class="value">${shown}</span>
          <button class="stepper plus-step" type="button" data-section="${section}" data-stat="${key}" data-delta="1">›</button>
        </div>
        <span class="stat-label">${stat.label}</span>
      </div>`;
  }).join("");
}

function renderAttributes(section, containerId, extraNote = false) {
  const el = document.getElementById(containerId);
  const attrs = data[section].attributes;
  const ordered = [
    ["strength", attrs.strength],
    ["intelligence", attrs.intelligence],
    ["dexterity", attrs.dexterity],
    ["credibility", attrs.credibility],
    ["performance", attrs.performance],
    ["constitution", attrs.constitution]
  ];

  el.innerHTML = ordered.map(([key, attr]) => `
    <div class="attr-card">
      <div class="attr-hex">
        ${hexSvg("outline")}
        <button class="stepper minus" type="button" data-section="${section}" data-attr="${key}" data-delta="-1">‹</button>
        <span class="attr-value">${attr.value}</span>
        <button class="stepper plus-step" type="button" data-section="${section}" data-attr="${key}" data-delta="1">›</button>
      </div>
      <span class="attr-label">${attr.label}</span>
    </div>
  `).join("") + `
    <div class="carry-wrap ${section === 'fantasma' ? 'carry-wrap-note' : ''}">
      <div class="carry-card">
        CARGA:&nbsp;<b><span class="editable-text" data-bind="${section}.carry.current">${data[section].carry.current}</span>/<span class="editable-text" data-bind="${section}.carry.max">${data[section].carry.max}</span></b>
      </div>
      ${extraNote ? `<div class="carry-note editable-text" data-bind="${section}.carry.note">${escapeHtml(data[section].carry.note)}</div>` : ''}
    </div>
    <div class="attr-card perception-card">
      <div class="attr-hex">
        ${hexSvg("outline")}
        <button class="stepper minus" type="button" data-section="${section}" data-attr="perception" data-delta="-1">‹</button>
        <span class="attr-value">${attrs.perception.value}</span>
        <button class="stepper plus-step" type="button" data-section="${section}" data-attr="perception" data-delta="1">›</button>
      </div>
      <span class="attr-label">${attrs.perception.label}</span>
    </div>
  `;
}

function renderPossessTable(section, listName, containerId) {
  const table = document.getElementById(containerId);
  const rows = data[section][listName];
  table.innerHTML = `
    <div class="head">Item</div><div class="head">Dano</div><div class="head">Peso</div><div></div>
    ${rows.map((row, i) => `
      <div class="pos-item"><span class="cell-edit" data-section="${section}" data-list="${listName}" data-index="${i}" data-field="item">${escapeHtml(row.item).replace(/\n/g,"<br>")}</span>${row.tag ? ` <small class="cell-edit" data-section="${section}" data-list="${listName}" data-index="${i}" data-field="tag">${escapeHtml(row.tag)}</small>` : `<small class="cell-edit empty-tag" data-section="${section}" data-list="${listName}" data-index="${i}" data-field="tag"></small>`}</div>
      <div class="cell-edit" data-section="${section}" data-list="${listName}" data-index="${i}" data-field="damage">${escapeHtml(row.damage).replace(/\n/g,"<br>")}</div>
      <div class="cell-edit" data-section="${section}" data-list="${listName}" data-index="${i}" data-field="weight">${escapeHtml(row.weight)}</div>
      <button class="remove-row" type="button" data-section="${section}" data-remove="${listName}" data-index="${i}" aria-label="Remover linha">×</button>
    `).join("")}
  `;
}

function renderTextList(section, listName, containerId) {
  const el = document.getElementById(containerId);
  el.innerHTML = data[section][listName].map((text, i) => `
    <li>
      <span class="cell-edit" data-section="${section}" data-list="${listName}" data-index="${i}">${escapeHtml(text)}</span>
      <button class="remove-row" type="button" data-section="${section}" data-remove="${listName}" data-index="${i}" aria-label="Remover item">×</button>
    </li>
  `).join("");
}

function renderThreeColTable(section, listName, containerId, rowClass) {
  const el = document.getElementById(containerId);
  el.innerHTML = data[section][listName].map((row, i) => `
    <div class="${rowClass}">
      <span class="cell-edit" data-section="${section}" data-list="${listName}" data-index="${i}" data-field="action">${escapeHtml(row.action)}</span>
      <span class="cell-edit" data-section="${section}" data-list="${listName}" data-index="${i}" data-field="roll">${escapeHtml(row.roll)}</span>
      <span class="cell-edit" data-section="${section}" data-list="${listName}" data-index="${i}" data-field="dt">${escapeHtml(row.dt)}</span>
    </div>
  `).join("");
}

function renderComboTable(section, listName, containerId) {
  const el = document.getElementById(containerId);
  el.innerHTML = data[section][listName].map((row, i) => `
    <div class="combo-row">
      <span class="cell-edit" data-section="${section}" data-list="${listName}" data-index="${i}" data-field="action">${escapeHtml(row.action)}</span>
      <span class="cell-edit" data-section="${section}" data-list="${listName}" data-index="${i}" data-field="damage">${escapeHtml(row.damage)}</span>
      <span class="cell-edit" data-section="${section}" data-list="${listName}" data-index="${i}" data-field="dt">${escapeHtml(row.dt)}</span>
    </div>
  `).join("");
}

function renderBoundText() {
  document.querySelectorAll("[data-bind]").forEach(el => {
    const path = el.dataset.bind;
    const value = getPath(path);
    if (value !== undefined && value !== null) el.textContent = value;
  });

  document.querySelectorAll("[data-htmlbind]").forEach(el => {
    const path = el.dataset.htmlbind;
    const value = getPath(path);
    if (value !== undefined && value !== null) el.innerHTML = escapeHtml(value).replace(/\n/g, "<br>");
  });
}

function renderAll() {
  renderMainStats("lucas", "lucasMainStats");
  renderAttributes("lucas", "lucasAttributesGrid", false);
  renderPossessTable("lucas", "possessions", "lucasPossessionsTable");
  renderTextList("lucas", "talents", "lucasTalentsList");
  renderTextList("lucas", "limitations", "lucasLimitationsList");
  renderTextList("lucas", "failures", "lucasFailuresList");
  renderThreeColTable("lucas", "actions", "lucasActionsTable", "action-row");
  renderComboTable("lucas", "combos", "lucasCombosTable");

  renderMainStats("fantasma", "fantasmaMainStats");
  renderAttributes("fantasma", "fantasmaAttributesGrid", true);
  renderPossessTable("fantasma", "attacks", "fantasmaAttacksTable");
  renderThreeColTable("fantasma", "actions", "fantasmaActionsTable", "action-row");

  renderBoundText();
  applyEditMode();
}

function applyEditMode() {
  document.getElementById("sheet").classList.toggle("editing", editMode);
  document.getElementById("editToggle").textContent = editMode ? "Concluir Edição" : "Modo de Edição";

  document.querySelectorAll(".editable-text, .cell-edit, .editable-html").forEach(el => {
    el.contentEditable = editMode ? "true" : "false";
    el.spellcheck = false;
  });
}

function changeStat(section, key, delta) {
  const stat = data[section].stats[key];
  if (!stat || typeof stat.current !== "number") return;
  stat.current = clamp(Number(stat.current) + delta, 0, Number(stat.max) || 999);
  saveData();
  renderMainStats(section, section === 'lucas' ? 'lucasMainStats' : 'fantasmaMainStats');
}

function changeAttribute(section, key, delta) {
  const attr = data[section].attributes[key];
  if (!attr) return;
  attr.value = clamp(Number(attr.value) + delta, 0, 20);
  saveData();
  renderAttributes(section, section === 'lucas' ? 'lucasAttributesGrid' : 'fantasmaAttributesGrid', section === 'fantasma');
  applyEditMode();
}

function addRow(section, type) {
  if (section === 'lucas' && type === 'possessions') data.lucas.possessions.push({ item: "Novo item", tag: "", damage: "", weight: "0" });
  if (section === 'lucas' && type === 'talents') data.lucas.talents.push("Novo talento");
  if (section === 'lucas' && type === 'limitations') data.lucas.limitations.push("Nova limitação");
  if (section === 'lucas' && type === 'combos') data.lucas.combos.push({ action: "Novo combo", damage: "", dt: "" });
  if (section === 'fantasma' && type === 'attacks') data.fantasma.attacks.push({ item: "Novo ataque", tag: "", damage: "", weight: "–" });
  saveData();
  renderAll();
  editMode = true;
  applyEditMode();
}

function removeRow(section, type, index) {
  if (!Array.isArray(data[section][type])) return;
  data[section][type].splice(index, 1);
  saveData();
  renderAll();
}

function updateEditableElement(el) {
  const clean = el.innerText.replace(/\u00a0/g, " ").trim();
  const htmlClean = el.innerHTML.replace(/<div>/gi, "\n").replace(/<br\s*\/?>/gi, "\n").replace(/<\/div>/gi, "").replace(/&nbsp;/g, " ").replace(/<[^>]*>/g, "").trim();

  if (el.dataset.bind) {
    const path = el.dataset.bind;
    const numericPaths = new Set(["lucas.carry.current", "lucas.carry.max", "fantasma.carry.current", "fantasma.carry.max"]);
    setPath(path, numericPaths.has(path) && /^\d+$/.test(clean) ? Number(clean) : clean);
    return;
  }

  if (el.dataset.htmlbind) {
    setPath(el.dataset.htmlbind, htmlClean);
    return;
  }

  const section = el.dataset.section;
  const list = el.dataset.list;
  const index = Number(el.dataset.index);
  const field = el.dataset.field;
  if (!section || !list || Number.isNaN(index)) return;

  if (field) data[section][list][index][field] = htmlClean;
  else data[section][list][index] = clean;
  saveData();
}

function exportJson() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "lucas-fantasma-ficha.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importJson(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      data = mergeDeep(clone(defaultData), imported);
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

document.addEventListener("click", event => {
  const statBtn = event.target.closest("[data-stat]");
  if (statBtn) {
    changeStat(statBtn.dataset.section, statBtn.dataset.stat, Number(statBtn.dataset.delta));
    return;
  }

  const attrBtn = event.target.closest("[data-attr]");
  if (attrBtn) {
    changeAttribute(attrBtn.dataset.section, attrBtn.dataset.attr, Number(attrBtn.dataset.delta));
    return;
  }

  const addBtn = event.target.closest("[data-add]");
  if (addBtn) {
    addRow(addBtn.dataset.section, addBtn.dataset.add);
    return;
  }

  const removeBtn = event.target.closest("[data-remove]");
  if (removeBtn) {
    removeRow(removeBtn.dataset.section, removeBtn.dataset.remove, Number(removeBtn.dataset.index));
    return;
  }
});

document.addEventListener("input", event => {
  if (!editMode) return;
  const el = event.target.closest(".editable-text, .cell-edit, .editable-html");
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
