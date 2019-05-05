let NODE_CONSOLE_MODE = true;
try {
  var { performance } = require('perf_hooks');
} catch (ex) {
  NODE_CONSOLE_MODE = false;
}

let chart;

let ids = {};

const loopCount = 1; // КОЛИЧЕСТВО ПРОХОДОВ ДЛЯ КАЖДОГО СЕТА ДАННЫХ!

const GeneratedArrays = {};

const sortTime = {};

const dependency = {
  amount: [],
  averageTime: [],
  times: [],
  already: {}
};

// Теоретическое время выполнения одной операции
const theoryTime = [
  0.0005,
  0.001,
  // 0.1,
  // 10,
  // 100
];

// N-значения
let theoryValues;

if (NODE_CONSOLE_MODE) {
  main();
}

function main(isNew) {
  if (isNew) {
    clearDependecy();
  }

  if (NODE_CONSOLE_MODE) {
    ids = {
      'A': 100,
      'B': 1000,
      'C': 10000,
      'D': 20000,
      'E': 30000,
      'F': 40000,
      'G': 50000,
      'H': 60000,
      'I': 70000,
      'J': 80000,
      'K': 90000,
      'L': 100000
    }
    Object.keys(ids).forEach(id => {
      GeneratedArrays[id] = generateArray(1, 100, ids[id]);
    });
  }

  theoryValues = Object.values(ids).sort();

  // Init Performance Algorithm chart
  if (!NODE_CONSOLE_MODE) {
    chart = c3.generate({
      bindto: '#chart-perfomance',
      data: {
        x: 'x',
        columns: []
      }
    });
  }

  // Build Theory chart
  if (!NODE_CONSOLE_MODE) {
    c3.generate({
      bindto: '#chart-theory',
      data: {
        x: 'x',
        columns: [
          ['x'].concat(theoryValues),
          ...buildTheoryCharts()
        ]
      }
    });
  }

  // Отсортировать массивы (использовать алгоритм)
  Object.keys(ids).forEach(id => {
    // Не сортировать, если уже отсортирован
    if (!isNew && dependency.already[id]) {
      return;
    }
    sortPerformanceCheck(GeneratedArrays[id], id, isNew);
  });

  console.log('Зависимость времени выполнения от количества элементов:');
  dependency.amount.forEach((v, i) => {
    console.log('Количество элементов: ', dependency.amount[i], ' ->  Время выполнения: ', dependency.averageTime[i])
  });
}


function generateArray(min, max, count) {
  const array = [];
  for (let i = 0; i < count; i++) {
    array.push(generateSingle(min, max));
  }
  return array;
}

function generateSingle(min, max) {
  return Math.floor(Math.random() * (+max - +min)) + +min;
}

// ============== ФУНКЦИЯ БЫСТРОЙ СОРТИРОВКИ ==================
function QuickSortAlgorithm(A, arId) {
  if (A.length == 0) return [];
  let time = performance.now();
  let a = [], b = [], p = A[0];
  for (let i = 1; i < A.length; i++) {
    if (A[i] < p) {
      a[a.length] = A[i];
    } else {
      b[b.length] = A[i];
    }
  }
  time = performance.now() - time;

  if (!sortTime[arId]) {
    sortTime[arId] = [];
  }
  sortTime[arId].push(time);
  return QuickSortAlgorithm(a, arId).concat(p, QuickSortAlgorithm(b, arId));
}
// ==========================================================

function sortPerformanceCheck(array, arId) {
  const performanceTimes = [];
  let sortedArray;
  console.log('===============================');
  console.log("======== Array ID: '"+arId+"' ========");
  let time;
  for (let i = 0; i < loopCount; i++) {
    time = performance.now();
    sortedArray = QuickSortAlgorithm(array, arId);
    time = performance.now() - time;
    performanceTimes.push(time);
  }
  // console.log('Массив = ', array);
  // console.log('Осортированный массив = ', sortedArray);
  console.log('Длина массива = ', array.length);
  console.log('Сколько раз сортировался = ', loopCount);

  const averageAlgorithmTime = performanceTimes.reduce((a, b) => (a + b), 0)/performanceTimes.length;
  console.log('Время выполнения алгоритма (за все проходы) = ', performanceTimes);
  console.log('Время выполнения алгоритма (усреднённое) = ', averageAlgorithmTime);

  // const averageOperationTime = sortTime[arId].reduce((a, b) => (a + b), 0)/sortTime[arId].length;
  // console.log('Значения по каждой операции (за все проходы) = ', sortTime[arId]);
  // console.log('Значения по каждой операции (усреднённое) = ', averageOperationTime);
  // console.log(
  //   "Сложность алгоритма:\n n * log(n) * {время одной операции} = \n",
  //   array.length + " * log("+array.length+") * "+averageOperationTime+" = \n",
  //   array.length * Math.log2(array.length) * averageOperationTime
  // );
  console.log('===============================');
  console.log('');

  dependency.amount.push(array.length);
  dependency.averageTime.push(averageAlgorithmTime);
  dependency.already[arId] = true;
  dependency.times.push(performanceTimes);
  loadDataInChart();
}

// Сложность алгоритма = n * log(n) * t
function сomplexity(v, t) {
  return v * Math.log2(v) * t;
}

// Построить график сложности алгоритма
function buildTheoryCharts() {
  return theoryTime.map((t) => {
    const id = 'time_'+t;
    return [id].concat(
      theoryValues.map((v) => сomplexity(v, t))
    )
  })
}

// Загрузить данные в график
function loadDataInChart() {
  if(!NODE_CONSOLE_MODE) {
    chart.load({
      columns: [
        ['Average Time'].concat(dependency.averageTime),
        ['x'].concat(dependency.amount)
      ]
    });
  }
}

// Проинициализировать массив из текстового поля
function initArray() {
  const textareaChartValues = document.getElementById('textareaChartValues').value;
  const id = document.getElementById('inputChartId').value;
  const array = textareaChartValues.split(',').map(item => +item.trim());
  ids[id] = array.length;
  GeneratedArrays[id] = array;
  document.getElementById('controlsForm').reset();
  showSuccessInitMessage(
    id,
    ids[id],
    GeneratedArrays[id],
    'Array successfuly inited with values:'
  );
  main();
}

// Сгенерировать рандомный массив
function randomArray() {
  const id = document.getElementById('inputChartId').value;
  const amount = document.getElementById('inputRandomAmount').value;  
  GeneratedArrays[id] = generateArray(1, 100, amount);
  ids[id] = amount;
  document.getElementById('controlsForm').reset();
  showSuccessInitMessage(
    id,
    ids[id],
    GeneratedArrays[id],
    'Array successfuly randomizing with values:'
  );
  main();
}

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

function showSuccessInitMessage(id, length, array, message) {
  console.log(
    message, " \n",
    'id: ', id, "\n",
    'length: ', length, "\n",
    'values: ', array
  );
}

function clearDependecy() {
  dependency.amount = [];
  dependency.averageTime = [];
  dependency.already = {};
  dependency.times = [];
}
