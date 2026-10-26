/* Nexia Virtual Desk - Step 1 Customer Portal Script (V4: Smart Guardian Combo, One-Time Auto-Download, Free Back/Next Navigation) */
const $ = s => document.querySelector(s);
let stepIndex = 0;
let formData = loadData();
let downloaded = new Set(formData._downloadedSteps || []);
let summaryAutoDownloaded = !!formData._summaryAutoDownloaded;
const NEXIA_INTERNAL_SECRET = 'NEXIA_VIRTUAL_DESK_2025_SECURE_KEY_9961850698';

const step = () => NEXIA_CONTENT.steps[stepIndex];

function loadData() {
  try { return JSON.parse(localStorage.getItem('nexiaLegalHeirDraftV4') || '{}'); }
  catch { return {}; }
}

function saveData() {
  try {
    formData._downloadedSteps = [...downloaded];
    formData._summaryAutoDownloaded = summaryAutoDownloaded;
    localStorage.setItem('nexiaLegalHeirDraftV4', JSON.stringify(formData));
  } catch {}
}

function show(id) {
  ['welcome', 'app', 'finish'].forEach(x => $('#' + x).classList.toggle('hidden', x !== id));
}

$('#startBtn').addEventListener('click', () => {
  show('app');
  renderStep();
});

function derivePersonRelationWord(guardianType, personGender) {
  const gType = String(guardianType || 'Father').trim();
  const gender = String(personGender || '').toLowerCase();
  if (gType === 'Husband' || gType === 'ഭർത്താവ്') return 'ഭാര്യ';
  if (gType === 'Wife' || gType === 'ഭാര്യ') return 'ഭർത്താവ്';
  if (gender.startsWith('female') || gender.includes('സ്ത്രീ')) return 'മകൾ';
  if (gender.startsWith('male') || gender.includes('പുരുഷൻ')) return 'മകൻ';
  return 'മകൻ/മകൾ';
}

function syncDerivedRelations() {
  formData.applicantGuardianRelation = derivePersonRelationWord(
    formData.applicantGuardianType || 'Father',
    formData.applicantGender
  );
  formData.deceasedGuardianRelation = derivePersonRelationWord(
    formData.deceasedGuardianType || 'Father',
    formData.deceasedGender
  );
  formData.witness1GuardianRelation = derivePersonRelationWord(
    formData.witness1GuardianType || 'Father',
    formData.witness1Gender
  );
  formData.witness2GuardianRelation = derivePersonRelationWord(
    formData.witness2GuardianType || 'Father',
    formData.witness2Gender
  );
}

function syncPreliminaryToDeceased() {
  if (formData.deceasedNamePreliminary && !formData.deceasedName) {
    formData.deceasedName = formData.deceasedNamePreliminary;
  }
  if (formData.deceasedDeathDatePreliminary && !formData.deceasedDeathDate) {
    formData.deceasedDeathDate = formData.deceasedDeathDatePreliminary;
  }
  if (formData.applicantHouseName && !formData.deceasedHouseName) {
    formData.deceasedHouseName = formData.applicantHouseName;
  }
  if (formData.applicantAddress && !formData.deceasedAddress) {
    formData.deceasedAddress = formData.applicantAddress;
  }
  if (formData.applicantVillage && !formData.deceasedVillage) {
    formData.deceasedVillage = formData.applicantVillage;
  }
  if (formData.applicantTaluk && !formData.deceasedTaluk) {
    formData.deceasedTaluk = formData.applicantTaluk;
  }
  if (formData.applicantDistrict && !formData.deceasedDistrict) {
    formData.deceasedDistrict = formData.applicantDistrict;
  }
  if (!formData.deceasedGender && formData.applicantRelationToDeceased) {
    const r = formData.applicantRelationToDeceased;
    if (['അച്ഛൻ', 'ഭർത്താവ്', 'മകൻ', 'സഹോദരൻ', 'മുത്തച്ഛൻ', 'അമ്മായിയച്ഛൻ'].some(w => r.includes(w))) {
      formData.deceasedGender = 'Male';
    } else if (['അമ്മ', 'ഭാര്യ', 'മകൾ', 'സഹോദരി', 'മുത്തശ്ശി', 'അമ്മായിയമ്മ'].some(w => r.includes(w))) {
      formData.deceasedGender = 'Female';
    }
  }
  syncDerivedRelations();
  saveData();
}

function renderAutoFillBanner(s) {
  const banner = $('#autoFillBanner');
  if (s.key !== 'deceased') {
    banner.classList.add('hidden');
    banner.innerHTML = '';
    return;
  }
  syncPreliminaryToDeceased();
  banner.classList.remove('hidden');
  const isConfirmed = !!formData.deceasedDetailsConfirmed;
  banner.innerHTML = `
    <h4>✨ ഒന്നാം ഘട്ടത്തിൽ നിന്ന് മരണപ്പെട്ട വ്യക്തിയുടെ വിവരങ്ങൾ ഓട്ടോമാറ്റിക് ആയി എടുത്തിട്ടുണ്ട്</h4>
    <p>മരണപ്പെട്ട വ്യക്തിയുടെ പേര് (<b>${esc(formData.deceasedName || '-')}</b>), മരണത്തീയതി (<b>${esc(formData.deceasedDeathDate || '-')}</b>), വീട്ടുപേര്, വില്ലേജ് എന്നിവ താഴെ ഓട്ടോമാറ്റിക് ആയി ചേർത്തിട്ടുണ്ട്. അവ പരിശോധിച്ച് ഉറപ്പുവരുത്തുക.</p>
    <div class="autofill-actions">
      <label class="confirm-pill">
        <input type="checkbox" id="confirmDeceasedChk" ${isConfirmed ? 'checked' : ''}>
        <span>✓ മരണപ്പെട്ട വ്യക്തിയുടെ വിവരങ്ങൾ ശരിയാണെന്ന് ഞാൻ പരിശോധിച്ചു ഉറപ്പുവരുത്തി (Confirm Details)</span>
      </label>
      <button type="button" class="secondary" id="reCopyFromApplicantBtn" style="min-height:38px;padding:7px 12px;font-size:12.5px">↻ അപേക്ഷകന്റെ വിലാസം വീണ്ടും കോപ്പി ചെയ്യുക</button>
    </div>
  `;
  $('#confirmDeceasedChk')?.addEventListener('change', (e) => {
    formData.deceasedDetailsConfirmed = e.target.checked;
    saveData();
  });
  $('#reCopyFromApplicantBtn')?.addEventListener('click', () => {
    formData.deceasedName = formData.deceasedNamePreliminary || formData.deceasedName || '';
    formData.deceasedDeathDate = formData.deceasedDeathDatePreliminary || formData.deceasedDeathDate || '';
    formData.deceasedHouseName = formData.applicantHouseName || '';
    formData.deceasedAddress = formData.applicantAddress || '';
    formData.deceasedVillage = formData.applicantVillage || '';
    formData.deceasedTaluk = formData.applicantTaluk || '';
    formData.deceasedDistrict = formData.applicantDistrict || 'തൃശ്ശൂർ';
    saveData();
    renderStep();
  });
}

