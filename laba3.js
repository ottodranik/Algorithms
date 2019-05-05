let NODE_CONSOLE_MODE = true;
try {
  var { performance } = require('perf_hooks');
} catch (ex) {
  NODE_CONSOLE_MODE = false;
}

let
  chart,
  a = 0,
  b = 2,
  functionId = 1;

if (NODE_CONSOLE_MODE) {
  main();
}

function init() {
  if (NODE_CONSOLE_MODE) return;
  const functionId = document.getElementById('functionId');
  a = document.getElementById('inputA').value;
  b = document.getElementById('inputB').value;
}

/**
 * MAIN function
 */
function main() {

  init();
  
  let x = linspace(Math.min(a), Math.max(b), 10);
  let y = buildFunction(1, x);
  
  // Build default FUNCTION chart by points
  renderChart(
    '#chart-theory',
    [
      ['x'].concat(x),
      ['y'].concat(y),
    ]
  );

  printInConsole("===== X and Y arrays by default ====");
  printInConsole("X", x);
  printInConsole("y", y);

  let xPolynom = linspace(Math.min(...x), Math.max(...x), 100);
  let yPolynom = xPolynom.map((item, i) => {
    return LagrangePolynomial(x, y, item);
  });

  // Build Lagrange Polynomial FUNCTION chart
  chart = renderChart(
    '#chart-perfomance',
    [
      ['x'].concat(xPolynom),
      ['yPolynom'].concat(yPolynom)
    ]
  );

  printInConsole("===== X and Y arrays by Lagrange Polynomial ====");
  printInConsole("X", xPolynom);
  printInConsole("y", yPolynom);
}

/**
 * Lagrange Polynomial Algorithm
 * @param {*} x 
 * @param {*} y 
 * @param {*} t 
 */
function LagrangePolynomial(x, y, t) {
  let z = 0;
  for (let j = 0; j < y.length; j++) {
    let p1 = 1, p2 = 1
    for (let i = 0; i < x.length; i++) {
      if (i === j) {
        p1 = p1 * 1;
        p2 = p2 * 1;
      }
      else {
        p1 = p1 * (t - x[i])
        p2 = p2 * (x[j] - x[i])
      }
    }
    z += y[j] * p1 / p2;
  }
  return z;
}

/**
 * Разбивает промежуток на равные интервалы
 * @param {*} a 
 * @param {*} b 
 * @param {*} n 
 */
function linspace(a, b, n) {
  if (typeof n === "undefined") {
    n = Math.max(Math.round(b - a) + 1, 1);
  }
  if (n < 2) {
    return n === 1 ? [a] : [];
  }
  let i;
  const ar = Array(n);
  n--;
  for (i = n; i >= 0; i--) {
    ar[i] = (i * b + (n - i) * a) / n;
  }
  return ar;
}

/**
 * Build one of selected function 
 * @param {*} type 
 * @param {*} xArray 
 */
function buildFunction(type, xArray) {
  switch(type) {
    case 1:
      return xArray.map((x) => {
        return 1 / (0.5 + Math.pow(x, 2));
      });
    case 2:
      return 
    default:
      printInConsole('Wrong function type');
  }
  return null;
}

// Вывод данных в консоль
function printInConsole(...args) {
  console.log(...args);
}

/**
 * Render Chart
 * @param {*} id 
 * @param {*} columns 
 */
function renderChart(id, columns) {
  if (NODE_CONSOLE_MODE) return;
  return c3.generate({
    bindto: id,
    data: {
      x: 'x',
      columns
    }
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