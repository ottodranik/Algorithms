
let NODE_CONSOLE_MODE = true;
try {
  var { performance } = require('perf_hooks');
} catch (ex) {
  NODE_CONSOLE_MODE = false;
}

const generateSingleValue = (min, max) =>
  Math.floor(Math.random() * (+max - +min)) + +min;

// Выбрать массив
function setRandomOrNot(val) {
  if (val) {
    document.getElementById('buttonCustom').disabled = true;
    document.getElementById('textareaChartValues').disabled = true;
    document.getElementById('buttonRandom').disabled = false;
    document.getElementById('inputRandomAmount').disabled = false;
  } else {
    document.getElementById('buttonCustom').disabled = false;
    document.getElementById('textareaChartValues').disabled = false;
    document.getElementById('buttonRandom').disabled = true;
    document.getElementById('inputRandomAmount').disabled = true;
  }
}

function setCustomOrNot(val) {
  if (val) {
    document.getElementById('amount').disabled = false;
    document.getElementById('buttonBuildTable').disabled = false;
  } else {
    document.getElementById('amount').disabled = true;
    document.getElementById('buttonBuildTable').disabled = true;
  }
}

// Вывод данных в консоль
function printInConsole(...args) {
  console.log(...args);
}

function getEl(id) {
  return document.getElementById(id);
}

function getElVal(id) {
  return getEl(id).value;
}

function generateChart(id, chartIds, columns, multiX) {
  if (NODE_CONSOLE_MODE) return;
  return c3.generate({
    bindto: id,
    data: {
      xs: multiX ? {
        [chartIds[0]]: 'x1',
        [chartIds[1]]: 'x2'
      } : null,
      x: multiX ? null : 'x',
      columns
    }
  });
}

function loadDataInChart(chart, columns) {
  if (NODE_CONSOLE_MODE) return;
  chart.load({
    columns
  });
}

function toggleControls() {
  if (NODE_CONSOLE_MODE) return;
  const controls = document.getElementById('controls');
  const collapse = controls.getAttribute('data-collapse');
  if (collapse === 'false') {
    controls.classList.add('collapse');
    controls.setAttribute('data-collapse', 'true');
  } else {
    controls.classList.remove('collapse');
    controls.setAttribute('data-collapse', 'false');
  }
}
