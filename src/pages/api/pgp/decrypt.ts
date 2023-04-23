import { NextApiRequest, NextApiResponse } from 'next';
import * as openpgp from 'openpgp';
import * as zod from 'zod';
const schema = zod.object({
   private_key: zod.string(),
   encrypted_message: zod.string(),
   password: zod.string(),
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

   const { private_key, encrypted_message, password } = req.body as RequestBody;

   const validate = schema.safeParse(req.body);

   if (!validate.success) {
      return res.status(400).json({
         message: 'Bad request',
         status: 400,
         data: null,
      });
   }

   const { data: decrypted } = await openpgp.decrypt({
      message: await openpgp.readMessage({ armoredMessage: encrypted_message }),
      decryptionKeys: await openpgp.decryptKey({
         privateKey: await openpgp.readPrivateKey({ armoredKey: private_key }),
         passphrase: password,
      }),
   });

   res.status(200).json({
      message: 'Success',
      status: 200,
      data: {
         decrypted,
      },
   });
}
