import { NextApiRequest, NextApiResponse } from 'next';
import * as openpgp from 'openpgp';
import * as zod from 'zod';
const schema = zod.object({
   public_key: zod.string(),
   message: zod.string(),
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

   const { public_key, message } = req.body as RequestBody;

   const validate = schema.safeParse(req.body);

   if (!validate.success) {
      return res.status(400).json({
         message: 'Bad request',
         status: 400,
         data: null,
      });
   }

   const encrypted = await openpgp.encrypt({
      message: await openpgp.createMessage({ text: message }),
      encryptionKeys: await openpgp.readKey({ armoredKey: public_key }),
   });

   res.status(200).json({
      message: 'Success',
      status: 200,
      data: {
         encrypted,
      },
   });
}
