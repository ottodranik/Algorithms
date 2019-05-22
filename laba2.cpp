#define _USE_MATH_DEFINES
#include <iostream>
#include <cmath>
using namespace std;
double find(double x, double eps)
{
  double f, df;
  int iter = 0;
  cout << "x0= " << x << " ";
  do
  {
    // f = sin(M_PI*x / 180) - 1 / x;
    // df = M_PI / 180 * cos(M_PI*x / 180) + 1 / (x*x);
    // x = 5 - tan(1 / 10);
    f = 10 * atan(5 - x) - 1;
    df = -10 / ((x - 5) * (x - 5) + 1); // производная
    // df = M_PI / 180 * cos(M_PI*x / 180) + 1 / (x*x);
    x = x - f / df;
    iter++;
  } while (fabs(f) > eps && iter < 20000);
  cout << iter << " iterations" << endl;
  return x;
}
int main()
{
  cout << find(5 - tan(1 / 10), 0.00001);
  cin.get();
  return 0;
}