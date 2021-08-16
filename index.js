const FILTERS = {
  contrast: {
    default: 100,
    current: 100,
    sizing: '%'
  },
  brightness: {
    default: 100,
    current: 100,
    sizing: '%'
  },
  saturate: {
    default: 100,
    current: 100,
    sizing: '%'
  },
  sepia: {
    default: 0,
    current: 0,
    sizing: '%'
  },
  'hue-rotate': {
    default: 0,
    current: 0,
    sizing: 'deg'
  },
  grayscale: {
    default: 0,
    current: 0,
    sizing: '%'
  },
  invert: {
    default: 0,
    current: 0,
    sizing: '%'
  },
  blur: {
    default: 0,
    current: 0,
    sizing: 'px'
  }
}

const PRESETS = {
  none: setDefault(),
  clarendon: {contrast: 120, brightness: 120},
  reyes: {contrast: 85, brightness: 110, saturate: 75, sepia: 22},
  xpro2: {contrast: 130, brightness: 80, saturate: 150, sepia: 30, 'hue-rotate': -20},
  inkwell: {contrast: 110, brightness: 110, saturate: 100, sepia: 30, grayscale: 100},
  brannan: {contrast: 140, sepia: 50},
}

const filterList = document.querySelector('.filter-list');
const inputs = filterList.querySelectorAll('input');
const resetButton = document.querySelector('.reset-button');
const filterTextElem = document.querySelector('.filter-text');
const photo = document.querySelector('.filtered-photo');
const imageInput = document.querySelector('#load-image');
const saveButton = document.querySelector('.save-button');
const clipboardButton = document.querySelector('.clipboard-button');
const showPresets = document.querySelector('.show-presets');
const presetsContainer = document.querySelector('.presets-container');
const presetsList = document.querySelector('.presets-list');

function renderPresets() {
  for (let preset in PRESETS) {
    const div = document.createElement('div');
    div.innerHTML = `<li class="preset-item" data-filter="${preset}">
    <span class="preset-item-title">${preset}</span></li>`;
    const presetItem = div.firstElementChild;
    setPreset(PRESETS[preset]);
    presetItem.style.backgroundImage = `url(assets/img/img.jpg)`;
    presetItem.style.filter = buildFilterProperty();
    setDefault();
    presetsList.appendChild(presetItem);
  }
}

function setFilter() {
  photo.style.filter = buildFilterProperty();
  filterTextElem.value = photo.style.filter
}

function setDefault() {
  for (let filter in FILTERS) {
    FILTERS[filter].current = FILTERS[filter].default;
  }
}

function setPreset(preset) {
  for (let filter in preset) {
    FILTERS[filter].current = preset[filter];
  }
  setFilter();
}

function buildFilterProperty() {
  let filterText = '';
  for (let filter in FILTERS) {
    filterText += `${filter}(${FILTERS[filter].current}${FILTERS[filter].sizing})`
  }
  return filterText;
}

renderPresets()
setDefault();
setFilter();

filterList.addEventListener('change', inputUpdate)
filterList.addEventListener('pointermove', inputUpdate)

imageInput.addEventListener('change', (event) => {
  const image = document.querySelector('.filtered-photo');
  image.src = URL.createObjectURL(event.target.files[0])
})

function saveImage() {
  const canvas = document.createElement('canvas')
  canvas.width = photo.offsetWidth;
  canvas.height = photo.offsetHeight;
  let ctx = canvas.getContext('2d');
  ctx.filter = photo.style.filter;
  ctx.drawImage(photo,0,0, canvas.width, canvas.height)
  let dt = canvas.toDataURL('image/jpeg');
  saveButton.href = dt;
  canvas.remove();
}

saveButton.addEventListener('click', saveImage)

function inputUpdate(event) {
  const target = event.target;
  if (target.tagName != 'INPUT') return
  FILTERS[target.name].current = +target.value;
  setFilter();
}

function setInputs() {
  for (let filter in FILTERS) {
    Array.from(inputs).find(item => item.name == filter).value = FILTERS[filter].current
  }
}

resetButton.addEventListener('click', () => {
  setDefault();
  setInputs()
  setFilter();
})

clipboardButton.addEventListener('click', copyToClipboard)

function copyToClipboard() {
  const temp = document.createElement('textarea');
  temp.value = filterTextElem.value;
  temp.setAttribute('readonly', '');
  temp.style.position = 'absolute';
  temp.style.left = '-9999px';
  temp.select();
  document.execCommand('copy');
  temp.remove();
}

showPresets.addEventListener('click', (event) => {
  const target = event.target;
  if (!target.classList.contains('show-presets-button')) return

  showPresets.classList.toggle('active');
  if (showPresets.classList.contains('active')) {
    target.style.transform = 'rotate(-90deg)'
  }
  else {
    target.style.transform = 'rotate(90deg)'
  }

  if (presetsContainer.style.maxHeight){
    presetsContainer.style.maxHeight = null;
  } else {
    presetsContainer.style.maxHeight = presetsContainer.scrollHeight + "px";
  }
})

presetsContainer.addEventListener('click', (evt) => {
  setDefault();
  const target = evt.target;
  if (target.tagName != 'LI') return;
  setPreset(PRESETS[target.dataset.filter]);
  setInputs();
})