function updateButtonsForStep() {
  const s = step();
  const stepNames = ['Applicant', 'Deceased Person', 'Legal Heirs', 'Witness'];
  const alreadyDl = downloaded.has(s.key);

  $('#backBtn').classList.toggle('hidden', stepIndex === 0);

  if (alreadyDl) {
    $('#mainNextBtn').textContent = stepIndex === 3
      ? 'Next: Go to Documents & Summary →'
      : `Next Step (${stepNames[stepIndex + 1]}) / അടുത്ത ഘട്ടം →`;
    $('#manualRedownloadRow').classList.remove('hidden');
  } else {
    $('#mainNextBtn').textContent = `Save, Download ${stepNames[stepIndex]} File & Next →`;
    $('#manualRedownloadRow').classList.add('hidden');
  }
}

function renderStep() {
  const s = step();
  $('#stepEyebrow').textContent = `STEP ${stepIndex + 1} OF ${NEXIA_CONTENT.steps.length}`;
  $('#stepTitle').textContent = s.title;
  $('#stepBadge').textContent = `${stepIndex + 1} / ${NEXIA_CONTENT.steps.length}`;
  $('#progressFill').style.width = `${((stepIndex + 1) / NEXIA_CONTENT.steps.length) * 100}%`;
  $('#downloadStatus').classList.add('hidden');

  renderAutoFillBanner(s);
  updateButtonsForStep();

  const root = $('#fields');
  root.innerHTML = '';

  if (s.repeat === 'heirs') {
    renderHeirs(root);
  } else {
    s.fields.forEach(f => root.appendChild(makeField(f)));
  }

  root.querySelectorAll('input,textarea,select').forEach(el => {
    if (!el.name) return;
    el.addEventListener('input', () => {
      formData[el.name] = el.value;
      if (el.name === 'deceasedNamePreliminary') formData.deceasedName = el.value;
      if (el.name === 'deceasedDeathDatePreliminary') formData.deceasedDeathDate = el.value;
      syncDerivedRelations();
      updateAllGuardianPreviewPills();
      saveData();
      if (el.dataset.ageTarget) updateAge(el.name, el.dataset.ageTarget);
      if (el.name === 'deceasedDeathDate') updateAge('deceasedDob', 'deceasedAge');
    });
  });

  root.querySelectorAll('[data-age-target]').forEach(el => updateAge(el.name, el.dataset.ageTarget));
  updateAllGuardianPreviewPills();
}

function updateAllGuardianPreviewPills() {
  syncDerivedRelations();
  [
    { prefix: 'applicant', nameKey: 'applicantName', genderKey: 'applicantGender' },
    { prefix: 'deceased', nameKey: 'deceasedName', genderKey: 'deceasedGender' },
    { prefix: 'witness1', nameKey: 'witness1Name', genderKey: 'witness1Gender' },
    { prefix: 'witness2', nameKey: 'witness2Name', genderKey: 'witness2Gender' }
  ].forEach(cfg => {
    const pill = $('#preview-' + cfg.prefix);
    if (!pill) return;
    const gName = formData[cfg.prefix + 'GuardianName'] || '................';
    const pName = formData[cfg.nameKey] || '................';
    const relWord = formData[cfg.prefix + 'GuardianRelation'] || 'മകൻ/മകൾ';
    pill.innerHTML = `📄 ഫോമിൽ വരുന്ന രീതി: <b>"${esc(gName)} ${esc(relWord)} ${esc(pName)}"</b>`;
  });
}

function formatDateTyping(val) {
  const digits = val.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4, 8);
}

const GUARDIAN_TYPE_OPTIONS = [
  { value: 'Father', label: 'അച്ഛന്റെ പേര് (Father)' },
  { value: 'Mother', label: 'അമ്മയുടെ പേര് (Mother)' },
  { value: 'Husband', label: 'ഭർത്താവിന്റെ പേര് (Husband)' },
  { value: 'Wife', label: 'ഭാര്യയുടെ പേര് (Wife)' }
];

