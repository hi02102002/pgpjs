import { NextApiRequest, NextApiResponse } from 'next';
import * as openpgp from 'openpgp';
import * as zod from 'zod';
const schema = zod.object({
   private_key: zod.string(),
   encrypted_message: zod.string(),
   password: zod.string(),
   public_key: zod.string().optional(),
});

type RequestBody = zod.infer<typeof schema>;

export default async function handel(
   req: NextApiRequest,
   res: NextApiResponse
) {
   try {
      if (req.method !== 'POST')
         return res.status(405).json({
            message: 'Method not allowed',
            status: 405,
            data: null,
         });

      const { private_key, encrypted_message, password, public_key } =
         req.body as RequestBody;

      const validate = schema.safeParse(req.body);

      if (!validate.success) {
         return res.status(400).json({
            message: 'Bad request',
            status: 400,
            data: null,
         });
      }

      let isVerified = false;

      const { data: decrypted, signatures } = await openpgp.decrypt({
         message: await openpgp.readMessage({
            armoredMessage: encrypted_message,
         }),
         decryptionKeys: await openpgp.decryptKey({
            privateKey: await openpgp.readPrivateKey({
               armoredKey: private_key,
            }),
            passphrase: password,
         }),
         verificationKeys: public_key
            ? await openpgp.readKey({ armoredKey: public_key })
            : undefined,
      });

      console.log(signatures);

      try {
         isVerified = await signatures[0]?.verified;
      } catch (error: any) {
         if (public_key) {
            return res.status(400).json({
               message: error.message,
               decrypted,
            });
         }
      }

      res.status(200).json({
         message: 'Success',
         status: 200,
         data: {
            decrypted,
            isVerified,
            keyID: signatures.map((signature) => signature.keyID.toHex()),
         },
      });
   } catch (error: any) {
      console.log(error);
      res.status(500).json({
         message: error.message || 'Internal server error',
         status: 500,
         data: null,
      });
   }
}
