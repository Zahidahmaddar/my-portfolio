import { ThemeProvider } from "next-themes";
import "../styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Zahid Farooq | Portfolio</title>
        <meta name="description" content="Portfolio of Zahid Farooq" />
        <link rel="icon" href="/images/my-image.png" />
      </Head>
      <ThemeProvider attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;
