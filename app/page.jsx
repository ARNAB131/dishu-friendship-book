import { cookies } from "next/headers";
import HomeClient from "./HomeClient";

export default function HomePage() {
  const cookieStore = cookies();

  const initialUnlocked =
    cookieStore.get("dishu_book_opened")?.value === "yes";

  return <HomeClient initialUnlocked={initialUnlocked} />;
}
