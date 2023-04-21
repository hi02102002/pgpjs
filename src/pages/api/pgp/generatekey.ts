import { NextApiRequest, NextApiResponse } from 'next';
import { generateKey } from 'openpgp';
import zod from 'zod';
const schema = zod.object({
   password: zod.string().min(6),
   name: zod.string(),
   email: zod.string().email('Invalid email'),
   comment: zod.string().optional(),
});

type RequestBody = zod.infer<typeof schema>;

export default async function handel(
   req: NextApiRequest,
   res: NextApiResponse
) {
   if (!(req.method === 'POST')) {
      return res.status(405).json({
         message: 'Method not allowed',
         status: 405,
         data: null,
      });
   }
   try {
      const { password, name, email, comment } = req.body as RequestBody;

      const validate = schema.safeParse(req.body);

      if (!validate.success) {
         return res.status(400).json({
            message: 'Bad request',
            status: 400,
            data: null,
         });
      }

      const result = await generateKey({
         userIDs: [
            {
               name,
               email,
               comment,
            },
         ],
         type: 'rsa',
         rsaBits: 4096,
         passphrase: password,
         keyExpirationTime: 0,
      });

      const { privateKey, publicKey } = result;

      res.status(200).json({
         message: 'Success',
         status: 200,
         data: {
            privateKey,
            publicKey,
         },
      });
   } catch (error) {
      res.status(500).json({
         message: 'Internal server error',
         status: 500,
         data: null,
      });
   }
}
