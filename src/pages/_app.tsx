import '@/styles/globals.css';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
export default function App({ Component, pageProps }: AppProps) {
   const [mounted, setMounted] = useState(false);
   useEffect(() => setMounted(true), []);

   if (typeof window !== 'undefined') {
      window.onload = () => {
         document.getElementById('holderStyle')?.remove();
      };
   }
   return (
      <ConfigProvider
         theme={{
            token: {
               borderRadius: 2,
            },
         }}
      >
         <style
            id="holderStyle"
            dangerouslySetInnerHTML={{
               __html: `
                    *, *::before, *::after {
                        transition: none!important;
                    }
                    `,
            }}
         />
         <div style={{ visibility: !mounted ? 'hidden' : 'visible' }}>
            <Component {...pageProps} />
         </div>
      </ConfigProvider>
   );
}