function makeField(f) {
  if (f.type === 'sectionHeader') {
    const sec = document.createElement('div');
    sec.className = 'sec-divider';
    sec.textContent = f.label;
    return sec;
  }

  const wrap = document.createElement('div');
  wrap.className = 'field' + (f.type === 'textarea' || f.warning || f.wide || f.type === 'guardianCombo' ? ' wide' : '');

  const label = document.createElement('label');
  label.htmlFor = f.id;
  label.innerHTML = esc(f.label) + (f.required ? ' <span class="required">*</span>' : '');
  wrap.appendChild(label);

  if (f.defaultValue && !formData[f.id]) {
    formData[f.id] = f.defaultValue;
  }

  if (f.type === 'guardianCombo') {
    const typeKey = f.typeId || (f.id + 'Type');
    if (!formData[typeKey]) formData[typeKey] = 'Father';

    const grid = document.createElement('div');
    grid.className = 'guardian-combo-grid';

    const sel = document.createElement('select');
    sel.id = typeKey;
    sel.name = typeKey;
    GUARDIAN_TYPE_OPTIONS.forEach(opt => {
      const o = document.createElement('option');
      o.value = opt.value;
      o.textContent = opt.label;
      if (formData[typeKey] === opt.value) o.selected = true;
      sel.appendChild(o);
    });

    const inp = document.createElement('input');
    inp.type = 'text';
    inp.id = f.id;
    inp.name = f.id;
    inp.value = formData[f.id] || '';
    inp.placeholder = 'പേര് ഇവിടെ ടൈപ്പ് ചെയ്യുക / Enter Name';

    grid.appendChild(sel);
    grid.appendChild(inp);
    wrap.appendChild(grid);

    const prefix = f.id.replace('GuardianName', '');
    const preview = document.createElement('div');
    preview.className = 'smart-rel-preview';
    preview.id = 'preview-' + prefix;
    wrap.appendChild(preview);

    return wrap;
  }

  let el;
  if (f.type === 'textarea') {
    el = document.createElement('textarea');
    el.id = f.id;
    el.name = f.id;
    el.value = formData[f.id] || '';
    el.placeholder = f.placeholder || '';
    wrap.appendChild(el);
  } else if (f.type === 'select') {
    el = document.createElement('select');
    el.id = f.id;
    el.name = f.id;
    const blank = document.createElement('option');
    blank.value = '';
    blank.textContent = 'Select / തിരഞ്ഞെടുക്കുക';
    el.appendChild(blank);
    (f.options || []).forEach(v => {
      const o = document.createElement('option');
      o.value = v.split(' / ')[0].trim();
      o.textContent = v;
      el.appendChild(o);
    });
    el.value = formData[f.id] || '';
    wrap.appendChild(el);
  } else if (f.type === 'dateCombo') {
    const combo = document.createElement('div');
    combo.className = 'date-combo-wrap';

    el = document.createElement('input');
    el.type = 'text';
    el.id = f.id;
    el.name = f.id;
    el.value = formData[f.id] || '';
    el.placeholder = 'DD/MM/YYYY (ടൈപ്പ് ചെയ്യാം / കലണ്ടർ തൊടാം)';
    el.maxLength = 10;
    el.inputMode = 'numeric';
    if (f.ageTarget) el.dataset.ageTarget = f.ageTarget;

    const calBtn = document.createElement('div');
    calBtn.className = 'date-cal-btn';
    calBtn.title = 'കലണ്ടറിൽ നിന്ന് തിരഞ്ഞെടുക്കുക';
    calBtn.innerHTML = '📅';

    const nativeDate = document.createElement('input');
    nativeDate.type = 'date';
    nativeDate.setAttribute('aria-label', f.label);
    nativeDate.value = toISO(el.value);

    el.addEventListener('input', () => {
      const formatted = formatDateTyping(el.value);
      if (el.value !== formatted) el.value = formatted;
      formData[f.id] = el.value;
      if (f.id === 'deceasedDeathDatePreliminary') formData.deceasedDeathDate = el.value;
      nativeDate.value = toISO(el.value);
      saveData();
      if (f.ageTarget) updateAge(f.id, f.ageTarget);
      if (f.id === 'deceasedDeathDate') updateAge('deceasedDob', 'deceasedAge');
    });

    nativeDate.addEventListener('change', () => {
      if (nativeDate.value) {
        const [y, m, d] = nativeDate.value.split('-');
        el.value = `${d}/${m}/${y}`;
        formData[f.id] = el.value;
        if (f.id === 'deceasedDeathDatePreliminary') formData.deceasedDeathDate = el.value;
        saveData();
        if (f.ageTarget) updateAge(f.id, f.ageTarget);
        if (f.id === 'deceasedDeathDate') updateAge('deceasedDob', 'deceasedAge');
      }
    });

    calBtn.appendChild(nativeDate);
    combo.appendChild(el);
    combo.appendChild(calBtn);
    wrap.appendChild(combo);

    const hint = document.createElement('div');
    hint.className = 'hint';
    hint.textContent = 'DD/MM/YYYY രീതിയിൽ നേരിട്ട് ടൈപ്പ് ചെയ്യാം അല്ലെങ്കിൽ വലതുവശത്തെ 📅 കലണ്ടർ ഐക്കണിൽ ക്ലിക്ക് ചെയ്യാം.';
    wrap.appendChild(hint);
  } else {
    el = document.createElement('input');
    el.type = f.type === 'tel' ? 'tel' : 'text';
    if (f.type === 'readonly') el.readOnly = true;
    if (f.type === 'digits' || f.type === 'tel') el.inputMode = 'numeric';
    el.id = f.id;
    el.name = f.id;
    el.value = formData[f.id] || '';
    el.placeholder = f.placeholder || (f.type === 'digits' ? 'അക്കങ്ങൾ മാത്രം നൽകുക' : '');
    if (f.maxLength) el.maxLength = f.maxLength;
    if (f.type === 'digits' || f.type === 'tel') {
      el.addEventListener('input', () => {
        el.value = el.value.replace(/\D/g, '').slice(0, f.maxLength || 20);
      });
    }
    if (f.ageTarget) el.dataset.ageTarget = f.ageTarget;
    wrap.appendChild(el);
  }

  if (f.warning) {
    const w = document.createElement('div');
    w.className = 'warning';
    w.textContent = f.warning;
    wrap.appendChild(w);
  }
  if (f.type === 'readonly') {
    const hint = document.createElement('div');
    hint.className = 'hint';
    hint.textContent = 'തീയതി നൽകുമ്പോൾ സ്വയം കണക്കാക്കും';
    wrap.appendChild(hint);
  }
  return wrap;
}

