import { UploadOutlined } from '@ant-design/icons';
import { saveAs } from 'file-saver';

import {
   Button,
   Col,
   Form,
   Input,
   Row,
   Upload,
   message as aMessage,
} from 'antd';
import axios from 'axios';
import { useState } from 'react';

type FormValues = {
   public_key: string;
   message: string;
   encrypted_message: string;
   private_key: string;
   password: string;
};

const Encryption = () => {
   const [form] = Form.useForm<FormValues>();
   const [loading, setLoading] = useState(false);
   const handleEncrypt = async (values: FormValues) => {
      try {
         const { public_key, message, private_key, password } = values;
         if (!public_key || !message) {
            aMessage.error('Missing public key or message');
            return;
         }
         setLoading(true);
         const { encrypted, isSigned } = await axios
            .post('/api/pgp/encrypt', {
               public_key,
               message,
               private_key,
               password,
            })
            .then((v) => v.data.data);
         form.setFieldsValue({
            encrypted_message: encrypted,
         });
         setLoading(false);
         if (isSigned) {
            aMessage.success('Encrypt and sign success');
         } else {
            aMessage.success('Encrypt success (Not sign)');
         }
      } catch (error: any) {
         setLoading(false);
         aMessage.error(error?.response?.data?.message || 'Decrypt fail');
      }
   };

   const handelDownFile = () => {
      const { encrypted_message } = form.getFieldsValue();
      if (!encrypted_message) return aMessage.error('No content');
      const file = new Blob([encrypted_message], {
         type: 'text/plain;charset=utf-8',
      });
      saveAs(
         file,
         `${Math.random().toString(36).slice(2, 7)}.encrypted_message.txt`
      );
   };

   return (
      <div>
         <Form layout="vertical" form={form} onFinish={handleEncrypt}>
            <Row gutter={16}>
               <Col span={12}>
                  <Form.Item
                     label="Public key (To encrypt)"
                     name="public_key"
                     rules={[
                        {
                           required: true,
                           message: 'Please input your public key!',
                        },
                     ]}
                  >
                     <Input.TextArea
                        readOnly
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
                  <Form.Item label="Private key (To sign)" name="private_key">
                     <Input.TextArea
                        readOnly
                        placeholder="Private key (Signer)"
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
                  <Form.Item label="Password" name="password">
                     <Input.Password
                        placeholder="Password"
                        className="!resize-none"
                        name="password"
                     />
                  </Form.Item>
               </Col>
               <Col span={12}>
                  <Form.Item
                     label="Message"
                     name="message"
                     rules={[
                        {
                           required: true,
                           message: 'Please input your message!',
                        },
                     ]}
                  >
                     <Input.TextArea
                        placeholder="Message"
                        rows={5}
                        className="!resize-none"
                        name="message"
                     />
                  </Form.Item>
                  <Form.Item>
                     <Button
                        className="w-full"
                        type="primary"
                        loading={loading}
                        htmlType="submit"
                     >
                        Encrypt
                     </Button>
                  </Form.Item>
                  <Form.Item label="Encrypted message" name="encrypted_message">
                     <Input.TextArea
                        readOnly
                        placeholder="Encrypted message"
                        rows={5}
                        className="!resize-none"
                        name="encrypted_message"
                     />
                  </Form.Item>
                  <Form.Item>
                     <Button
                        className="w-full"
                        type="primary"
                        onClick={handelDownFile}
                     >
                        Download encrypted message
                     </Button>
                  </Form.Item>
               </Col>
            </Row>
         </Form>
      </div>
   );
};

export default Encryption;
