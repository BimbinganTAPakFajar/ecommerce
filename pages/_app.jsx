import { SessionProvider } from "next-auth/react";

import "@/styles/globals.css";
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <SessionProvider session={session}>
      {/* <div className="flex flex-col gap-y-10 w-full">
          <NavigationBar />
          <Component {...pageProps} />
          <Footer />
        </div> */}
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  );
}
