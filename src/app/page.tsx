import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "./page.module.css";
import CreateUserForm from "../components/CreateUserForm";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={styles.main}>
      <title>Fetch Rewards</title>
      <CreateUserForm />
    </main>
  );
}
