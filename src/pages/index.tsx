import { CreatePGPKey, Decryption, Encryption, RSA } from '@/components';
import { Tabs, TabsProps, Typography } from 'antd';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const items: TabsProps['items'] = [
   {
      key: '1',
      label: `Create PGP Key`,
      children: <CreatePGPKey />,
   },
   {
      key: '2',
      label: `Encrypt (Sign)`,
      children: <Encryption />,
   },
   {
      key: '3',
      label: `Decrypt (Verify)`,
      children: <Decryption />,
   },
   {
      key: '4',
      label: `RSA`,
      children: <RSA />,
   },
];

export default function Home() {
   return (
      <div className="min-h-screen py-4 app-container">
         <Typography.Title level={4}>PGP Group 11</Typography.Title>
         <div>
            <Tabs defaultActiveKey="1" items={items} />
         </div>
      </div>
   );
}
