import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import CssBaseline from '@mui/joy/CssBaseline';
import { CssVarsProvider } from '@mui/joy';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { UserProvider } from '@auth0/nextjs-auth0';

import type { AppProps } from 'next/dist/shared/lib/router/router';

const clientSideEmotionCache = createCache({ key: 'css', prepend: true });

function MyApp({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps
}: AppProps) {
  const router = useRouter();

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </Head>
      <UserProvider>
        <CssVarsProvider>
          <CssBaseline />
          <Component {...pageProps} key={router.asPath} />
        </CssVarsProvider>
      </UserProvider>
    </CacheProvider>
  );
}

export default MyApp;
