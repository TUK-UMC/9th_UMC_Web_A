export const isPrime = (num: number): boolean => {
  if (num < 2) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false; // 짝수는 소수가 아님

  // 2부터 num - 1까지 나누어 떨어지는 수가 있으면 소수가 아님
  for (let i = 3; i * i <= num; i++) {
    // (a, b)
    // a * b = n, 두 약수 중 하나는 반드시 sqrt(n) 이하에 존재
    // n = 49
    // (1, 49), (7, 7)
    // 7 * 7 = 49에서 7 이상은 검토할 필요가 없다.
    // i * i

    // O(n) -> O(sqrt(n))
    if (num % i === 0) return false;
  }

  return true;
};

export const findPrimeNumbers = (max: number) => {
  const sieve = Array(max + 1).fill(true);
  sieve[0] = sieve[1] = false; // 0과 1은 소수가 아님

  for (let i = 2; i * i <= max; i++) {
    if (sieve[i]) {
      for (let j = i * i; j <= max; j += i) {
        sieve[j] = false;
      }
    }
  }

  return sieve.map((isPrime, i) => (isPrime ? i : null)).filter(Boolean);
};
