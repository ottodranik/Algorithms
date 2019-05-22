
if (NODE_CONSOLE_MODE) {
  main();
}

/**
 * MAIN function
 */
function main() {

  init();

  const func = (x) => 10 * Math.atan(5 - x) - 1;
  const dfunc = (x) => -10 / ((5-x)*(5-x)+1);
  const epsylon = 1e-5;

  x0s = [4]
  x0s.forEach(x0 => {
    NewtonsMethod(func, dfunc, x0, epsylon);
  });

  laba3.main();
}

/**
 * Алгоритм Ньютона
 * @param {*} x 
 * @param {*} y 
 * @param {*} t 
 */
function dx(f, x) {
  return Math.abs(0 - f(x));
}
function NewtonsMethod(f, df, x0, e) {
  delta = dx(f, x0)
  while (delta > e) {
    x0 = x0 - f(x0)/df(x0)
    delta = dx(f, x0)
    printInConsole('x0: ', x0, '; delta: ', delta, '; e: ', e);
  }
  printInConsole('Root is at: ', x0);
  printInConsole('f(x) at root is: ', f(x0));
}

// Вывод данных в консоль
function printInConsole(...args) {
  console.log(...args);
}
