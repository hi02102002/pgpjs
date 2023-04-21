import { CreatePGPKey } from '@/components';
import { rsa } from '@/helper/rsa';
import { Button, Tabs, TabsProps, Typography } from 'antd';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const items: TabsProps['items'] = [
   {
      key: '1',
      label: `Tạo PGP Key`,
      children: <CreatePGPKey />,
   },
   {
      key: '2',
      label: `Sign`,
      children: `Content of Tab Pane 2`,
   },
   {
      key: '3',
      label: `Verify`,
      children: `Content of Tab Pane 3`,
   },
   {
      key: '4',
      label: `RSA`,
      children: `Content of Tab Pane 3`,
   },
];

export default function Home() {
   const test = async () => {
      try {
         const res = rsa();

         console.log(res);
      } catch (e) {}
   };

   return (
      <div className="min-h-screen py-4 app-container">
         <Typography.Title level={4}>PGP Group 11</Typography.Title>
         <div>
            <Tabs defaultActiveKey="1" items={items} />
         </div>
         <Button onClick={test}>Test</Button>
      </div>
   );
}
