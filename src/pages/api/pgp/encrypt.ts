import { NextApiRequest, NextApiResponse } from 'next';
import * as openpgp from 'openpgp';
import * as zod from 'zod';
const schema = zod.object({
   public_key: zod.string(),
   message: zod.string(),
   private_key: zod.string().optional(),
   password: zod.string().optional(),
});

type RequestBody = zod.infer<typeof schema>;

export default async function handel(
   req: NextApiRequest,
   res: NextApiResponse
) {
   if (req.method !== 'POST')
      return res.status(405).json({
         message: 'Method not allowed',
         status: 405,
         data: null,
      });

   const { public_key, message, private_key, password } =
      req.body as RequestBody;

   const validate = schema.safeParse(req.body);

   if (!validate.success) {
      return res.status(400).json({
         message: 'Bad request',
         status: 400,
         data: null,
      });
   }

   let privateKey: openpgp.PrivateKey | undefined = undefined;

   if (private_key) {
      if (!password) {
         return res.status(400).json({
            message: 'Missing password',
            status: 400,
            data: null,
         });
      }

      privateKey = await openpgp.decryptKey({
         privateKey: await openpgp.readPrivateKey({
            armoredKey: private_key as string,
         }),
         passphrase: password,
      });
   }

   const encrypted = await openpgp.encrypt({
      message: await openpgp.createMessage({ text: message }),
      encryptionKeys: await openpgp.readKey({ armoredKey: public_key }),
      signingKeys: privateKey,
   });

   res.status(200).json({
      message: 'Success',
      status: 200,
      data: {
         encrypted,
         isSigned: !!privateKey,
      },
   });
}
