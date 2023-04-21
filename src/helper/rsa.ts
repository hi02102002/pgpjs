const random = (min: number, max: number) => {
   return Math.floor(Math.random() * (max - min) + min);
};

const isPrime = (n: number) => {
   if (n < 2) {
      return false;
   }

   for (let i = 2; i < Math.floor(Math.sqrt(n)); i++) {
      if (n % i === 0) {
         return false;
      }
   }
   return true;
};

const generatePrime = () => {
   let prime = random(1, 1000);
   while (!isPrime(prime)) {
      prime = random(1, 1000);
   }
   return prime;
};

const _mod = (n: number, m: number) => {
   return ((n % m) + m) % m;
};

const gcd = (a: number, b: number) => {
   a = Math.abs(a);
   b = Math.abs(b);
   while (a != b) {
      if (a > b) {
         a -= b;
      } else {
         b -= a;
      }
   }
   return a;
};

const egcd = (a: number, b: number) => {
   let m = a;
   let n = b;
   let xm = 1;
   let ym = 0;
   let xn = 0;
   let yn = 1;
   while (n !== 0) {
      let q = Math.floor(m / n);
      let r = _mod(m, n);
      const xr = xm - q * xn;
      const yr = ym - q * yn;
      m = n;
      xm = xn;
      ym = yn;
      n = r;
      xn = xr;
      yn = yr;
   }
   return { x: xm, y: ym, gcd: gcd(a, b) };
};

const findCoprime = (phi: number) => {
   let e = random(2, phi - 1);

   let res = egcd(e, phi);

   let gcd = res.gcd;

   let d = res.x;

   while (gcd !== 1) {
      e = random(2, phi - 1);
      res = egcd(e, phi);

      gcd = res.gcd;

      d = res.x;
   }

   console.log({ e, d });

   return {
      e,
      d,
   };
};

export const rsa = () => {
   const p = generatePrime();
   const q = generatePrime();
   const n = p * q;
   const phi = (p - 1) * (q - 1);
   const { d, e } = findCoprime(phi);

   return { public_key: [e, n], private_key: [d, n] };
};
