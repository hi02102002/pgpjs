import { Button, Col, Form, Input, Row, message } from 'antd';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { useState } from 'react';
import { omit } from 'lodash';
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
         message.success('Tạo cặp key thành công');
         form.setFieldsValue({
            name: '',
            email: '',
            comment: '',
            password: '',
         });
      } catch (error: any) {
         setIsLoading(false);
         message.error('Có lỗi xảy ra');
      }
   };

   const handelDownFile = (content: string, type: 'pub' | 'sec') => {
      if (!content) return message.error('Không có nội dung');
      const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
      saveAs(file, `${Math.random().toString(36).slice(2, 7)}.${type}.asc`);
   };

   return (
      <Form layout="vertical" form={form} onFinish={handelGeneratekey}>
         <Row gutter={16}>
            <Col span={12}>
               <Form.Item
                  label="Tên"
                  name="name"
                  rules={[
                     {
                        required: true,
                        message: 'Vui lòng nhập tên',
                     },
                  ]}
               >
                  <Input placeholder="Tên" />
               </Form.Item>
               <Form.Item
                  label="Email"
                  name="email"
                  required
                  rules={[
                     {
                        required: true,
                        message: 'Vui lòng nhập email',
                     },
                     {
                        type: 'email',
                        message: 'Email không hợp lệ',
                     },
                  ]}
               >
                  <Input placeholder="Email" />
               </Form.Item>
               <Form.Item label="Bình luận" name="comment">
                  <Input placeholder="Bình luận" />
               </Form.Item>
               <Form.Item
                  label="Mật khẩu"
                  name="password"
                  required
                  rules={[
                     {
                        required: true,
                        message: 'Vui lòng nhập mật khẩu',
                     },
                     {
                        min: 6,
                        message: 'Mật khẩu phải có ít nhất 6 ký tự',
                     },
                  ]}
               >
                  <Input.Password placeholder="Mật khẩu" name="password" />
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
