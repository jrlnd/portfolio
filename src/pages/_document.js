import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="title" content="JRLND Portfolio" />
        <meta name="description" content="My personal frontend developer portfolio"/>
        <meta name="keywords" content="portfolio, resume, frontend, web, full-stack, developer, project, work, experience, freelance, freelancing, contract"/>
        <meta name="robots" content="index, follow"/>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="language" content="English"/>
        <meta name="author" content="Rolando JR Gaoat"/>
        

        <link rel="icon" href="/favicon.ico" />
        <link rel="preload" href="/fonts/Gilroy/Gilroy-Heavy.ttf" as="font" crossOrigin="true" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat&family=Neonderthaw&family=Libre+Baskerville:ital@0;1&&family=Source+Code+Pro&family=Source+Sans+Pro:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </Head>
      <body className="bg-theme-gray-900 overflow-y-hidden overflow-x-hidden antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
