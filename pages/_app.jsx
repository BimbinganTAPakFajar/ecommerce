import { SessionProvider } from "next-auth/react";
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import Head from "next/head";
import "@/styles/globals.css";
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Head>
        <script
          type="text/javascript"
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        ></script>
      </Head>
      <div className="flex flex-col gap-y-10 w-full">
        <NavigationBar />
        <Component {...pageProps} />
        <Footer />
      </div>
    </SessionProvider>
  );
}
