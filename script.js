
function setErr(id, msg) {
  const el = document.getElementById('err-' + id);
  const input = document.getElementById(id);
  if (el) el.textContent = msg;
  if (input) input.classList.toggle('invalid', !!msg);
}

function validate() {
  let ok = true;
  const numFields = [
    { id: 'age',    min: 1,  max: 120, label: 'Age' },
    { id: 'weight', min: 1,  max: 500, label: 'Weight' },
    { id: 'height', min: 50, max: 300, label: 'Height' }
  ];
  numFields.forEach(f => {
    const v = parseFloat(document.getElementById(f.id).value);
    if (!document.getElementById(f.id).value || isNaN(v)) {
      setErr(f.id, f.label + ' is required.'); ok = false;
    } else if (v < f.min || v > f.max) {
      setErr(f.id, f.label + ' must be ' + f.min + '–' + f.max + '.'); ok = false;
    } else {
      setErr(f.id, '');
    }
  });
  if (!document.getElementById('gender').value) {
    setErr('gender', 'Please select a gender.'); ok = false;
  } else { setErr('gender', ''); }
  if (!document.getElementById('activity').value) {
    setErr('activity', 'Please select an activity level.'); ok = false;
  } else { setErr('activity', ''); }
  return ok;
}

function calculate() {
  if (!validate()) return;
  const age    = parseFloat(document.getElementById('age').value);
  const gender = document.getElementById('gender').value;
  const weight = parseFloat(document.getElementById('weight').value);
  const height = parseFloat(document.getElementById('height').value);
  const act    = parseFloat(document.getElementById('activity').value);
  const goal   = document.getElementById('goal').value;

  let bmr = 10 * weight + 6.25 * height - 5 * age + (gender === 'male' ? 5 : -161);
  bmr = Math.round(bmr);

  const maintain = Math.round(bmr * act);
  const loseMin  = maintain - 500;
  const loseMax  = maintain - 300;
  const gainMin  = maintain + 250;
  const gainMax  = maintain + 500;

  const bmi    = parseFloat((weight / ((height / 100) ** 2)).toFixed(1));
  const bmiCat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal weight' : bmi < 30 ? 'Overweight' : 'Obese';

  document.getElementById('r-bmr').textContent     = bmr.toLocaleString();
  document.getElementById('r-maintain').textContent = maintain.toLocaleString();
  document.getElementById('r-bmi').textContent      = bmi;
  document.getElementById('r-bmi-cat').textContent  = bmiCat;

  document.getElementById('bl-bmr').textContent      = bmr.toLocaleString() + ' kcal';
  document.getElementById('bl-maintain').textContent  = maintain.toLocaleString() + ' kcal';
  document.getElementById('bl-lose').textContent      = loseMin.toLocaleString() + ' kcal';
  document.getElementById('bl-gain').textContent      = gainMin.toLocaleString() + ' kcal';

  const maxVal = gainMax;
  function pct(v) { return Math.min(Math.round(v / maxVal * 100), 100) + '%'; }

  setTimeout(() => {
    document.getElementById('bar-bmr').style.width      = pct(bmr);
    document.getElementById('bar-maintain').style.width  = pct(maintain);
    document.getElementById('bar-lose').style.width      = pct(loseMin);
    document.getElementById('bar-gain').style.width      = pct(gainMin);
  }, 120);

  document.getElementById('r-lose').textContent      = loseMin.toLocaleString() + ' – ' + loseMax.toLocaleString() + ' kcal/day';
  document.getElementById('r-maintain2').textContent  = maintain.toLocaleString() + ' kcal/day';
  document.getElementById('r-gain').textContent      = gainMin.toLocaleString() + ' – ' + gainMax.toLocaleString() + ' kcal/day';

  const tips = {
    lose:     'Your goal is weight loss. Aim for ' + loseMin.toLocaleString() + '–' + loseMax.toLocaleString() + ' kcal/day — a moderate deficit supporting sustainable fat loss of ~0.25–0.5 kg per week without excessive muscle loss.',
    maintain: 'Your goal is to maintain weight. Target ' + maintain.toLocaleString() + ' kcal/day. Track for a few weeks to fine-tune — individual metabolism varies from equations by ±10–15%.',
    gain:     'Your goal is to gain weight. Target ' + gainMin.toLocaleString() + '–' + gainMax.toLocaleString() + ' kcal/day. A modest surplus with adequate protein (1.6–2.2 g/kg) maximises lean muscle gain while limiting fat accumulation.'
  };
  document.getElementById('goal-tip').textContent = tips[goal];

  const res = document.getElementById('results');
  res.classList.add('show');
  setTimeout(() => res.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
}

function resetForm() {
  ['age', 'weight', 'height'].forEach(id => { document.getElementById(id).value = ''; setErr(id, ''); });
  ['gender', 'activity'].forEach(id => { document.getElementById(id).value = ''; setErr(id, ''); });
  document.getElementById('goal').value = 'maintain';
  document.getElementById('results').classList.remove('show');
  ['bar-bmr','bar-maintain','bar-lose','bar-gain'].forEach(id => {
    document.getElementById(id).style.width = '0';
  });
}
