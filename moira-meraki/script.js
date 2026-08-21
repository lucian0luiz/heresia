const MOIRA_ACCESS_KEY = "heresia-moira-access";
const MOIRA_ACCESS_SALT = "heresia:moira-meraki:v1:";
const MOIRA_ACCESS_DIGEST = "900358d4f17b6169453c6d62c4860984eeeb83e6d80232e99795d5e3a173e21c";

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, "0")).join("");
}

function unlockMoira() {
  const gate = document.getElementById("passwordGate");
  if (gate) gate.hidden = true;
  document.documentElement.classList.remove("moira-locked");
}

function initPasswordGate() {
  const gate = document.getElementById("passwordGate");
  const form = document.getElementById("passwordForm");
  const input = document.getElementById("passwordInput");
  const error = document.getElementById("passwordError");

  if (!gate || !form || !input) {
    document.documentElement.classList.remove("moira-locked");
    return;
  }

  if (sessionStorage.getItem(MOIRA_ACCESS_KEY) === "ok") {
    unlockMoira();
    return;
  }

  requestAnimationFrame(() => input.focus());

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    error.textContent = "";
    try {
      const attempt = await sha256Hex(MOIRA_ACCESS_SALT + input.value);
      if (attempt === MOIRA_ACCESS_DIGEST) {
        sessionStorage.setItem(MOIRA_ACCESS_KEY, "ok");
        input.value = "";
        unlockMoira();
      } else {
        error.textContent = "Senha incorreta.";
        input.select();
      }
    } catch {
      error.textContent = "Não foi possível validar a senha neste navegador.";
    }
  });
}

document.addEventListener("DOMContentLoaded", initPasswordGate);

const STORAGE_KEY = "moira-meraki-sheet-v6";

