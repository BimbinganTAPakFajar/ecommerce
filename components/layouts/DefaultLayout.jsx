import NavigationBar from "../NavigationBar";
import Footer from "../Footer";
export default function DefaultLayout({ children }) {
  return (
    <div className="flex flex-col gap-y-10 w-full p-2">
      <NavigationBar />
      {children}
      <Footer />
    </div>
  );
}