function toISO(v) {
  const d = parseDate(v);
  if (!d) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function renderHeirs(root) {
  const intro = document.createElement('p');
  intro.className = 'hint wide';
  intro.textContent = 'മരണപ്പെട്ട വ്യക്തിയുടെ എല്ലാ അവകാശികളെയും താഴെ ചേർക്കുക. പ്രിന്റ് ഫോമിൽ ആരെങ്കിലും വിട്ടുപോയിട്ടുണ്ടെങ്കിൽ എഴുതിച്ചേർക്കാൻ ഒരു ഒഴിഞ്ഞ വരിയും (Blank Row) ഒപ്പ് കോളവും തനിയെ ചേർക്കപ്പെടും.';
  root.appendChild(intro);

  const list = document.createElement('div');
  list.className = 'wide';
  list.id = 'heirList';
  root.appendChild(list);

  if ((!formData.heirs || !formData.heirs.length) && formData.applicantName) {
    const cleanAge = String(formData.applicantAge || '').replace(/\D/g, '').slice(0, 3);
    formData.heirs = [{
      name: formData.applicantName,
      age: cleanAge,
      relationship: '',
      mobile: formData.applicantMobile || '',
      address: formData.applicantHouseName || formData.applicantAddress || ''
    }];
  }

  const heirs = formData.heirs && formData.heirs.length ? formData.heirs : [{ name: '', age: '', relationship: '', occupation: '', address: '', mobile: '' }];
  heirs.forEach((h, i) => list.appendChild(heirCard(h, i)));

  const add = document.createElement('button');
  add.type = 'button';
  add.className = 'add-btn wide';
  add.textContent = '+ Add Legal Heir / അടുത്ത അവകാശിയെ ചേർക്കുക';
  add.onclick = () => {
    const arr = readHeirs();
    arr.push({ name: '', age: '', relationship: '', occupation: '', address: '', mobile: '' });
    formData.heirs = arr;
    saveData();
    renderStep();
  };
  root.appendChild(add);
}

const RELATION_OPTIONS = [
  'ഭാര്യ / Wife',
  'ഭർത്താവ് / Husband',
  'മകൻ / Son',
  'മകൾ / Daughter',
  'അച്ഛൻ / Father',
  'അമ്മ / Mother',
  'സഹോദരൻ / Brother',
  'സഹോദരി / Sister',
  'മരുമകൻ / Son-in-law',
  'മരുമകൾ / Daughter-in-law',
  'കൊച്ചുമകൻ / Grandson',
  'കൊച്ചുമകൾ / Granddaughter',
  'മുത്തച്ഛൻ / Grandfather',
  'മുത്തശ്ശി / Grandmother',
  'Other / മറ്റുള്ളവ'
];

function heirCard(h, i) {
  const card = document.createElement('div');
  card.className = 'repeat-card';
  card.innerHTML = `
    <div class="repeat-head">
      <h3>Legal Heir ${i + 1} / അവകാശി ${i + 1}</h3>
      ${i > 0 ? '<button class="remove-btn" type="button">Remove / ഒഴിവാക്കുക</button>' : ''}
    </div>
    <div class="fields">
      <div class="field">
        <label>Name / പേര് <span class="required">*</span></label>
        <input data-heir="name" value="${esc(h.name || '')}" required placeholder="പൂർണ്ണ പേര്">
      </div>
      <div class="field">
        <label>Age / വയസ്സ് <span class="required">*</span></label>
        <input data-heir="age" inputmode="numeric" value="${esc(h.age || '')}" required placeholder="വയസ്സ്">
      </div>
      <div class="field">
        <label>Relationship with Deceased / പരേതനുമായുള്ള ബന്ധം <span class="required">*</span></label>
        <select data-heir="relationship" required>
          <option value="">Select / തിരഞ്ഞെടുക്കുക</option>
          ${RELATION_OPTIONS.map(x => {
            const val = x.split(' / ')[0].trim();
            return `<option value="${esc(val)}" ${(h.relationship === val || h.relationship === x) ? 'selected' : ''}>${esc(x)}</option>`;
          }).join('')}
        </select>
      </div>
      <div class="field">
        <label>Mobile Number / മൊബൈൽ നമ്പർ</label>
        <input data-heir="mobile" inputmode="numeric" maxlength="10" value="${esc(h.mobile || '')}" placeholder="10 അക്ക നമ്പർ">
      </div>
      <div class="field wide">
        <label>Address or Remarks / വിലാസം അല്ലെങ്കിൽ മറ്റ് വിവരങ്ങൾ</label>
        <input data-heir="address" value="${esc(h.address || '')}" placeholder="വിലാസം">
      </div>
    </div>
  `;
  card.querySelectorAll('[data-heir]').forEach(el => {
    el.addEventListener('input', () => {
      formData.heirs = readHeirs();
      saveData();
    });
  });
  const rm = card.querySelector('.remove-btn');
  if (rm) {
    rm.onclick = () => {
      formData.heirs = readHeirs().filter((_, j) => j !== i);
      saveData();
      renderStep();
    };
  }
  return card;
}

function readHeirs() {
  return [...document.querySelectorAll('.repeat-card')].map(c => {
    const o = {};
    c.querySelectorAll('[data-heir]').forEach(el => o[el.dataset.heir] = el.value.trim());
    return o;
  });
}

function parseDate(v) {
  const m = /^(\d{2})[\/-](\d{2})[\/-](\d{4})$/.exec((v || '').trim());
  if (!m) return null;
  const d = new Date(+m[3], +m[2] - 1, +m[1]);
  return d.getFullYear() === +m[3] && d.getMonth() === +m[2] - 1 && d.getDate() === +m[1] ? d : null;
}

function updateAge(dateId, target) {
  const d = parseDate($('#' + dateId)?.value);
  const out = $('#' + target);
  if (!out) return;
  if (!d) return;
  const now = dateId === 'deceasedDob' ? (parseDate($('#deceasedDeathDate')?.value) || new Date()) : new Date();
  let y = now.getFullYear() - d.getFullYear();
  let m = now.getMonth() - d.getMonth();
  let day = now.getDate() - d.getDate();
  if (day < 0) {
    m--;
    day += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (m < 0) {
    y--;
    m += 12;
  }
  out.value = `${y}`;
  formData[target] = out.value;
  saveData();
}

function validate() {
  const s = step();
  if (s.repeat === 'heirs') {
    const hs = readHeirs();
    if (!hs.length || hs.some(h => !h.name || !h.age || !h.relationship)) {
      alert('എല്ലാ അവകാശികളുടെയും പേര്, വയസ്സ്, ബന്ധം എന്നിവ നിർബന്ധമായും നൽകുക.');
      return false;
    }
    formData.heirs = hs;
    saveData();
    return true;
  }
  for (const f of s.fields) {
    if (f.type === 'sectionHeader') continue;
    const el = $('#' + f.id);
    if (!el) continue;
    const v = el.value.trim();
    if (f.required && !v) {
      alert('ദയവായി പൂരിപ്പിക്കുക: ' + f.label);
      el.focus();
      return false;
    }
    if (v && f.type === 'dateCombo' && !parseDate(v)) {
      alert('തീയതി DD/MM/YYYY എന്ന രീതിയിൽ നൽകുക: ' + f.label);
      el.focus();
      return false;
    }
    if (v && (f.type === 'tel' || f.id.toLowerCase().includes('mobile')) && v.length !== 10) {
      alert('മൊബൈൽ നമ്പർ കൃത്യമായി 10 അക്കമായിരിക്കണം.');
      el.focus();
      return false;
    }
    if (v && f.id.toLowerCase().includes('aadhaar') && v.replace(/\D/g, '').length !== 12) {
      alert('ആധാർ നമ്പർ കൃത്യമായി 12 അക്കമായിരിക്കണം.');
      el.focus();
      return false;
    }
  }
  s.fields.forEach(f => {
    if (f.type === 'sectionHeader') return;
    const el = $('#' + f.id);
    if (el) formData[f.id] = el.value.trim();
    if (f.type === 'guardianCombo' && f.typeId) {
      const sel = $('#' + f.typeId);
      if (sel) formData[f.typeId] = sel.value;
    }
  });
  syncPreliminaryToDeceased();
  saveData();
  return true;
}

async function deriveInternalKey(salt) {
  const enc = new TextEncoder();
  const material = await crypto.subtle.importKey('raw', enc.encode(NEXIA_INTERNAL_SECRET), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
}

async function encryptedBlob(payload, id) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveInternalKey(salt);
  const plain = new TextEncoder().encode(JSON.stringify(payload, null, 2));
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plain);
  const out = {
    format: 'Nexia encrypted data v2-passwordless',
    fileId: id,
    step: payload.step,
    cipher: 'AES-256-GCM',
    salt: b64(salt),
    iv: b64(iv),
    data: b64(new Uint8Array(cipher))
  };
  return new Blob([JSON.stringify(out)], { type: 'application/octet-stream' });
}

function b64(bytes) {
  let s = '';
  bytes.forEach(b => s += String.fromCharCode(b));
  return btoa(s);
}

function safeName() {
  return String(formData.applicantName || 'Customer').trim().replace(/[<>:"/\\|?*\x00-\x1F]/g, '').replace(/\s+/g, '_').slice(0, 50) || 'Customer';
}

async function performStepFileDownload(advanceAfterModal = true) {
  if (!validate()) return;
  const s = step();
  const id = String(1001 + stepIndex);

  const stepData = s.repeat === 'heirs'
    ? { heirs: formData.heirs }
    : Object.fromEntries(s.fields.filter(f => f.type !== 'sectionHeader').map(f => [f.id, formData[f.id] || '']));

  syncDerivedRelations();
  if (s.key === 'applicant') {
    stepData.applicantGuardianType = formData.applicantGuardianType || 'Father';
    stepData.applicantGuardianRelation = formData.applicantGuardianRelation || '';
  } else if (s.key === 'deceased') {
    stepData.deceasedGuardianType = formData.deceasedGuardianType || 'Father';
    stepData.deceasedGuardianRelation = formData.deceasedGuardianRelation || '';
  } else if (s.key === 'witnesses') {
    stepData.witness1GuardianType = formData.witness1GuardianType || 'Father';
    stepData.witness1GuardianRelation = formData.witness1GuardianRelation || '';
    stepData.witness2GuardianType = formData.witness2GuardianType || 'Father';
    stepData.witness2GuardianRelation = formData.witness2GuardianRelation || '';
  }

  const payload = {
    brand: NEXIA_CONTENT.brand,
    step: s.key,
    title: s.title,
    createdAt: new Date().toISOString(),
    data: stepData,
    fullSnapshot: formData
  };

  try {
    const blob = await encryptedBlob(payload, id);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    const fileType = {
      applicant: '1_Applicant_Data',
      deceased: '2_Deceased_Data',
      heirs: '3_Legal_Heirs_Data',
      witnesses: '4_Witness_Data'
    }[s.key] || 'Data';
    a.download = `Nexia_${safeName()}_${fileType}.nxd`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
    downloaded.add(s.key);
    saveData();
    updateButtonsForStep();

    if (advanceAfterModal) {
      showModal(
        s.title,
        `ഈ ഘട്ടത്തിലെ എൻക്രിപ്റ്റഡ് ഫയൽ (${a.download}) ഫോണിൽ ഡൗൺലോഡ് ആയിട്ടുണ്ട്.\n\nഇനി പിന്നിലേക്കോ മുന്നിലേക്കോ പോകുമ്പോൾ ഈ ഫയൽ വീണ്ടും തനിയെ ഡൗൺലോഡ് ആകില്ല.`
      );
    } else {
      const st = $('#downloadStatus');
      st.textContent = `✓ ${a.download} വീണ്ടും ഡൗൺലോഡ് ചെയ്തു!`;
      st.classList.remove('hidden');
    }
  } catch (e) {
    alert('എൻക്രിപ്റ്റഡ് ഡൗൺലോഡ് പൂർത്തിയാക്കാൻ സാധിച്ചില്ല. ദയവായി Chrome അല്ലെങ്കിൽ Edge ബ്രൗസർ ഉപയോഗിക്കുക.');
  }
}

function goToNextStepClean() {
  if (stepIndex < 3) {
    stepIndex++;
    renderStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    showChecklist();
  }
}

$('#mainNextBtn').addEventListener('click', async () => {
  if (!validate()) return;
  const s = step();
  if (downloaded.has(s.key)) {
    goToNextStepClean();
  } else {
    await performStepFileDownload(true);
  }
});

$('#manualRedownloadBtn').addEventListener('click', async () => {
  await performStepFileDownload(false);
});

function showModal(title, msg) {
  $('#modalTitle').textContent = 'File Downloaded / ഫയൽ ഡൗൺലോഡ് ചെയ്തു';
  $('#modalText').textContent = msg;
  $('#modalNext').textContent = stepIndex === 3 ? 'രേഖകളുടെ ലിസ്റ്റിലേക്കും സമ്മറി ഫയലിലേക്കും പോകുക →' : 'അടുത്ത ഘട്ടത്തിലേക്ക് പോകുക →';
  $('#modal').classList.remove('hidden');
}

function defaultModalNext() {
  $('#modal').classList.add('hidden');
  goToNextStepClean();
}

$('#modalNext').addEventListener('click', defaultModalNext);

$('#backBtn').addEventListener('click', () => {
  if (stepIndex > 0) {
    stepIndex--;
    renderStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

$('#backFromFinishBtn')?.addEventListener('click', () => {
  stepIndex = 3;
  show('app');
  renderStep();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

$('#homeBtn').addEventListener('click', () => {
  if (confirm('ഹോം പേജിലേക്ക് മടങ്ങണോ? താങ്കൾ ഇതുവരെ നൽകിയ വിവരങ്ങൾ സുരക്ഷിതമായി ബ്രൗസറിൽ ഉണ്ടാകും.')) show('welcome');
});

$('#resetBtn').addEventListener('click', () => {
  if (confirm('മുന്നറിയിപ്പ്: താങ്കൾ നൽകിയ എല്ലാ വിവരങ്ങളും മായ്ക്കപ്പെടും. തുടരണമോ?')) {
    localStorage.removeItem('nexiaLegalHeirDraftV4');
    formData = {};
    downloaded.clear();
    summaryAutoDownloaded = false;
    stepIndex = 0;
    show('welcome');
  }
});

function generateReadableSummaryHTML() {
  syncDerivedRelations();
  const rows = [];
  NEXIA_CONTENT.steps.forEach(s => {
    if (s.repeat === 'heirs') {
      (formData.heirs || []).forEach((h, idx) => {
        rows.push({
          section: '3. അവകാശികളുടെ വിവരങ്ങൾ (Legal Heirs)',
          label: `അവകാശി ${idx + 1} (Heir ${idx + 1})`,
          value: `പേര്: ${h.name || ''} | വയസ്സ്: ${h.age || ''} | ബന്ധം: ${h.relationship || ''} | ഫോൺ: ${h.mobile || '-'} | വിലാസം: ${h.address || '-'}`
        });
      });
    } else {
      s.fields.filter(f => f.type !== 'sectionHeader').forEach(f => {
        let val = formData[f.id] || '-';
        if (f.type === 'guardianCombo' && f.typeId) {
          const gType = formData[f.typeId] || 'Father';
          const relKey = f.id.replace('GuardianName', 'GuardianRelation');
          val = `${val} (${gType} -> ഫോമിൽ: ${formData[relKey] || ''})`;
        }
        rows.push({
          section: s.title,
          label: f.label,
          value: val
        });
      });
    }
  });

  const embeddedJson = JSON.stringify(formData).replace(/</g, '\\u003c');
  const waMsg = encodeURIComponent(
    `നമസ്കാരം Nexia Virtual Desk,\nലീഗൽ ഹെയർഷിപ്പ് അപേക്ഷയ്ക്കുള്ള വിവരങ്ങൾ ഞാൻ പൂർത്തിയാക്കിയിട്ടുണ്ട്.\nഅപേക്ഷകന്റെ പേര്: ${formData.applicantName || ''}\nഇതോടൊപ്പം ഡൗൺലോഡ് ചെയ്ത ഫയലുകൾ അയക്കുന്നു.`
  );

  return `<!doctype html>
<html lang="ml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Nexia Virtual Desk | Customer Application Summary - ${esc(formData.applicantName || '')}</title>
<style>
  :root{--navy:#0b1d30;--navy2:#163b5e;--teal:#10b981;--bg:#f1f6fb;--card:#ffffff;--ink:#132538;--muted:#5b7083}
  *{box-sizing:border-box}
  body{margin:0;font-family:Inter,system-ui,-apple-system,"Noto Sans Malayalam",sans-serif;background:var(--bg);color:var(--ink);line-height:1.6}
  .hero{background:linear-gradient(125deg,var(--navy),var(--navy2));color:#fff;padding:28px 20px;box-shadow:0 8px 30px #0b1d3025}
  .hero-inner{max-width:920px;margin:0 auto;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px}
  .brand-row{display:flex;align-items:center;gap:14px}
  .logo{width:50px;height:50px;border-radius:14px;background:linear-gradient(135deg,#2dd4bf,#059669);display:grid;place-items:center;font-weight:900;font-size:26px;color:#fff}
  .brand-title{font-size:20px;font-weight:850;letter-spacing:1.2px}
  .brand-sub{font-size:12.5px;color:#bde0fe}
  .badge-2025{background:#ffffff1a;border:1px solid #ffffff38;padding:7px 14px;border-radius:99px;font-size:12px;color:#a7f3d0}
  .container{max-width:920px;margin:24px auto;padding:0 16px}
  .alert-card{background:linear-gradient(135deg,#fffbeb,#fef3c7);border-left:5px solid #f59e0b;border-radius:16px;padding:20px;margin-bottom:22px;box-shadow:0 10px 25px #00000008}
  .alert-card h2{margin:0 0 8px;font-size:19px;color:#92400e}
  .alert-card p{margin:6px 0;font-size:14.5px;color:#78350f;font-weight:600}
  .wa-box{background:#064e3b;color:#ecfdf5;padding:14px 18px;border-radius:12px;margin-top:12px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;font-size:14px}
  .wa-url{font-family:monospace;background:#042f2e;padding:6px 12px;border-radius:8px;color:#6ee7b7;user-select:all;font-size:14px}
  .search-wrap{background:var(--card);padding:16px;border-radius:16px;box-shadow:0 6px 20px #00000006;margin-bottom:22px;display:flex;gap:12px;align-items:center;border:1px solid #dce6f0}
  .search-wrap input{width:100%;border:1.5px solid #cbd5e1;border-radius:12px;padding:13px 16px;font-size:15px;outline:none}
  .search-wrap input:focus{border-color:#0d9488;box-shadow:0 0 0 3px #14b8a625}
  .data-card{background:var(--card);border-radius:18px;padding:22px;margin-bottom:22px;box-shadow:0 10px 28px #0b1d300a;border:1px solid #e2e8f0}
  .data-row{display:grid;grid-template-columns:1fr 1.4fr;gap:12px;padding:12px 10px;border-bottom:1px solid #f1f5f9;align-items:start}
  .data-row:last-child{border-bottom:0}
  .data-sec{font-size:11px;font-weight:800;color:#0d9488;text-transform:uppercase;letter-spacing:1px;grid-column:1/-1;margin-top:10px;padding-bottom:4px;border-bottom:2px solid #ccfbf1}
  .data-label{font-weight:700;color:#334155;font-size:14px}
  .data-val{font-weight:600;color:#0f172a;font-size:14.5px;background:#f8fafc;padding:8px 12px;border-radius:8px;border:1px solid #e2e8f0}
  .ad-banner{background:linear-gradient(135deg,#0f172a,#1e3a8a);color:#fff;border-radius:20px;padding:26px;margin:26px 0;box-shadow:0 16px 36px #0f172a30}
  .ad-banner h3{margin:0 0 10px;font-size:22px;color:#38bdf8}
  .ad-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:18px 0}
  .ad-item{background:#ffffff12;border:1px solid #ffffff22;padding:14px;border-radius:14px}
  .ad-item b{display:block;color:#67e8f9;margin-bottom:6px;font-size:14px}
  .ad-item span{font-size:13px;color:#e0f2fe}
  .wa-now-cta{
    display:block;
    width:100%;
    text-align:center;
    background:linear-gradient(120deg,#16a34a,#059669);
    color:#fff;
    text-decoration:none;
    font-size:18px;
    font-weight:800;
    padding:18px 24px;
    border-radius:16px;
    box-shadow:0 12px 28px #16a34a45;
    margin:24px 0 12px;
    border:0;
    cursor:pointer;
  }
  .wa-now-cta:hover{opacity:.95}
  footer{text-align:center;padding:24px;color:var(--muted);font-size:13px}
  @media(max-width:640px){.data-row,.ad-grid{grid-template-columns:1fr}}
</style>
</head>
<body>
<header class="hero">
  <div class="hero-inner">
    <div class="brand-row">
      <div class="logo">N</div>
      <div>
        <div class="brand-title">NEXIA VIRTUAL DESK</div>
        <div class="brand-sub">Digital Application & Resume Service Center | Olarikkara, Thrissur</div>
      </div>
    </div>
    <div class="badge-2025">● Verified Customer Data Copy</div>
  </div>
</header>

<div class="container">
  <div class="alert-card">
    <h2>📌 പ്രധാന അറിയിപ്പ് (Important Customer Instruction)</h2>
    <p>താങ്കൾ നൽകிய പൂർണ്ണമായ ഡാറ്റ ഇതാണ്. ഈ ഡാറ്റ ഉപയോഗിച്ചുകൊണ്ടായിരിക്കും അപേക്ഷകൾ നൽകപ്പെടുക.</p>
    <p>താഴെ കാണുന്ന വിവരങ്ങൾ എല്ലാം ശരിയാണെന്ന് ഉറപ്പുവരുത്തുക. തുടർന്ന് <b>ഈ HTML ഫയലും, ഇതോടൊപ്പം ഡൗൺലോഡ് ആയ മറ്റ് 4 എൻക്രിപ്റ്റഡ് (.nxd) ഫയലുകളും, ആവശ്യമായ രേഖകളും</b> ചേർത്ത് Nexia Virtual Desk ന്റെ WhatsApp നമ്പറിലേക്ക് അയച്ചു തരാൻ താല്പര്യപ്പെടുന്നു.</p>
    <div class="wa-box">
      <span>📲 <b>Nexia WhatsApp Number:</b> +91 9961850698</span>
      <span class="wa-url">https://wa.me/919961850698</span>
    </div>
  </div>

  <div class="search-wrap">
    <input type="search" id="searchInput" placeholder="🔍 താങ്കൾ നൽകിയ വിവരങ്ങൾ ഇവിടെ സെർച്ച് ചെയ്യാം (ഉദാ: പേര്, ആധാർ, വില്ലേജ്, അവകാശികൾ)...">
  </div>

  <div class="data-card" id="dataContainer">
    ${rows.map((r, i) => `
      ${(i === 0 || rows[i - 1].section !== r.section) ? `<div class="data-sec">${esc(r.section)}</div>` : ''}
      <div class="data-row" data-search="${esc((r.section + ' ' + r.label + ' ' + r.value).toLowerCase())}">
        <div class="data-label">${esc(r.label)}</div>
        <div class="data-val">${esc(r.value)}</div>
      </div>
    `).join('')}
  </div>

  <div class="ad-banner">
    <h3>🌟 NEXIA VIRTUAL DESK - സേവനങ്ങൾ വീട്ടിലിരുന്ന്!</h3>
    <p>ഇനി ഓൺലൈൻ അപേക്ഷകൾക്കായി നേരിട്ട് ഓഫീസിൽ വരേണ്ടതില്ല! എല്ലാ സേവനങ്ങൾക്കും ഞങ്ങളുടെ WhatsApp നമ്പറിലേക്ക് രേഖകൾ അയച്ചു നൽകിയാൽ മതിയാകും.</p>
    <div class="ad-grid">
      <div class="ad-item">
        <b>📄 എല്ലാ ഓൺലൈൻ അപേക്ഷകളും</b>
        <span>വില്ലേജ് ഓഫീസ്, പഞ്ചായത്ത്, റവന്യൂ സർട്ടിഫിക്കറ്റുകൾ, ലീഗൽ ഹെയർഷിപ്പ്, പാൻ കാർഡ്, പാസ്പോർട്ട് സേവനങ്ങൾ.</span>
      </div>
      <div class="ad-item">
        <b>🎓 Resume / Biodata / CV Creation</b>
        <span>സ്വദേശത്തും വിദേശത്തും ജോലിക്ക് അപേക്ഷിക്കാൻ ആകർഷകമായ ആധുനിക Resume, Biodata, CV എന്നിവ തയ്യാറാക്കി നൽകുന്നു.</span>
      </div>
      <div class="ad-item">
        <b>🚗 വാഹന ഇൻഷുറൻസ് സേവനങ്ങൾ</b>
        <span>മോട്ടോർ വാഹന ഇൻഷുറൻസ് പോളിസികൾ മിതമായ നിരക്കിൽ വേഗത്തിൽ പുതുക്കി നൽകുന്നു.</span>
      </div>
    </div>
    <div class="wa-box">
      <span>ബന്ധപ്പെടേണ്ട WhatsApp നമ്പർ: <b>+91 9961850698</b></span>
      <span class="wa-url">https://wa.me/919961850698</span>
    </div>
  </div>

  <button type="button" class="wa-now-cta" onclick="window.open('https://wa.me/919961850698?text=${waMsg}', '_blank')">
    💬 WhatsApp Now (+91 9961850698) / ഫയലുകൾ ഇപ്പോൾ വാട്സാപ്പിൽ അയയ്ക്കുക ↗
  </button>
  <div style="text-align:center;font-size:13px;color:#475569;margin-bottom:20px">
    Direct WhatsApp Link: https://wa.me/919961850698
  </div>
</div>

<footer>
  <b>NEXIA VIRTUAL DESK</b> · Olarikkara, Thrissur, Kerala · WhatsApp: +91 9961850698 (https://wa.me/919961850698)
</footer>

<script id="nexia-raw-payload" type="application/json">${embeddedJson}<\/script>
<script>
  document.getElementById('searchInput').addEventListener('input', function(e) {
    const q = e.target.value.toLowerCase().trim();
    document.querySelectorAll('.data-row').forEach(function(row) {
      row.style.display = (!q || row.getAttribute('data-search').includes(q)) ? 'grid' : 'none';
    });
  });
<\/script>
</body>
</html>`;
}

function downloadReadableSummary() {
  const htmlContent = generateReadableSummaryHTML();
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `Nexia_${safeName()}_5_Full_Data_Summary.html`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  summaryAutoDownloaded = true;
  saveData();
  $('#summaryDownloadDone').classList.remove('hidden');
}

$('#downloadSummaryHtmlBtn')?.addEventListener('click', downloadReadableSummary);

function showChecklist() {
  const list = $('#fileList');
  list.innerHTML = '';
  NEXIA_CONTENT.documents.forEach((d, i) => {
    const row = document.createElement('label');
    row.className = 'file-item';
    row.innerHTML = `<input type="checkbox" value="${i}"> <span>${esc(d)}</span>`;
    list.appendChild(row);
  });

  if (!summaryAutoDownloaded) {
    downloadReadableSummary();
  } else {
    $('#summaryDownloadDone').classList.remove('hidden');
  }

  $('#whatsappBtn').onclick = () => {
    const checked = [...list.querySelectorAll('input:checked')].map(x => NEXIA_CONTENT.documents[+x.value]);
    window.__nexiaWhatsAppText =
      `നമസ്കാരം Nexia Virtual Desk,\n` +
      `ലീഗൽ ഹെയർഷിപ്പ് അപേക്ഷയ്ക്കുള്ള വിവരങ്ങൾ ഞാൻ പൂർത്തിയാക്കിയിട്ടുണ്ട്.\n` +
      `അപേക്ഷകന്റെ പേര്: ${formData.applicantName || ''}\n\n` +
      `ഡൗൺലോഡ് ചെയ്ത 4 എൻക്രിപ്റ്റഡ് (.nxd) ഫയലുകളും 1 Readable HTML Summary ഫയലും ഇതോടൊപ്പം അയക്കുന്നു.\n\n` +
      `കൈവശമുള്ള രേഖകൾ:\n${checked.length ? checked.join('\n') : 'രേഖകളുടെ പകർപ്പുകൾ ഇതോടൊപ്പം ചേർക്കുന്നു.'}`;

    $('#modalTitle').textContent = 'WhatsApp വഴി ഫയലുകൾ അയയ്ക്കേണ്ട വിധം';
    $('#modalText').innerHTML =
      `1. താങ്കളുടെ ഫോണിൽ ഡൗൺലോഡ് ആയ <b>4 എൻക്രിപ്റ്റഡ് (.nxd) ഫയലുകളും</b>, <b>1 Readable HTML Summary ഫയലും</b> (മൊത്തം 5 ഫയലുകൾ) തിരഞ്ഞെടുക്കുക.\n` +
      `2. താഴെ കാണുന്ന ബട്ടൺ അമർത്തി Nexia യുടെ WhatsApp ചാറ്റ് തുറക്കുക.\n` +
      `3. WhatsApp-ൽ 📎 Attach → Document വഴി ഈ 5 ഫയലുകളും ആവശ്യമായ രേഖകളുടെ പകർപ്പുകളും ചേർത്ത് അയച്ചു തരാൻ താല്പര്യപ്പെടുന്നു.\n\n` +
      `WhatsApp Direct URL:\nhttps://wa.me/919961850698`;
    $('#modalNext').textContent = 'Open WhatsApp / വാട്സാപ്പ് തുറക്കുക';
    $('#modalNext').onclick = () => {
      window.open(`https://wa.me/${NEXIA_CONTENT.whatsapp}?text=${encodeURIComponent(window.__nexiaWhatsAppText)}`, '_blank', 'noopener');
      $('#modal').classList.add('hidden');
      $('#modalNext').onclick = defaultModalNext;
    };
    $('#modal').classList.remove('hidden');
  };

  show('finish');
  saveData();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

$('#restartBtn').addEventListener('click', () => {
  if (confirm('പുതിയ അപേക്ഷ തുടങ്ങണോ? നിലവിലെ വിവരങ്ങൾ ബ്രൗസറിൽ നിന്ന് മായ്ക്കപ്പെടും.')) {
    localStorage.removeItem('nexiaLegalHeirDraftV4');
    formData = {};
    downloaded.clear();
    summaryAutoDownloaded = false;
    stepIndex = 0;
    show('welcome');
  }
});

function esc(v) {
  return String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
