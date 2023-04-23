import { decrypt, encrypt, generateKeyPair } from '@/helper/rsa';
import { Button, Col, Form, Input, Row, message } from 'antd';

const RSA = () => {
   const [form] = Form.useForm();

   const handelRandom = () => {
      const { d, e, n, p, phi, q } = generateKeyPair();
      form.setFieldsValue({
         d,
         e,
         n,
         p,
         phi,
         q,
      });
   };

   const handelEncrypt = () => {
      const { plain_text, e, n } = form.getFieldsValue();
      if (!plain_text || !e || !n) {
         message.error('Missing plain text or e or n');
         return;
      }

      const cipher_text = encrypt(plain_text, {
         e,
         n,
      });

      form.setFieldsValue({
         cipher_text,
      });
   };

   const handelDecrypt = () => {
      const { cipher_text, d, n } = form.getFieldsValue();
      if (!cipher_text || !d || !n) {
         message.error('Missing cipher text or d or n');
         return;
      }

      const text_decryption = decrypt(cipher_text, {
         d,
         n,
      });

      form.setFieldsValue({
         text_decryption,
      });
   };

   const handelReset = () => {
      form.resetFields();
   };

   return (
      <div>
         <Form layout="vertical" form={form}>
            <Row gutter={16}>
               <Col span={12}>
                  <Form.Item
                     label="P (p and q are two distinct primes)"
                     name="p"
                  >
                     <Input placeholder="P" readOnly />
                  </Form.Item>
                  <Form.Item label="N (modulus)" name="n">
                     <Input placeholder="N" readOnly />
                  </Form.Item>
                  <Form.Item label="E (public key)" name="e">
                     <Input placeholder="E" readOnly />
                  </Form.Item>
               </Col>
               <Col span={12}>
                  <Form.Item
                     label="Q (p and q are two distinct primes)"
                     name="q"
                  >
                     <Input placeholder="Q" readOnly />
                  </Form.Item>
                  <Form.Item label="Phi (totient)" name="phi">
                     <Input placeholder="Phi" readOnly />
                  </Form.Item>
                  <Form.Item label="D (private key)" name="d">
                     <Input placeholder="D" readOnly />
                  </Form.Item>
               </Col>
            </Row>
            <Form.Item label="Plain text" name="plain_text">
               <Input.TextArea
                  rows={4}
                  className="!resize-none"
                  placeholder="Plain text"
                  autoSize
               />
            </Form.Item>
            <Form.Item label="Cipher text" name="cipher_text">
               <Input.TextArea
                  rows={4}
                  className="!resize-none"
                  placeholder="Cipher text"
                  autoSize
                  readOnly
               />
            </Form.Item>
            <Form.Item label="Text decryption" name="text_decryption">
               <Input.TextArea
                  rows={4}
                  className="!resize-none"
                  placeholder="Text decryption"
                  autoSize
                  readOnly
               />
            </Form.Item>
            <Row gutter={16}>
               <Col span={6}>
                  <Form.Item>
                     <Button
                        className="w-full"
                        type="primary"
                        onClick={handelRandom}
                     >
                        Random
                     </Button>
                  </Form.Item>
               </Col>
               <Col span={6}>
                  <Form.Item>
                     <Button
                        className="w-full"
                        type="primary"
                        onClick={handelEncrypt}
                     >
                        Encrypt
                     </Button>
                  </Form.Item>
               </Col>
               <Col span={6}>
                  <Form.Item>
                     <Button
                        className="w-full"
                        type="primary"
                        onClick={handelDecrypt}
                     >
                        Decrypt
                     </Button>
                  </Form.Item>
               </Col>
               <Col span={6}>
                  <Form.Item>
                     <Button
                        className="w-full"
                        type="primary"
                        onClick={handelReset}
                     >
                        Reset
                     </Button>
                  </Form.Item>
               </Col>
            </Row>
         </Form>
      </div>
   );
};

export default RSA;
