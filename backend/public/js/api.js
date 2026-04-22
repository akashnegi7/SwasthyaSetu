/* ── SwasthyaSetu+ · Shared API + Utilities ─────────────────── */

const BASE = '/api';

// ── Token helpers ──────────────────────────────────────────────
const getToken = () => localStorage.getItem('ss_token');
const getUser  = () => JSON.parse(localStorage.getItem('ss_user') || 'null');
const setAuth  = (token, user) => {
  localStorage.setItem('ss_token', token);
  localStorage.setItem('ss_user', JSON.stringify(user));
};
const clearAuth = () => {
  localStorage.removeItem('ss_token');
  localStorage.removeItem('ss_user');
};

// ── Auth guard ─────────────────────────────────────────────────
function requireAuth(role) {
  const user = getUser();
  if (!user || !getToken()) { window.location.href = '/login.html'; return null; }
  if (role && user.role !== role) { window.location.href = '/'; return null; }
  return user;
}

// ── Core fetch wrapper ─────────────────────────────────────────
async function api(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(BASE + path, {
    method, headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if (res.status === 401) { clearAuth(); window.location.href = '/login.html'; }

  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Request failed');
  return data;
}

const GET    = (path)       => api('GET',    path);
const POST   = (path, body) => api('POST',   path, body);
const PATCH  = (path, body) => api('PATCH',  path, body);

// ── Toast ──────────────────────────────────────────────────────
function toast(msg, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}
const toastSuccess = (m) => toast('✅ ' + m, 'success');
const toastError   = (m) => toast('❌ ' + m, 'error');
const toastInfo    = (m) => toast('ℹ️ ' + m, 'info');

// ── Loading overlay ────────────────────────────────────────────
function showLoader(msg = 'Loading…') {
  let el = document.getElementById('page-loader');
  if (!el) {
    el = document.createElement('div');
    el.id = 'page-loader';
    el.innerHTML = `<div class="spinner"></div><span style="color:var(--text2);font-size:14px">${msg}</span>`;
    document.body.appendChild(el);
  }
  el.classList.remove('hidden');
}
function hideLoader() {
  const el = document.getElementById('page-loader');
  if (el) el.classList.add('hidden');
}

// ── Helpers ────────────────────────────────────────────────────
function fmtDate(d)    { return d ? new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—'; }
function fmtDateTime(d){ return d ? new Date(d).toLocaleString('en-IN')   : '—'; }
function calcAge(dob)  { return dob ? Math.floor((Date.now() - new Date(dob)) / (365.25*24*60*60*1000)) + ' yrs' : 'N/A'; }

// ── QR Code (tiny vanilla impl via Google Chart API) ──────────
function renderQR(containerId, text) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  el.innerHTML = `<img src="${url}" width="200" height="200" alt="QR Code" style="border-radius:4px;" />`;
}

// ── Record Card builder ────────────────────────────────────────
const TYPE_META = {
  'Diagnosis':    { icon:'🔴', cls:'Diagnosis',    badge:'badge-red',    hdrCls:'Diagnosis'    },
  'Prescription': { icon:'💊', cls:'Prescription', badge:'badge-blue',   hdrCls:'Prescription' },
  'Lab Test':     { icon:'🧪', cls:'Lab Test',     badge:'badge-yellow', hdrCls:'LabTest'      },
  'Procedure':    { icon:'🔬', cls:'Procedure',    badge:'badge-purple', hdrCls:'Procedure'    },
};

function buildRecordCard(r) {
  const m   = TYPE_META[r.recordType] || TYPE_META['Diagnosis'];
  const id  = 'rec-' + r._id;

  let subtitle = '';
  if (r.recordType === 'Diagnosis')    subtitle = r.diagnosis?.disease || '';
  if (r.recordType === 'Prescription') subtitle = `${r.prescription?.length || 0} medicines`;
  if (r.recordType === 'Lab Test')     subtitle = `${r.labTests?.length || 0} tests · ${r.labTests?.filter(t=>t.status!=='Normal').length||0} abnormal`;
  if (r.recordType === 'Procedure')    subtitle = r.procedure?.name || '';

  const followUp = r.followUpDate
    ? `<div style="font-size:11px;color:var(--yellow);margin-top:3px">📅 Follow-up: ${fmtDate(r.followUpDate)}</div>`
    : '';

  let body = '';

  // Diagnosis body
  if (r.recordType === 'Diagnosis' && r.diagnosis) {
    const sev = r.diagnosis.severity;
    const sevColor = sev==='Severe'?'var(--red)':sev==='Moderate'?'var(--yellow)':'var(--green)';
    const symptoms = (r.diagnosis.symptoms||[]).map(s=>`<span class="symptom-tag">${s}</span>`).join('');
    body = `
      <div class="record-section-title">Diagnosis Details</div>
      <div style="display:flex;gap:20px;flex-wrap:wrap;margin-bottom:10px">
        <div><span style="color:var(--text3);font-size:13px">Disease: </span><strong>${r.diagnosis.disease||''}</strong></div>
        ${sev?`<div><span style="color:var(--text3);font-size:13px">Severity: </span><strong style="color:${sevColor}">${sev}</strong></div>`:''}
        <div><span style="color:var(--text3);font-size:13px">Hospital: </span><strong>${r.hospitalLocation}</strong></div>
      </div>
      ${symptoms?`<div class="record-section-title">Symptoms</div><div>${symptoms}</div>`:''}
      ${r.diagnosis.notes?`<div class="record-notes">📝 ${r.diagnosis.notes}</div>`:''}`;
  }

  // Prescription body
  if (r.recordType === 'Prescription') {
    const meds = (r.prescription||[]).map(med=>`
      <div class="med-card">
        <div class="med-name">💊 ${med.medicine}</div>
        <div class="med-detail">📏 Dosage: <strong>${med.dosage}</strong></div>
        <div class="med-detail">🕐 Frequency: <strong>${med.frequency}</strong></div>
        <div class="med-detail">📅 Duration: <strong>${med.duration}</strong></div>
        ${med.instructions?`<div class="med-instruction">⚠️ ${med.instructions}</div>`:''}
      </div>`).join('');
    body = `<div class="record-section-title">Medicines Prescribed</div>
      <div class="med-grid">${meds}</div>
      ${r.notes?`<div class="record-notes">📝 ${r.notes}</div>`:''}`;
  }

  // Lab Test body
  if (r.recordType === 'Lab Test') {
    const rows = (r.labTests||[]).map(lt=>`
      <tr class="${lt.status!=='Normal'?'abnormal':''}">
        <td>${lt.testName}</td>
        <td class="lab-value ${lt.status}">${lt.value}</td>
        <td>${lt.unit||'—'}</td>
        <td>${lt.normalRange}</td>
        <td><span class="badge badge-${lt.status==='Normal'?'green':lt.status==='Critical'?'red':'yellow'}">${lt.status==='Normal'?'✅ Normal':lt.status==='Critical'?'🚨 Critical':'⚠️ Abnormal'}</span></td>
      </tr>`).join('');
    body = `<div class="record-section-title">Test Results</div>
      <div style="overflow-x:auto"><table class="lab-table">
        <thead><tr><th>Test</th><th>Value</th><th>Unit</th><th>Normal Range</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
      ${r.notes?`<div class="record-notes">📝 ${r.notes}</div>`:''}`;
  }

  // Procedure body
  if (r.recordType === 'Procedure' && r.procedure) {
    body = `<div class="record-section-title">Procedure Details</div>
      <div class="proc-box">
        <div class="proc-label">PROCEDURE</div>
        <div class="proc-value" style="font-weight:700;font-size:16px">${r.procedure.name||''}</div>
        ${r.procedure.anesthesia?`<div class="proc-label">ANESTHESIA</div><div class="proc-value">${r.procedure.anesthesia}</div>`:''}
        <div class="proc-label">DESCRIPTION</div>
        <div class="proc-value">${r.procedure.description||''}</div>
        <div class="proc-label">OUTCOME</div>
        <div class="proc-value proc-outcome">${r.procedure.outcome||''}</div>
      </div>
      ${r.notes?`<div class="record-notes">📝 ${r.notes}</div>`:''}`;
  }

  return `
    <div class="record-card ${m.cls}" id="${id}">
      <div class="record-header ${m.hdrCls}" onclick="toggleRecord('${id}')">
        <div class="record-header-left">
          <span class="record-type-icon">${m.icon}</span>
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
              <span class="badge ${m.badge}">${r.recordType}</span>
            </div>
            <div class="record-title">${subtitle}</div>
            <div class="record-meta">🏥 ${r.hospitalName} &nbsp;·&nbsp; 👨‍⚕️ ${r.doctorName}</div>
          </div>
        </div>
        <div class="record-header-right">
          <div class="record-date">${fmtDate(r.createdAt)}</div>
          ${followUp}
          <div class="record-toggle" id="${id}-toggle">▼</div>
        </div>
      </div>
      <div class="record-body hidden" id="${id}-body">${body}</div>
    </div>`;
}

function toggleRecord(id) {
  const body   = document.getElementById(id + '-body');
  const toggle = document.getElementById(id + '-toggle');
  if (!body) return;
  const isOpen = !body.classList.contains('hidden');
  body.classList.toggle('hidden', isOpen);
  toggle.textContent = isOpen ? '▼' : '▲';
}
