import { UploadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Upload, message } from 'antd';
import axios from 'axios';
import { useState } from 'react';

type FormValues = {
   private_key: string;
   encrypted_message: string;
   password: string;
   decrypted_message: string;
   public_key: string;
};

const Decryption = () => {
   const [form] = Form.useForm<FormValues>();
   const [loading, setLoading] = useState(false);

   const handleDecryption = async (values: FormValues) => {
      try {
         const { private_key, encrypted_message, password, public_key } =
            values;
         if (!private_key || !encrypted_message || !password) {
            message.error(
               'Missing private key or encrypted message or password'
            );
            return;
         }
         setLoading(true);
         const { decrypted, isVerified, keyID } = await axios
            .post('/api/pgp/decrypt', {
               private_key,
               encrypted_message,
               password,
               public_key,
            })
            .then((v) => v.data.data);
         form.setFieldsValue({
            decrypted_message: decrypted,
         });
         setLoading(false);
         if (isVerified) {
            message.success(`Decrypt and verify success. keyID: ${keyID}`);
         } else {
            message.success('Decrypt success (Not verify)');
         }
      } catch (error: any) {
         setLoading(false);
         message.error(error?.response?.data?.message || 'Decrypt fail');
         form.setFieldsValue({
            decrypted_message: error?.response?.data?.decrypted,
         });
      }
   };

   return (
      <div>
         <Form layout="vertical" form={form} onFinish={handleDecryption}>
            <Row gutter={16}>
               <Col span={12}>
                  <Form.Item
                     label="Private key (To decrypt)"
                     name="private_key"
                     rules={[
                        {
                           required: true,
                           message: 'Please input your private key!',
                        },
                     ]}
                  >
                     <Input.TextArea
                        placeholder="Private key"
                        rows={5}
                        className="!resize-none"
                        name="private_key"
                     />
                  </Form.Item>
                  <Form.Item>
                     <Upload
                        onChange={(info) => {
                           const fr = new FileReader();
                           fr.onload = () => {
                              console.log(fr.result);
                              form.setFieldValue(
                                 'private_key',
                                 fr.result as string
                              );
                           };
                           fr.readAsText(info.file.originFileObj as Blob);
                        }}
                        maxCount={1}
                     >
                        <Button icon={<UploadOutlined />}>
                           Click to upload private key
                        </Button>
                     </Upload>
                  </Form.Item>
                  <Form.Item
                     label="Password"
                     name="password"
                     rules={[
                        {
                           required: true,
                           message: 'Please input your password!',
                        },
                     ]}
                  >
                     <Input.Password
                        placeholder="Password"
                        className="!resize-none"
                        name="password"
                     />
                  </Form.Item>
                  <Form.Item label="Public key (To verify)" name="public_key">
                     <Input.TextArea
                        placeholder="Public key"
                        rows={5}
                        className="!resize-none"
                        name="public_key"
                     />
                  </Form.Item>
                  <Form.Item>
                     <Upload
                        onChange={(info) => {
                           const fr = new FileReader();
                           fr.onload = () => {
                              console.log(fr.result);
                              form.setFieldValue(
                                 'public_key',
                                 fr.result as string
                              );
                           };
                           fr.readAsText(info.file.originFileObj as Blob);
                        }}
                        maxCount={1}
                     >
                        <Button icon={<UploadOutlined />}>
                           Click to upload public key
                        </Button>
                     </Upload>
                  </Form.Item>
               </Col>
               <Col span={12}>
                  <Form.Item label="Encrypted message" name="encrypted_message">
                     <Input.TextArea
                        placeholder="Encrypted message"
                        rows={5}
                        className="!resize-none"
                        name="encrypted_message"
                     />
                  </Form.Item>
                  <Form.Item>
                     <Upload
                        onChange={(info) => {
                           const fr = new FileReader();
                           fr.onload = () => {
                              console.log(fr.result);
                              form.setFieldValue(
                                 'encrypted_message',
                                 fr.result as string
                              );
                           };
                           fr.readAsText(info.file.originFileObj as Blob);
                        }}
                        maxCount={1}
                     >
                        <Button icon={<UploadOutlined />}>
                           Click to upload encrypted message
                        </Button>
                     </Upload>
                  </Form.Item>
                  <Form.Item>
                     <Button
                        className="w-full"
                        type="primary"
                        loading={loading}
                        htmlType="submit"
                     >
                        Decrypt
                     </Button>
                  </Form.Item>
                  <Form.Item label="Decrypted message" name="decrypted_message">
                     <Input.TextArea
                        readOnly
                        placeholder="Decrypted message"
                        rows={5}
                        className="!resize-none"
                        name="decrypted_message"
                     />
                  </Form.Item>
               </Col>
            </Row>
         </Form>
      </div>
   );
};

export default Decryption;
