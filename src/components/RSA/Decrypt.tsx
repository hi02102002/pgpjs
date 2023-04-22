import { Button, Form, Input, Space, Typography } from 'antd';

const Decrypt = () => {
   const [form] = Form.useForm();
   return (
      <Space direction="vertical" size={16} className="w-full">
         <Typography.Title level={5}>Decrypt</Typography.Title>
         <Form className="w-full" layout="vertical" form={form}>
            <Form.Item label="Modulo" name="modulo">
               <Input readOnly />
            </Form.Item>
            <Form.Item>
               <Button type="primary">Copy public key</Button>
            </Form.Item>
         </Form>
      </Space>
   );
};

export default Decrypt;
