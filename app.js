// Ganti URL ini setelah Google Apps Script dideploy sebagai Web App.
const API_URL = "PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

const rowsEl = document.getElementById("rows");
const statusEl = document.getElementById("status");
const saveBtn = document.getElementById("saveBtn");

function showToast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2500);
}

function setStatus(text) { statusEl.textContent = text; }

function makeRows(data = []) {
  rowsEl.innerHTML = "";
  for (let i = 1; i <= 6; i++) {
    const item = data[i - 1] || {};
    const c1 = Number(item.c1 || 0), c2 = Number(item.c2 || 0), invalid = Number(item.invalid || 0);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <th>TPS ${i}</th>
      <td><input class="number-input c1" type="number" min="0" step="1" value="${c1}"></td>
      <td><input class="number-input c2" type="number" min="0" step="1" value="${c2}"></td>
      <td><input class="number-input invalid" type="number" min="0" step="1" value="${invalid}"></td>
      <td class="row-total">${c1+c2+invalid}</td>`;
    rowsEl.appendChild(tr);
  }
  rowsEl.querySelectorAll("input").forEach(input => input.addEventListener("input", updateSummary));
  updateSummary();
}

function values() {
  return [...rowsEl.querySelectorAll("tr")].map((tr, i) => ({
    tps: i + 1,
    c1: Math.max(0, parseInt(tr.querySelector(".c1").value || 0, 10)),
    c2: Math.max(0, parseInt(tr.querySelector(".c2").value || 0, 10)),
    invalid: Math.max(0, parseInt(tr.querySelector(".invalid").value || 0, 10))
  }));
}

function updateSummary() {
  const data = values();
  let s1 = 0, s2 = 0, invalid = 0;
  data.forEach((x, i) => {
    s1 += x.c1; s2 += x.c2; invalid += x.invalid;
    rowsEl.children[i].querySelector(".row-total").textContent = x.c1 + x.c2 + x.invalid;
  });
  const valid = s1 + s2, total = valid + invalid;
  document.getElementById("sum1").textContent = s1.toLocaleString("id-ID");
  document.getElementById("sum2").textContent = s2.toLocaleString("id-ID");
  document.getElementById("invalid").textContent = invalid.toLocaleString("id-ID");
  document.getElementById("grandTotal").textContent = total.toLocaleString("id-ID");
  document.getElementById("foot1").textContent = s1.toLocaleString("id-ID");
  document.getElementById("foot2").textContent = s2.toLocaleString("id-ID");
  document.getElementById("footInvalid").textContent = invalid.toLocaleString("id-ID");
  document.getElementById("footTotal").textContent = total.toLocaleString("id-ID");
  const p1 = valid ? (s1 / valid * 100) : 0, p2 = valid ? (s2 / valid * 100) : 0;
  document.getElementById("pct1").textContent = p1.toFixed(2) + "% suara sah";
  document.getElementById("pct2").textContent = p2.toFixed(2) + "% suara sah";
  document.getElementById("barValue1").textContent = s1.toLocaleString("id-ID");
  document.getElementById("barValue2").textContent = s2.toLocaleString("id-ID");
  document.getElementById("bar1").style.width = p1 + "%";
  document.getElementById("bar2").style.width = p2 + "%";
}

function applyNames(name1, name2) {
  const a = name1 || "Calon 1", b = name2 || "Calon 2";
  ["candidate1","label1","th1","foot1","barLabel1"].forEach(id => document.getElementById(id).textContent !== undefined && (document.getElementById(id).value !== undefined ? document.getElementById(id).value = a : document.getElementById(id).textContent = a));
  ["candidate2","label2","th2","foot2","barLabel2"].forEach(id => document.getElementById(id).textContent !== undefined && (document.getElementById(id).value !== undefined ? document.getElementById(id).value = b : document.getElementById(id).textContent = b));
}

async function loadData() {
  if (API_URL.includes("PASTE_")) {
    makeRows();
    setStatus("Demo");
    return;
  }
  setStatus("Memuat...");
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    applyNames(data.candidate1, data.candidate2);
    makeRows(data.rows);
    setStatus("Terhubung");
  } catch (e) {
    setStatus("Gagal terhubung");
    showToast("Gagal mengambil data Google Sheets");
    makeRows();
  }
}

async function saveData() {
  if (API_URL.includes("PASTE_")) {
    showToast("Hubungkan URL Google Apps Script terlebih dahulu");
    return;
  }
  saveBtn.disabled = true;
  setStatus("Menyimpan...");
  try {
    const payload = { rows: values() };
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {"Content-Type": "text/plain;charset=utf-8"},
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || "Gagal");
    setStatus("Tersimpan");
    showToast("Rekap berhasil disimpan");
  } catch (e) {
    setStatus("Gagal menyimpan");
    showToast("Gagal menyimpan: " + e.message);
  } finally {
    saveBtn.disabled = false;
  }
}

document.getElementById("refreshBtn").addEventListener("click", loadData);
saveBtn.addEventListener("click", saveData);
makeRows();
loadData();
