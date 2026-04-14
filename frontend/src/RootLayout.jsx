import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar/navbar"; // Import the Navbar here
import Footer from "./components/footer/footer";

function RootLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default RootLayout;