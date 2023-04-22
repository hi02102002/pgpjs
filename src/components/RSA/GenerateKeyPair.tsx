import { Button, Form, Input, Space, Typography } from 'antd';

type FormValues = {
   private_key: number;
   public_key: number;
   modulo: number;
};

const GenerateKeyPair = () => {
   const [form] = Form.useForm<FormValues>();
   const handelGenerateKeyPair = () => {};

   return (
      <Space direction="vertical" size={16} className="w-full">
         <Typography.Title level={5}>Generate key pair RSA</Typography.Title>
         <Button onClick={handelGenerateKeyPair}>Generate</Button>
         <Form className="w-full" layout="vertical" form={form}>
            <Form.Item label="Modulo" name="modulo">
               <Input readOnly className="!resize-none" />
            </Form.Item>
            <Form.Item>
               <Button type="primary">Copy public key</Button>
            </Form.Item>
            <Form.Item label="Public Key" name="public_key">
               <Input readOnly className="!resize-none" />
            </Form.Item>

            <Form.Item>
               <Button type="primary">Copy public key</Button>
            </Form.Item>
            <Form.Item label="Private Key" name="private_key">
               <Input readOnly className="!resize-none" />
            </Form.Item>
            <Form.Item>
               <Button type="primary">Copy private key</Button>
            </Form.Item>
         </Form>
      </Space>
   );
};

export default GenerateKeyPair;
