// @flow
import React from 'react';
import App from 'next/app';
import Router from 'next/router';
import Head from 'next/head';
import NProgress from 'nprogress';
import { Title } from 'src/components/SEO';

function getTitleFromComponent(
  component: React$ComponentType<mixed> & { title?: string | (() => string) },
): ?string | string[] {
  const { title } = component;
  if (typeof title === 'string') return title;
  if (typeof title === 'function') return title();
  return null;
}

const BASE_URL = process.env.NEXT_STATIC_BASE_URL;

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

class MyApp extends App {
  state = {
    cookiesNoticeAccepted: undefined,
  };

  render() {
    const { Component, router, pageProps } = this.props;
    const { url } = Component;
    let ogUrl;
    switch (typeof url) {
      case 'function':
        ogUrl = url(router);
        break;
      case 'string':
        ogUrl = url;
        break;
      default:
    }
    if (!ogUrl) {
      ogUrl = router.asPath;
    }
    return (
      <div className="site">
        <Title siteName pageName={getTitleFromComponent(Component)} />
        <Head>
          <meta
            key="meta-description"
            name="description"
            content="Vi är en kreativ digitalbyrå som sitter i Gamla stan, Stockholm och kombinerar gamla anor med ny utveckling och design. Hör gärna av dig (08-519 70 510 eller info@pija.se) om du vill diskutera digitala grejer analogt."
          />
          <meta
            key="meta-abstract"
            name="abstract"
            content="Vi är en kreativ digitalbyrå som sitter i Gamla stan, Stockholm och kombinerar gamla anor med ny utveckling och design."
          />
          <meta
            key="meta-keywords"
            name="keywords"
            content="Apputvecklare, Webbbyrå, Mobilebyrå, HTML5, Drupal, Webbstrategi, Design, Mobil"
          />
          <meta
            key="meta-og-image"
            name="og:image"
            content="https://www.pija.se/images/logo.svg"
          />
          <meta key="meta-og-type" name="og:type" content="article" />
          {ogUrl != null && (
            <meta
              key="meta-og-url"
              name="og:url"
              content={`${BASE_URL || ''}${ogUrl}`}
            />
          )}
        </Head>
        <Component {...pageProps} generateTitle={this.title} />
      </div>
    );
  }
}

export default MyApp;
