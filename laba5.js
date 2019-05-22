
// Переменные
//
let
  matrix = [],
  ordinates = [],
  number,
  xVector,
  initialized,
  shouldInitDefault = false;

// ================= GaussAlgorithm handlers =================
//
function GaussAlgorithm(matrix, ordinates, n, normalization) {

  printInConsole("============ Начало алгоритма Гаусса ============");
  printInResults("Начало алгоритма Гаусса", 'simple-text');

  const a = JSON.parse(JSON.stringify(matrix));
  const y = JSON.parse(JSON.stringify(ordinates));
  const x = [];
  const eps = 0.00001;  // точность
  let k, index, temp, max;
  k = 0;
  while (k < n) {
    // Поиск строки с максимальным a[i][k]
    max = Math.abs(a[k][k]);
    index = k;
    for (let i = k + 1; i < n; i++) {
      if (Math.abs(a[i][k]) > max) {
        max = Math.abs(a[i][k]);
        index = i;
      }
    }
    
    // Выйти, если есть нулевой столбец
    if (max < eps) {
      // нет ненулевых диагональных элементов
      console.log("Решение получить невозможно из-за нулевого столбца ", index, " матрицы A");
      return 0;
    }

    // Перестановка строк
    for (let j = 0; j < n; j++) {
      temp = a[k][j];
      a[k][j] = a[index][j];
      a[index][j] = temp;
    }
    temp = y[k];
    y[k] = y[index];
    y[index] = temp;
    
    // После перестановки
    console.log("----- шаг "+ k +" -------");
    print(a, y, n);
    console.log("----------------------");
    
    // САМ АЛГОРИТМ! + Нормализация уравнений
    if (normalization) {
      for (let i = k; i < n; i++) {
        temp = a[i][k];
        if (Math.abs(temp) < eps) continue; // для нулевого коэффициента пропустить
        for (let j = 0; j < n; j++) {
          a[i][j] = a[i][j] / temp;
        }
        y[i] = y[i] / temp;
        if (i == k)  continue; // уравнение не вычитать само из себя
        for (let j = 0; j < n; j++) {
          a[i][j] = a[i][j] - a[k][j];
        }
        y[i] = y[i] - y[k];
      }
    }
    // САМ АЛГОРИТМ! БЕЗ нормализации
    else {
      for (let i = k+1; i < n; i++) {
        if (Math.abs(a[k][k]) < eps) continue; // для нулевого коэффициента пропустить
        let m = a[i][k] / a[k][k];
        for (let j = 0; j < n; j++)  {
          a[i][j] = a[i][j] - m * a[k][j];
        }
        y[i] = y[i] - m * y[k];
      }
    }
    k++;
  }

  console.log("-------- Final Array -------");
  print(a, y, n);
  console.log("----------------------");

  // обратная подстановка
  for (k = n - 1; k >= 0; k--) {
    x[k] = normalization ? y[k] : y[k] / a[k][k];
    for (let i = 0; i < k; i++) {
      y[i] = y[i] - a[i][k] * x[k];
    }
  }

  printInConsole("============ Конец алгоритма Гаусса ============");
  printInResults("Конец алгоритма Гаусса", 'simple-text');
  return x;
}

// ================= INIT AND MAIN handlers =================
//
function main(normalization) {
  clearData('results-data');
  xVector = GaussAlgorithm(matrix, ordinates, number, normalization);
  printResults();
  return 0;
}