const defaultData = {
  bio: "Moira Meraki é uma Pessoa-Vetor portador do Vetor Fiandeira. Uma mulher cis negra de 21 anos, 1,73cm e 64kg.",
  defenses: "Contra-ataque e Esquiva",
  skills: "Investigação (3D12 + ATRIBUTO), Diplomacia, Lábia, Burocracia e Conhecimentos Ger. (2D12 + ATRIBUTO).",
  skillFailures: "Determinação, Intimidação, Ciências, Natação e Violência (1D10).",
  stats: {
    life: { label: "VIDA", current: 28, max: 40, color: "navy" },
    sanity: { label: "SANIDADE", current: 66, max: 90, color: "gold" },
    reputation: { label: "REPUTAÇÃO", current: 26, max: 26, color: "gold" },
    radiation: { label: "RADIAÇÃO", current: 5, min: 0, max: 100, color: "red" }
  },
  attributes: {
    strength: { label: "FORÇA", value: 1 },
    intelligence: { label: "INT.", value: 4 },
    dexterity: { label: "DESTREZA", value: 3 },
    credibility: { label: "CRED.", value: 3 },
    performance: { label: "PERF.", value: 4 },
    constitution: { label: "CONST.", value: 2 },
    perception: { label: "PERCEPÇÃO", value: 3 }
  },
  carry: { current: 2.5, max: 10 },
  possessions: [
    { item: "Tesoura\ndas Moiras", tag: "", damage: "2D6 + FORÇA", weight: "0.5" },
    { item: "Boneco\nVinculado", tag: "", damage: "2D4 + PERF", weight: "1" },
    { item: "Taser\nPolicial", tag: "", damage: "1 ou 2 + ATORD.", weight: "1" },
    { item: "Crachás", tag: "", damage: "–", weight: "0" }
  ],
  vector: {
    tag: "Vetor Fiandeira",
    title: "FIANDEIRA",
    description: "Fiandeira é o Vetor que permite ao portador perceber e manipular a realidade como uma vasta tapeçaria, onde cada relação está interligado por fios invisíveis de causalidade. A habilidade manifesta-se fisicamente através da criação e do controle de fios dourados, que o portador utiliza para tecer vínculos temporários, animar objetos inanimados ou converter alvos vivos em marionetes sob seu comando direto."
  },
  talents: [
    "Capacidade de criar um boneco através do vínculo com uma pessoa\nA portadora precisa, necessariamente, possuir um vínculo com esse ser. Seja por duas palavras trocadas, ou um vínculo muito mais profundo.\n\nA profundidade do vínculo determina o quanto de vitalidade a portadora precisará abdicar para compor o boneco. Indo de 100%, 50% ou 25% em laços mais profundos.\n\nMoira deposita sua vida (máx. 20) no boneco e pode retirá-la ou utilizar para dano\nDano: 2D4 + PERF",
    "Capacidade de tecer fios dourados no ambiente, criando o que for desejado\nOs fios podem criar estruturas simples, envolver objetos e torná-los animados, puxar, enforcar, amarrar, etc.",
    "Capacidade de visualizar vínculos no ambiente, entre o portador ou outras pessoas",
    "Desbloqueado após encontro com Vetor-Mãe em Ato I.\nA portadora é capaz de visualizar o vínculo da vida de pessoas em que possui uma alta conexão. É possível entender o quanto aquela vida se estenderá e o quão perto o fim está. Com muito esforço, a portadora sente que poderá cortar o vínculo, se preciso."
  ],
  limitations: [
    "Apesar de perceber os vínculos entre as pessoas, a protadora não pode fazer com que o seu vetor ressoe com isso",
    "A portadora não pode estabelecer mais de um vínculo ao criar o boneco, e necessariamente precisa de um",
    "A portadora doa parte de sua vitalidade para o vínculo, ficando mais vulnerável a outros danos em combate",
    "Não é possível controlar fios produzidos por outros portadores",
    "Quanto mais fios simultaneamente, mais difícil se torna manter a concentração."
  ],
  failures: [
    "O fio se rompe",
    "As construções feitas desmoronam",
    "O vínculo não é bem estabelecido",
    "O dano planejado para o Boneco Vínculo é dado ao portador",
    "Um fio vincula no alvo errado.",
    "Todos os fios se desfazem",
    "O fio se torna tangível a todos, incluindo o alvo"
  ],
  actions: [
    { action: "Testes de Atributos", roll: "1D12 + ATRIBUTO", dt: "7" },
    { action: "Testes de Arma", roll: "1D20 + 5 (POSSE)", dt: "11" },
    { action: "Testes de Vetor", roll: "2D20 + 4", dt: "11" },
    { action: "Testes de Esquiva", roll: "1D12 + 3", dt: "7" },
    { action: "Testes de Contra-ataque", roll: "1D12 + 3", dt: "7" }
  ],
  combos: [
    { action: "Combo 1", damage: "1D8 + FORÇA", dt: "2" }
  ]
};

let data = loadData();
let editMode = false;

