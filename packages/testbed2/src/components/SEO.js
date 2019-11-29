// @flow
import React from 'react';
import Head from 'next/head';

type Props = {
  pageName: ?string | string[],
  siteName?: string | string[] | true,
};

const DEFAULT_SITENAME = ['XVision', 'Dashboard'];

function generatePageName(pageName: string | string[]): string {
  const res = Array.isArray(pageName) ? pageName : [pageName];
  return res.join(' - ');
}

function generateSiteName(siteName: string | string[]): string {
  const res = Array.isArray(siteName) ? siteName : [siteName];
  return res.join(' - ');
}

function generateTitle(
  pageName: ?string | string[],
  siteName?: string | string[] = DEFAULT_SITENAME,
): string {
  // eslint-disable-next-line no-param-reassign
  if (siteName == null) siteName = DEFAULT_SITENAME;
  return pageName != null
    ? `${generatePageName(pageName)} | ${generateSiteName(siteName)}`
    : generateSiteName(siteName);
}

function Title({ pageName, siteName }: Props): React$Element<Head> {
  // eslint-disable-next-line no-param-reassign
  if (siteName === true) siteName = DEFAULT_SITENAME;
  return (
    <Head>
      <title>{generateTitle(pageName, siteName)}</title>
      {siteName != null && (
        <meta
          key="meta-og-site_name"
          property="og:site_name"
          content={generateSiteName(siteName)}
        />
      )}
      {pageName != null && (
        <meta
          key="meta-og-title"
          property="og:title"
          content={generatePageName(pageName)}
        />
      )}
    </Head>
  );
}

Title.defaultProps = {
  siteName: undefined,
};

const BASE_URL = process.env.NEXT_STATIC_BASE_URL;

function OgUrl({ url }: { url: string }): false | React$Element<Head> {
  return (
    BASE_URL != null && (
      <Head>
        <meta key="meta-og-url" name="og:url" content={`${BASE_URL}${url}`} />
      </Head>
    )
  );
}

export { Title, OgUrl };
