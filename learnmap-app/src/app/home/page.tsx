import { redirect } from "next/navigation";

export default function HomePage() {
  // This route used to be a placeholder dashboard.
  // For a cleaner first impression, `/` is the public landing page.
  redirect("/");
}