function clone(value) { return JSON.parse(JSON.stringify(value)); }
function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? Object.assign(clone(defaultData), JSON.parse(saved)) : clone(defaultData);
  } catch { return clone(defaultData); }
}
function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
function getPath(path) { return path.split(".").reduce((obj, key) => obj?.[key], data); }
function setPath(path, value) {
  const parts = path.split(".");
  const last = parts.pop();
  const target = parts.reduce((obj, key) => obj[key], data);
  target[last] = value;
  saveData();
}
function hexSvg(className = "outline") {
  return `<svg viewBox="0 0 100 116" aria-hidden="true"><polygon class="${className}" points="50,2 98,29 98,87 50,114 2,87 2,29"></polygon></svg>`;
}
function renderMainStats() {
  const el = document.getElementById("mainStats");
  const defs = [["life",data.stats.life],["sanity",data.stats.sanity],["reputation",data.stats.reputation],["radiation",data.stats.radiation]];
  el.innerHTML = defs.map(([key, stat]) => {
    const isRadiation = key === "radiation";
    const fillClass = `fill-${stat.color}`;
    const shown = isRadiation ? `${stat.current}%` : `${stat.current}/${stat.max}`;
    return `<div class="stat-card ${isRadiation ? "radiation" : ""}"><div class="hex-control">${hexSvg(fillClass)}<button class="stepper minus" type="button" data-stat="${key}" data-delta="-1">‹</button><span class="value">${shown}</span><button class="stepper plus-step" type="button" data-stat="${key}" data-delta="1">›</button></div><span class="stat-label">${stat.label}</span></div>`;
  }).join("");
}
function renderAttributes() {
  const el = document.getElementById("attributesGrid");
  const ordered = [["strength",data.attributes.strength],["intelligence",data.attributes.intelligence],["dexterity",data.attributes.dexterity],["credibility",data.attributes.credibility],["performance",data.attributes.performance],["constitution",data.attributes.constitution]];
  el.innerHTML = ordered.map(([key, attr]) => `<div class="attr-card"><div class="attr-hex">${hexSvg("outline")}<button class="stepper minus" type="button" data-attr="${key}" data-delta="-1">‹</button><span class="attr-value">${attr.value}</span><button class="stepper plus-step" type="button" data-attr="${key}" data-delta="1">›</button></div><span class="attr-label">${attr.label}</span></div>`).join("") + `<div class="carry-card">CARGA:&nbsp;<b><span class="editable-text" data-bind="carry.current">${data.carry.current}</span>/<span class="editable-text" data-bind="carry.max">${data.carry.max}</span></b></div><div class="attr-card perception-card"><div class="attr-hex">${hexSvg("outline")}<button class="stepper minus" type="button" data-attr="perception" data-delta="-1">‹</button><span class="attr-value">${data.attributes.perception.value}</span><button class="stepper plus-step" type="button" data-attr="perception" data-delta="1">›</button></div><span class="attr-label">${data.attributes.perception.label}</span></div>`;
}
function renderPossessions() {
  const table = document.getElementById("possessionsTable");
  table.innerHTML = `<div class="head">Item</div><div class="head">Dano</div><div class="head">Peso</div><div></div>${data.possessions.map((row,i)=>`<div class="pos-item"><span class="cell-edit" data-list="possessions" data-index="${i}" data-field="item">${escapeHtml(row.item).replace(/\n/g,"<br>")}</span>${row.tag ? ` <small class="cell-edit" data-list="possessions" data-index="${i}" data-field="tag">${escapeHtml(row.tag)}</small>` : `<small class="cell-edit empty-tag" data-list="possessions" data-index="${i}" data-field="tag"></small>`}</div><div class="cell-edit" data-list="possessions" data-index="${i}" data-field="damage">${escapeHtml(row.damage).replace(/\n/g,"<br>")}</div><div class="cell-edit" data-list="possessions" data-index="${i}" data-field="weight">${escapeHtml(row.weight)}</div><button class="remove-row" type="button" data-remove="possessions" data-index="${i}" aria-label="Remover posse">×</button>`).join("")}`;
}
function renderTextList(id,listName) {
  const el=document.getElementById(id);
  el.innerHTML=data[listName].map((text,i)=>{const safe=escapeHtml(text);let formatted=safe.replace(/\n/g,"<br>");if(listName==="talents"){const parts=safe.split("\n");formatted=`<strong>${parts.shift()||""}</strong>${parts.length?`<span class="talent-detail">${parts.join("\n").replace(/\n/g,"<br>")}</span>`:""}`;}return `<li class="${listName==="talents"&&i===3?"unlocked-talent":""}"><span class="cell-edit" data-list="${listName}" data-index="${i}">${formatted}</span><button class="remove-row" type="button" data-remove="${listName}" data-index="${i}" aria-label="Remover item">×</button></li>`;}).join("");
}
function renderActions(){document.getElementById("actionsTable").innerHTML=data.actions.map((row,i)=>`<div class="action-row"><span class="cell-edit" data-list="actions" data-index="${i}" data-field="action">${escapeHtml(row.action)}</span><span class="cell-edit" data-list="actions" data-index="${i}" data-field="roll">${escapeHtml(row.roll)}</span><span class="cell-edit" data-list="actions" data-index="${i}" data-field="dt">${escapeHtml(row.dt)}</span></div>`).join("");}
function renderCombos(){document.getElementById("combosTable").innerHTML=data.combos.map((row,i)=>`<div class="combo-row"><span class="cell-edit" data-list="combos" data-index="${i}" data-field="action">${escapeHtml(row.action)}</span><span class="cell-edit" data-list="combos" data-index="${i}" data-field="damage">${escapeHtml(row.damage)}</span><span class="cell-edit" data-list="combos" data-index="${i}" data-field="dt">${escapeHtml(row.dt)}</span></div>`).join("");}
function renderBoundText(){document.querySelectorAll("[data-bind]").forEach(el=>{const value=getPath(el.dataset.bind);if(value!==undefined&&value!==null)el.textContent=value;});}
function renderAll(){renderMainStats();renderAttributes();renderPossessions();renderTextList("talentsList","talents");renderTextList("limitationsList","limitations");renderTextList("failuresList","failures");renderActions();renderCombos();renderBoundText();applyEditMode();}
function applyEditMode(){document.getElementById("sheet").classList.toggle("editing",editMode);document.getElementById("editToggle").textContent=editMode?"Concluir Edição":"Modo de Edição";document.querySelectorAll(".editable-text, .cell-edit").forEach(el=>{el.contentEditable=editMode?"true":"false";el.spellcheck=false;});}
function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
function changeStat(key,delta){const stat=data.stats[key];if(!stat)return;stat.current=clamp(Number(stat.current)+delta,stat.min??0,stat.max??999);saveData();renderMainStats();}
function changeAttribute(key,delta){const attr=data.attributes[key];if(!attr)return;attr.value=clamp(Number(attr.value)+delta,0,20);saveData();renderAttributes();applyEditMode();}
function addRow(type){if(type==="possessions"){data.possessions.push({item:"Novo item",tag:"",damage:"–",weight:"0"});renderPossessions();}if(type==="talents"){data.talents.push("Novo talento");renderTextList("talentsList","talents");}if(type==="limitations"){data.limitations.push("Nova limitação");renderTextList("limitationsList","limitations");}saveData();if(!editMode)editMode=true;applyEditMode();}
function removeRow(type,index){if(!Array.isArray(data[type]))return;data[type].splice(index,1);saveData();if(type==="possessions")renderPossessions();else if(type==="talents")renderTextList("talentsList","talents");else if(type==="limitations")renderTextList("limitationsList","limitations");else if(type==="failures")renderTextList("failuresList","failures");applyEditMode();}
function updateEditableElement(el){const clean=el.innerText.replace(/\u00a0/g," ").trim();if(el.dataset.bind){const path=el.dataset.bind;setPath(path,new Set(["carry.current","carry.max"]).has(path)?Number(clean||0):clean);return;}const list=el.dataset.list,index=Number(el.dataset.index),field=el.dataset.field;if(!list||Number.isNaN(index))return;if(field)data[list][index][field]=clean;else data[list][index]=clean;saveData();}
function exportJson(){const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="moira-meraki-ficha.json";a.click();URL.revokeObjectURL(url);}
function importJson(file){const reader=new FileReader();reader.onload=()=>{try{data=JSON.parse(reader.result);saveData();renderAll();}catch{alert("O arquivo JSON não pôde ser lido.");}};reader.readAsText(file);}
function resetSheet(){if(!confirm("Restaurar todos os dados originais da ficha?"))return;data=clone(defaultData);saveData();renderAll();}
function escapeHtml(value){return String(value??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");}
document.addEventListener("click",event=>{const statBtn=event.target.closest("[data-stat]");if(statBtn){changeStat(statBtn.dataset.stat,Number(statBtn.dataset.delta));return;}const attrBtn=event.target.closest("[data-attr]");if(attrBtn){changeAttribute(attrBtn.dataset.attr,Number(attrBtn.dataset.delta));return;}const addBtn=event.target.closest("[data-add]");if(addBtn){addRow(addBtn.dataset.add);return;}const removeBtn=event.target.closest("[data-remove]");if(removeBtn)removeRow(removeBtn.dataset.remove,Number(removeBtn.dataset.index));});
document.addEventListener("input",event=>{if(!editMode)return;const el=event.target.closest(".editable-text, .cell-edit");if(el)updateEditableElement(el);});
document.getElementById("editToggle").addEventListener("click",()=>{editMode=!editMode;applyEditMode();});
document.getElementById("exportBtn").addEventListener("click",exportJson);
document.getElementById("importInput").addEventListener("change",event=>{const file=event.target.files?.[0];if(file)importJson(file);event.target.value="";});
document.getElementById("resetBtn").addEventListener("click",resetSheet);
renderAll();
