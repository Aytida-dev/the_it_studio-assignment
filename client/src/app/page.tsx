import Navbar from "@/components/Navbar";
import UserTable from "@/components/UserTable";
import { Toaster } from "sonner";

export default function Home() {

  return (
    <>
      <Toaster richColors />
      <Navbar />
      <UserTable />
    </>
  );
}
