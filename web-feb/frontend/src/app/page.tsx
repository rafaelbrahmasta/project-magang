import { redirect } from "next/navigation";

export default function RootPage() {
  // Arahkan ke slug fakultas yang benar, misal /feb atau /home
  redirect("/feb");
}