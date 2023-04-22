import { Button, Col, Form, Input, Row, message } from 'antd';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { omit } from 'lodash';
import { useState } from 'react';
type FormValues = {
   name: string;
   email: string;
   comment: string;
   password: string;
   public_key: string;
   private_key: string;
};

const CreatePGPKey = () => {
   const [isLoading, setIsLoading] = useState(false);
   const [form] = Form.useForm<FormValues>();
   const handelGeneratekey = async (fields: FormValues) => {
      try {
         setIsLoading(true);
         const res = await axios.post(
            '/api/pgp/generatekey',
            omit(fields, ['public_key', 'private_key'])
         );
         form.setFieldsValue({
            public_key: res.data.data.publicKey,
            private_key: res.data.data.privateKey,
         });
         setIsLoading(false);
         message.success('Generate key pair successfully');
         form.setFieldsValue({
            name: '',
            email: '',
            comment: '',
            password: '',
         });
      } catch (error: any) {
         setIsLoading(false);
         message.error('Generate key pair failed');
      }
   };

   const handelDownFile = (content: string, type: 'pub' | 'sec') => {
      if (!content) return message.error('No content');
      const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
      saveAs(file, `${Math.random().toString(36).slice(2, 7)}.${type}.asc`);
   };

   return (
      <Form layout="vertical" form={form} onFinish={handelGeneratekey}>
         <Row gutter={16}>
            <Col span={12}>
               <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                     {
                        required: true,
                        message: 'Name is required',
                     },
                  ]}
               >
                  <Input placeholder="Name" />
               </Form.Item>
               <Form.Item
                  label="Email"
                  name="email"
                  required
                  rules={[
                     {
                        required: true,
                        message: 'Email is required',
                     },
                     {
                        type: 'email',
                        message: 'Email is invalid',
                     },
                  ]}
               >
                  <Input placeholder="Email" />
               </Form.Item>
               <Form.Item label="Comment" name="comment">
                  <Input placeholder="Comment" />
               </Form.Item>
               <Form.Item
                  label="Password"
                  name="password"
                  required
                  rules={[
                     {
                        required: true,
                        message: 'Password is required',
                     },
                     {
                        min: 6,
                        message: 'Password must be at least 6 characters',
                     },
                  ]}
               >
                  <Input.Password placeholder="Password" name="password" />
               </Form.Item>
               <Form.Item>
                  <Button
                     loading={isLoading}
                     className="w-full"
                     type="primary"
                     htmlType="submit"
                  >
                     Generate key
                  </Button>
               </Form.Item>
            </Col>
            <Col span={12}>
               <Form.Item label="Public key" name="public_key">
                  <Input.TextArea readOnly className="!resize-none" rows={6} />
               </Form.Item>
               <Form.Item>
                  <Button
                     type="primary"
                     onClick={() =>
                        handelDownFile(form.getFieldValue('public_key'), 'pub')
                     }
                  >
                     Download public key{' '}
                  </Button>
               </Form.Item>
               <Form.Item label="Private key" name="private_key">
                  <Input.TextArea readOnly className="!resize-none" rows={6} />
               </Form.Item>
               <Form.Item>
                  <Button
                     type="primary"
                     onClick={() =>
                        handelDownFile(form.getFieldValue('private_key'), 'sec')
                     }
                  >
                     Download Private key
                  </Button>
               </Form.Item>
            </Col>
         </Row>
      </Form>
   );
};

export default CreatePGPKey;
