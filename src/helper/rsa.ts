import bigInt from 'big-integer';

type PublicKey = {
   e: number;
   n: number;
};

type PrivateKey = {
   d: number;
   n: number;
};

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

const findCoprime = (phi: number) => {
   let e = random(2, phi - 1);

   while (gcd(e, phi) !== 1 || e >= phi || e < 1) {
      e = random(2, phi - 1);
   }
   return e;
};

const findD = (e: number, phi: number) => {
   for (let x = 1; x < phi; x++) if ((e * x) % phi === 1) return x;
};

export const generateKeyPair = () => {
   const p = generatePrime(); // p and q are two distinct primes
   const q = generatePrime(); // p and q are two distinct primes
   const n = p * q; // modulus
   const phi = (p - 1) * (q - 1); // totient // dùng để tạo ra khóa bí mật và khóa công khai
   const e = findCoprime(phi); // public key
   const d = findD(e, phi); // private key

   return {
      e,
      n,
      d,
      phi,
      p,
      q,
   };
};

export const encrypt = (message: string, public_key: PublicKey) => {
   // c(m) = (m ^ e )mod n
   const { e, n } = public_key;
   const encrypted = message
      .split('') // lay ra tung ki tu
      .map((char) => {
         return bigInt(char.charCodeAt(0)).modPow(e, n).toString(); // ma hoa tung ki tu
         // char.charCodeAt(0) -> lay ra ma ascii cua ki tu
         // bigInt(char.charCodeAt(0)) -> chuyen ma ascii thanh so nguyen
         // bigInt(char.charCodeAt(0)).modPow(e, n) -> ma hoa so nguyen
      })
      .join();

   return encrypted;
};

export const decrypt = (encrypted: string, private_key: PrivateKey) => {
   const { d, n } = private_key;
   const decrypted = encrypted
      .split(',') // lay ra tung ki tu
      .map((char) => {
         return String.fromCharCode(bigInt(char).modPow(d, n).toJSNumber());
      }) // giai ma tung ki tu
      // bigInt(char) -> chuyen ki tu thanh so nguyen
      // bigInt(char).modPow(d, n) -> giai ma so nguyen
      // String.fromCharCode(bigInt(char).modPow(d, n).toJSNumber()) -> chuyen so nguyen thanh ki tu
      .join('');

   return decrypted;
};
