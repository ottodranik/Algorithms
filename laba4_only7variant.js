#include <iostream>
#include <cmath>
using namespace std;
// Вывод системы уравнений
void sysout(double **a, double *y, int n)
{
  for (int i = 0; i < n; i++) 
  {
    for (int j = 0; j < n; j++) 
    {
      cout << a[i][j] << "*x" << j;
      if (j < n - 1)
        cout << " + ";
    }
    cout << " = " << y[i] << endl;
  }
  return;
}
double * gauss(double **a, double *y, int n) 
{
  double *x, max;
  int k, index;
  const double eps = 0.00001;  // точность
  x = new double[n];
  k = 0;
  while (k < n) 
  {
    // Поиск строки с максимальным a[i][k]
    // max = abs(a[k][k]);
    // index = k;
    // for (int i = k + 1; i < n; i++) 
    // {
    //   if (abs(a[i][k]) > max)
    //   {
    //     max = abs(a[i][k]);
    //     index = i;
    //   }
    // }
    // Перестановка строк
    // if (max < eps) 
    // {
    //   // нет ненулевых диагональных элементов
    //   cout << "Решение получить невозможно из-за нулевого столбца ";
    //   cout << index << " матрицы A" << endl;
    //   return 0;
    // }
    // for (int j = 0; j < n; j++) 
    // {
    //   double temp = a[k][j];
    //   a[k][j] = a[index][j];
    //   a[index][j] = temp;
    // }
    // double temp = y[k];
    // y[k] = y[index];
    // y[index] = temp;
    // Нормализация уравнений
    double temp = a[k][k];
    cout << "k = " << k << endl;
    for (int i = k+1; i < n; i++) 
    {
      cout << "===================" << endl;
      cout << "i = " << i << endl;
      cout << "temp = " << "a[k][k] = " << a[k][k] << endl;
      cout << "y[i] = " << y[i] << endl;
      if (abs(temp) < eps) continue; // для нулевого коэффициента пропустить
      double m = a[i][k] / a[k][k];
      cout << "m = " << m << ", a[i][k] = " << a[i][k] << ", a[k][k] = " << a[k][k] << endl;
      for (int j = 0; j < n; j++)  {
        cout << "----------------" << endl;
        cout << "i = " << i << "; j = " << j << endl;
        cout << "a[i][j] = " << a[i][j] << ", a[k][j] = " << a[k][j] << endl;
        a[i][j] = a[i][j] - m * a[k][j];
        cout << "a[i][j] = " << a[i][j] << endl;
        cout << "----------------" << endl;
      }
      cout << "y[i] = " << y[i] << ", y[k] = " << y[k] << ", m = " << m << endl;
      y[i] = y[i] - m * y[k];
      cout << "y[i] = " << y[i] << endl;
      // if (i == k)  continue; // уравнение не вычитать само из себя
      // for (int j = 0; j < n; j++) {
      //   cout << "--------" << endl;
      //   cout << "i = " << i << "; j = " << j << "; k = " << k << endl;
      //   cout << "a[k][j] = " << a[k][j] << endl;
      //   cout << "a[i][j] = " << a[i][j] << endl;
      //   a[i][j] = a[i][j] - a[k][j];
      //   cout << "a[i][j] - a[k][j] = " << a[i][j] << endl;
      //   cout << "--------" << endl;
      // }
      // y[i] = y[i] - y[k];
      // cout << "y[i] - y[k] = " << y[i] << endl;
      cout << "===================" << endl;
    }
    k++;
  }
  cout << "----------------------" << endl;
  cout << "a[0][0] = " << a[0][0] << endl;
  cout << "a[0][1] = " << a[0][1] << endl;
  cout << "a[0][2] = " << a[0][2] << endl;
  cout << "y[0] = " << y[0] << endl;
  cout << "a[1][0] = " << a[1][0] << endl;
  cout << "a[1][1] = " << a[1][1] << endl;
  cout << "a[1][2] = " << a[1][2] << endl;
  cout << "y[1] = " << y[1] << endl;
  cout << "a[2][0] = " << a[2][0] << endl;
  cout << "a[2][1] = " << a[2][1] << endl;
  cout << "a[2][2] = " << a[2][2] << endl;
  cout << "y[2] = " << y[2] << endl;
  cout << "----------------------" << endl;
  // обратная подстановка
  for (k = n - 1; k >= 0; k--)
  {
    x[k] = y[k] / a[k][k];
    for (int i = 0; i < k; i++) {
      y[i] = y[i] - a[i][k] * x[k];
    }
  }
  return x;
}
int main() 
{
  double **a, *y, *x;
  int n;
  // system("chcp 1251");
  // system("cls");
  // cout << "Введите количество уравнений: ";
  // cin >> n;
  n = 3;
  a = new double*[n];
  y = new double[n];
//   for (int i = 0; i < n; i++) 
//   {
//     a[i] = new double[n];
//     for (int j = 0; j < n; j++) 
//     {
//       cout << "a[" << i << "][" << j << "]= ";
//       cin >> a[i][j];
//     }
//   }
//   for (int i = 0; i < n; i++) 
//   {
//     cout << "y[" << i << "]= ";
//     cin >> y[i];
//   }
//   sysout(a, y, n);
a[0] = new double[n];
a[1] = new double[n];
a[2] = new double[n];
a[0][0]= 7.09;
a[0][1]= 1.17;
a[0][2]= -2.23;
a[1][0]= 0.43;
a[1][1]= 1.4;
a[1][2]= -0.62;
a[2][0]= 3.21;
a[2][1]= -4.25;
a[2][2]= 2.13;
y[0]= -4.75;
y[1]= -1.05;
y[2]= -5.06;
  x = gauss(a, y, n);
  for (int i = 0; i < n; i++) 
    cout << "x[" << i << "]=" << x[i] << endl;
  cin.get(); cin.get();
  return 0;
}