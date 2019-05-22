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
  0.0001,
  0.00025,
  0.0005,
  0.001,
];

// N-значения
let theoryValues;

// Сложность алгоритма = n * log(n) * t
const сomplexity = (v, t) => v * Math.log2(v) * t;

if (NODE_CONSOLE_MODE) { main() }

function main(isNew) {
  if (isNew) {
    clearDependecy();
  }

  if (NODE_CONSOLE_MODE) {
    generateForNodeMode();
  }

  theoryValues = Object.values(ids).sort();

  generateChart(
    '#chart-theory',
    [],
    [
      ['x'].concat(theoryValues),
      ...buildTheoryCharts()
    ]
  );

  // Init Performance Algorithm chart
  chart = generateChart(
    '#chart-perfomance',
    ['AverageTime'],
    [],
    true
  );

  // Отсортировать массивы (использовать алгоритм)
  Object.keys(ids).forEach(id => {
    // Не сортировать, если уже отсортирован
    if (!isNew && dependency.already[id]) {
      return;
    }
    sortPerformanceCheck(GeneratedArrays[id], id, isNew);
  });

  printInConsole('Зависимость времени выполнения от количества элементов:');
  dependency.amount.forEach((v, i) => {
    printInConsole('Количество элементов: ', dependency.amount[i], ' ->  Время выполнения: ', dependency.averageTime[i])
  });
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
  printInConsole('===============================');
  printInConsole("======== Array ID: '"+arId+"' ========");
 
  const performanceTimes = [];
  let time;
  for (let i = 0; i < loopCount; i++) {
    time = performance.now();
    QuickSortAlgorithm(array, arId);
    time = performance.now() - time;
    performanceTimes.push(time);
  }
  // console.log('Массив = ', array);
  // console.log('Осортированный массив = ', sortedArray);
  printInConsole('Длина массива = ', array.length);
  printInConsole('Сколько раз сортировался = ', loopCount);

  const averageAlgorithmTime = performanceTimes.reduce((a, b) => (a + b), 0)/performanceTimes.length;
  printInConsole('Время выполнения алгоритма (за все проходы) = ', performanceTimes);
  printInConsole('Время выполнения алгоритма (усреднённое) = ', averageAlgorithmTime);

  // const averageOperationTime = sortTime[arId].reduce((a, b) => (a + b), 0)/sortTime[arId].length;
  // console.log('Значения по каждой операции (за все проходы) = ', sortTime[arId]);
  // console.log('Значения по каждой операции (усреднённое) = ', averageOperationTime);
  // console.log(
  //   "Сложность алгоритма:\n n * log(n) * {время одной операции} = \n",
  //   array.length + " * log("+array.length+") * "+averageOperationTime+" = \n",
  //   array.length * Math.log2(array.length) * averageOperationTime
  // );
  printInConsole('===============================', "\n", "\n");

  dependency.amount.push(array.length);
  dependency.averageTime.push(averageAlgorithmTime);
  dependency.already[arId] = true;
  dependency.times.push(performanceTimes);
  loadDataInChart(
    chart,
    [
      ['AverageTime'].concat(dependency.averageTime),
      ['x1'].concat(dependency.amount)
    ]
  );
}

// Построить график теоретической сложности алгоритма
function buildTheoryCharts() {
  return theoryTime.map((t) => {
    const id = 'time_'+t;
    return [id].concat(
      theoryValues.map((v) => сomplexity(v, t))
    )
  })
}

// Сгенерировать рандомный массив
function handleRandomArray() {
  const arrayId = getElVal('inputChartId');
  if (ids[arrayId]) return;
  const amount = getElVal('inputRandomAmount');
  GeneratedArrays[arrayId] = generateArray(1, 100, amount);
  ids[arrayId] = amount;
  getEl('controlsForm').reset();
  showSuccessInitMessage(
    arrayId,
    ids[arrayId],
    GeneratedArrays[arrayId],
    'Array successfuly randomizing with values:'
  );
  main();
}
function generateArray(min, max, count) {
  const array = [];
  for (let i = 0; i < count; i++) {
    array.push(generateSingleValue(min, max));
  }
  return array;
}

// Проинициализировать пользовательский массив
function handleUserArray() {
  const arrayId = getElVal('inputChartId');
  if (ids[arrayId]) return;
  const arrayValues = getElVal('textareaChartValues')
    .split(',')
    .map(item => +item.trim());
  GeneratedArrays[arrayId] = arrayValues;
  ids[arrayId] = arrayValues.length;
  getEl('controlsForm').reset();
  showSuccessInitMessage(
    arrayId,
    ids[arrayId],
    GeneratedArrays[arrayId],
    'Array successfuly inited with values:'
  );
  main();
}

function showSuccessInitMessage(id, length, array, message) {
  printInConsole(message, " \n");
  printInConsole('id: ', id, " \n");
  printInConsole('length: ', length, " \n");
  printInConsole('values: ', array, " \n");
}

function clearDependecy() {
  dependency.amount = [];
  dependency.averageTime = [];
  dependency.already = {};
  dependency.times = [];
}

function generateForNodeMode() {
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