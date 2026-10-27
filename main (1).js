// ---------- Cookie ----------
function saveColors() {
  const value = encodeURIComponent(JSON.stringify(colors));
  // 3 години = 3 * 60 * 60 секунд
  document.cookie = 'colors=' + value + '; max-age=' + (3 * 60 * 60) + '; path=/';
}

function loadColors() {
  const parts = document.cookie.split('; ');
  for (const part of parts) {
    if (part.startsWith('colors=')) {
      try {
        return JSON.parse(decodeURIComponent(part.substring(7)));
      } catch (e) {
        return [];
      }
    }
  }
  return [];
}

// ---------- Дані ----------
const colors = loadColors();

const paletteEl = document.getElementById('palette');
const form = document.getElementById('form');
const nameInput = document.getElementById('name');
const typeSelect = document.getElementById('type');
const codeInput = document.getElementById('code');
const nameError = document.getElementById('nameError');
const codeError = document.getElementById('codeError');

// ---------- Відображення ----------
function cssColor(color) {
  if (color.type === 'RGB') return 'rgb(' + color.code + ')';
  if (color.type === 'RGBA') return 'rgba(' + color.code + ')';
  return color.code;
}

function render() {
  paletteEl.innerHTML = '';
  for (const color of colors) {
    const div = document.createElement('div');
    div.className = 'color';
    div.style.background = cssColor(color);
    div.innerHTML = '<span>' + color.name + '<br>' + color.code + '</span>';
    paletteEl.appendChild(div);
  }
}

// ---------- Валідація ----------
function checkName(name) {
  if (name === '') return "Назва обов'язкова";
  if (!/^[A-Za-zА-Яа-яІіЇїЄєҐґ]+$/.test(name)) return 'Назва має містити лише літери';
  for (const c of colors) {
    if (c.name.toLowerCase() === name.toLowerCase()) return 'Така назва вже існує';
  }
  return '';
}

function checkCode(type, code) {
  if (code === '') return 'Введіть код кольору';

  if (type === 'HEX') {
    if (!/^#[0-9A-Fa-f]{6}$/.test(code)) return 'HEX: символ # та 6 символів 0-9, A-F';
    return '';
  }

  const nums = code.split(',').map(s => s.trim());
  const count = type === 'RGB' ? 3 : 4;
  if (nums.length !== count) return type + ': потрібно ' + count + ' числа через кому';

  for (let i = 0; i < nums.length; i++) {
    if (!/^\d+(\.\d+)?$/.test(nums[i])) return 'Усі значення мають бути числами';
    const n = Number(nums[i]);
    if (i < 3 && (n < 0 || n > 255)) return 'R, G, B мають бути від 0 до 255';
    if (i === 3 && (n < 0 || n > 1)) return 'Alpha має бути від 0 до 1';
  }
  return '';
}

// ---------- Події ----------
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const type = typeSelect.value;
  const code = codeInput.value.trim();

  nameError.textContent = checkName(name);
  codeError.textContent = checkCode(type, code);

  if (nameError.textContent || codeError.textContent) return;

  colors.push({ name: name, type: type, code: code });
  saveColors();
  render();
  form.reset();
});

render();
