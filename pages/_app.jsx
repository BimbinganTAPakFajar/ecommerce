import { SessionProvider } from "next-auth/react";
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import "@/styles/globals.css";
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <div className="flex flex-col gap-y-10 w-full">
        <NavigationBar />
        <Component {...pageProps} />
        <Footer />
      </div>
    </SessionProvider>
  );
}
