import { rsa } from '@/helper/rsa';
import { NextApiRequest, NextApiResponse } from 'next';

export async function handel(req: NextApiRequest, res: NextApiResponse) {
   if (req.method !== 'GET')
      return res.status(405).json({
         message: 'Method not allowed',
         status: 405,
         data: null,
      });

   const { private_key, public_key } = rsa();

   res.status(200).json({
      message: 'Generate successfully',
      status: 200,
      data: {
         private_key,
         public_key,
      },
   });
}
