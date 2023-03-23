import { SessionProvider } from "next-auth/react";
import NavigationBar from "@/components/NavigationBar";
import "@/styles/globals.css";
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <NavigationBar />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
