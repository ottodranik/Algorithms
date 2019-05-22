
function Laba3() {}

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
  functionId = +document.getElementById('functionId').value;
  a = document.getElementById('inputA').value;
  b = document.getElementById('inputB').value;
}

/**
 * Lagrange Polynomial Algorithm
 * @param {*} x 
 * @param {*} y 
 * @param {*} t 
 */
Laba3.prototype.LagrangePolynomial = function(x, y, t) {
  let z = 0;
  for (let j = 0; j < y.length; j++) {
    let p1 = 1, p2 = 1
    for (let i = 0; i < x.length; i++) {
      if (i === j) {
        p1 = p1 * 1;
        p2 = p2 * 1;
      } else {
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
Laba3.prototype.splitOnEqualIntervals = function(a, b, n) {
  if (typeof n === "undefined") {
    n = Math.max(Math.round(b - a) + 1, 1);
  }
  if (n < 2) {
    return n === 1 ? [a] : [];
  }
  const ar = Array(n);
  n--;
  for (let i = n; i >= 0; i--) {
    ar[i] = (i * b + (n - i) * a) / n;
  }
  return ar;
}

/**
 * Build one of selected function 
 * @param {*} type 
 * @param {*} xArray 
 */
Laba3.prototype.buildFunction = function(type, xArray) {
  switch(type) {
    case 1:
      return xArray.map((x) => {
        let v = 1 / (0.5 + Math.pow(x, 2));
        return v;
      });
    case 2:
      return xArray.map((x) => {
        let v = Math.sin(x);
        return v;
      });
    case 3:
      return xArray.map((x) => {
        let v = 10 * Math.atan(5 - x) - 1;
        return v;
      });
    default:
      printInConsole('Wrong function type');
  }
  return null;
}

/**
 * MAIN function
 */

Laba3.prototype.main = function() {

  init();
  
  // Дані у вузлових точках
  let x = this.splitOnEqualIntervals.bind(this, a, b, 11).call();
  let y = this.buildFunction.bind(this, functionId, x).call();
  
  const chart = generateChart(
    '#chart',
    [
      'y', 'yPolynom'
    ],
    [
      ['x1'].concat(x),
      ['y'].concat(y),
    ],
    true
  );

  printInConsole("===== X і Y масиви у вузлових точках ====");
  printInConsole("X", x);
  printInConsole("y", y);

  // Дані по 111 точкам: поліном Лагранжа
  let xPolynom = this.splitOnEqualIntervals.bind(this, Math.min(...x), Math.max(...x), 111).call();
  let yPolynom = xPolynom.map((item) => {
    return this.LagrangePolynomial.bind(this, x, y, item).call();
  });

  chart.load({
    columns: [
      ['x2'].concat(xPolynom),
      ['yPolynom'].concat(yPolynom)
    ]
  });

  printInConsole("===== X і Y масиви (підрахунок за поліномом Лагранжа) ====");
  printInConsole("X", xPolynom);
  printInConsole("y", yPolynom);

  // buildKtable(findKvalues(yPolynom, y));
}

function findKvalues(yPolynom, y) {
  const table = [];
  yPolynom.forEach((item, i) => {
    if (yPolynom[i + 1] === undefined) return;
    const delta_exact = y[i] - yPolynom[i+1].toFixed(8);
    const delta = yPolynom[i].toFixed(8) - yPolynom[i+1].toFixed(8);
    const k = 1 - delta_exact / delta;
    const row = { delta_exact, delta, k };
    table.push(row);
  })
  return table;
}

function buildKtable(table) {
  tableTag = document.getElementById('kTable');
  printInConsole('Расчёт погрешностей:')
  table.forEach((row, i) => {
    printInConsole(
      'Шаг: '+i,
      'Delta(exact): '+row.delta_exact,
      'Delta: '+row.delta,
      'k: '+row.k
    );
    const rowTag = document.createElement('tr');
    const td1 = document.createElement('td');
    td1.innerHTML = 'Delta(exact): '+row.delta_exact
    rowTag.appendChild(td1);
    const td2 = document.createElement('td');
    td2.innerHTML = 'Delta: '+row.delta
    rowTag.appendChild(td2);
    const td3 = document.createElement('td');
    td3.innerHTML = 'k: '+row.k
    rowTag.appendChild(td3);
    tableTag.appendChild(rowTag);
  });
}

const laba3 = new Laba3();