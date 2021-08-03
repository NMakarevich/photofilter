const FILTERS = {
  none: 'contrast(100%) brightness(100%) saturate(100%) sepia(0%) hue-rotate(0deg) grayscale(0%) invert(0%) blur(0px)',
  clarendon: 'contrast(120%) brightness(125%)',
  reyes: 'contrast(85%) brightness(110%) saturate(75%) sepia(22%)',
  xpro2: 'contrast(100%) brightness(100%) saturate(100%) sepia(30%)',
  inkwell: 'contrast(110%) brightness(110%) saturate(100%) sepia(30%) grayscale(100%)',
  brannan: 'contrast(140%) sepia(50%)'
}

const filterList = document.querySelector('.filter-list');
const inputs = filterList.querySelectorAll('input');
const form = document.querySelector('.filter-settings');
const resetButton = document.querySelector('.reset-button');
const filterTextElem = document.querySelector('.filter-text');
const imageInput = document.querySelector('#image');
const clipboardButton = document.querySelector('.clipboard-button')

function showCurrentFilter() {
  let filterText = '';
  inputs.forEach((input, index) => {
    if (index < 1) return;
    filterText += `${input.name}(${input.value}${input.dataset.sizing}) `
  });
  filterTextElem.value = filterText;
}

showCurrentFilter();

filterList.addEventListener('change', inputUpdate)
filterList.addEventListener('pointermove', inputUpdate)

imageInput.addEventListener('change', (event) => {
  const image = document.querySelector('img');
  image.src = URL.createObjectURL(event.target.files[0])
})

function inputUpdate(event) {
  const target = event.target;
  if (target.tagName != 'INPUT') return
  const suffix = target.dataset.sizing || '';
  document.documentElement.style.setProperty(`--${target.name}`, target.value + suffix);
  showCurrentFilter()
}

resetButton.addEventListener('click', () => {
  resetButton.click();
  inputs.forEach(input => {
    const suffix = input.dataset.sizing || '';
    document.documentElement.style.setProperty(`--${input.name}`, input.value + suffix);
  })
  showCurrentFilter()
})

clipboardButton.addEventListener('click', copyToClipboard)

function copyToClipboard(e) {
  e.preventDefault();
  const el = document.createElement('textarea');
  el.value = filterTextElem.value;
  el.setAttribute = 'readonly';
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild( el );
  el.select();
  document.execCommand( 'copy' );
  document.body.removeChild( el );
}

const showPresets = document.querySelector('.show-presets');
const presetsContainer = document.querySelector('.presets-container')

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

const presetItems = document.querySelectorAll('.preset-item');
presetItems.forEach(item => {
  item.style.backgroundImage = `url(assets/img/img.jpg)`;
  item.firstElementChild.textContent = item.dataset.filter;
  item.style.filter = FILTERS[item.dataset.filter]
})

presetsContainer.addEventListener('click', (evt) => {
  resetButton.click();
  const target = evt.target;
  if (target.tagName != 'LI') return;
  const filterStr = FILTERS[target.dataset.filter];
  setValues(inputs, getValues(filterStr));
  showCurrentFilter();
})

function getValues(str) {
  str = str.split(' ').join('').split(')').filter(item => item)
  let obj = {}
  str.forEach(item => {
    item = item.split('(')
    obj[item[0]] = parseInt(item[1])
  })
  return obj
}

function setValues(items, obj) { 
  items.forEach((item, index) => {
    if (index < 1) return;
    const suffix = item.dataset.sizing || '';
    item.value = obj[item.name] || item.value;
    document.documentElement.style.setProperty(`--${item.name}`, (obj[item.name] || item.value) + suffix)
  })
}