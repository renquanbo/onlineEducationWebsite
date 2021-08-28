import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head';
import { MessageProvider } from '../components/custom-hooks/provider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Online Education</title>
        <meta key="description" name="description" content="Online Education System" />
      </Head>
      <MessageProvider>
        <Component {...pageProps} />
      </MessageProvider>
    </>
  );
}
export default MyApp
