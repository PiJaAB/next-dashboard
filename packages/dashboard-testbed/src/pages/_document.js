// @flow
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

// TODO: Correct value for the "theme-color"-meta tag?

const BASE_URL = process.env.NEXT_STATIC_BASE_URL;

class MyDocument extends Document {
  render() {
    return (
      <Html lang="sv" dir="ltr">
        <Head>
          <meta charSet="utf-8" />
          <link rel="shortcut icon" href={`${String(BASE_URL)}/favicon.ico`} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="MobileOptimized" content="width" />
          <meta name="HandheldFriendly" content="true" />
          <meta name="theme-color" content="#000000" />
          <link rel="manifest" href={`${String(BASE_URL)}/manifest.json`} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