function init() {
  clearData('init-data');
  clearData('results-data');

  if (!NODE_CONSOLE_MODE) {
    // МАССИВ РУКАМИ ЧЕРЕЗ КОНСОЛЬ!
    const amount = document.getElementById('amount');
    if (amount && amount.value) {
      const form = document.querySelector('#controlsForm');
      const formData = serialize(form).split('&');
      formData.shift();
      const values = [];
      console.log(formData)
      formData.forEach(item => {
        const a = item.split('=');
        values.push(+a[1]);
      });
      console.log(values);
      // new FormData(document.querySelector('controlsForm'))
      // a = new double*[n];
      // y = new double[n];
      matrix = [];
      ordinates = [];
      let k = 0;
      for (let i = 0; i < number; i++) {
        matrix[i] = [];
        for (let j = 0; j < number; j++) {
          matrix[i][j] = values[k+j];
        }
        k = (i+1)*(number+1)-1;
        console.log(k, number, i)
        ordinates[i] = values[k];
        k++;
      }
      console.log(matrix, ordinates);
    } else {
      clearData('input-data-table');
      shouldInitDefault = true;
    }
  }

  if(NODE_CONSOLE_MODE || shouldInitDefault) {
    // МАССИВ ПО УМОЛЧАНИЮ!
    console.log("Инициализация массива по умолчанию:");
    number = 3;
    matrix = [];
    ordinates = [];
    matrix[0] = [];
    matrix[1] = [];
    matrix[2] = [];
    matrix[0][0]= 7.09;
    matrix[0][1]= 1.17;
    matrix[0][2]= -2.23;
    matrix[1][0]= 0.43;
    matrix[1][1]= 1.4;
    matrix[1][2]= -0.62;
    matrix[2][0]= 3.21;
    matrix[2][1]= -4.25;
    matrix[2][2]= 2.13;
    ordinates[0]= -4.75;
    ordinates[1]= -1.05;
    ordinates[2]= -5.06;
  }

  initialized = true;
  onInit();
  console.log("-------- Init Array -------");
  print(matrix, ordinates, number, 'init-data');
  console.log("----------------------");
}

function onInit() {
  if(initialized) {
    document.getElementById('gausse1').disabled = false;
    document.getElementById('gausse2').disabled = false;
  }
}


// ================= PRINT RESULTS handlers =================
//

// Вывод системы уравнений
function print(a, y, n, tagId) {
  const htmlCnt = printEquationCnt(tagId);
  let str;
  for (let i = 0; i < n; i++) {
    str = '';
    for (let j = 0; j < n; j++) {
      str += a[i][j]+"*x"+j;
      if (j < n - 1) {
        str += " + ";
      }
    }
    str += " = " + y[i];
    printInConsole(str);
    printEquation(str, htmlCnt);
  }
  return;
}

// Вывод результатов
function printResults() {
  let str = '';
  const cnt = printEquationCnt();
  for (let i = 0; i < number; i++) {
    str = "x["+i+"] = "+xVector[i];
    printInConsole(str);
    printEquation(str, cnt);
  }
}

// Вывод данных в тег результатов
function printInResults(str) {
  const results = document.getElementById('results-data');
  const div = document.createElement('div');
  div.textContent = str;
  div.className = 'simple-text';
  results.appendChild(div);
}

// Вывод одного уравнения (строка)
function printEquation(str, equationCnt) {
  if (NODE_CONSOLE_MODE) return;
  const equation = document.createElement('div');
  equation.className = 'equation';
  equation.textContent = str;
  equationCnt.appendChild(equation);
}

// Вывод блока системы уравнений
function printEquationCnt(tag = 'results-data') {
  if (NODE_CONSOLE_MODE) return;
  const results = document.getElementById(tag);
  const equationCnt = document.createElement('div');
  equationCnt.className = 'equation-cnt';
  results.appendChild(equationCnt);
  return equationCnt;
}

// Очистка блока результатов
function clearData(tag = 'results-data') {
  document.getElementById(tag).innerHTML = '';
}


// ================= CHANGE CONTROLS handlers =================
//
function buildArray() {
  number = +document.getElementById('amount').value;
  if (number > 5) { number = 5 };
  buildTable(number);
}

function buildTable(n) {
  clearData('input-data-table');
  const inputTable = document.getElementById('input-data-table');
  for (let i = 0; i < n; i++) {
    const cnt = document.createElement('div');
    for (let j = 0; j < n; j++) {
      const input = document.createElement('input');
      input.name = 'a'+i+j;
      input.className = 'input';
      cnt.appendChild(input);
    }
    const input = document.createElement('input');
    input.name = 'y'+i;
    input.className = 'input';
    cnt.appendChild(document.createElement('span'));
    cnt.appendChild(input);
    inputTable.appendChild(cnt);
  }
}
