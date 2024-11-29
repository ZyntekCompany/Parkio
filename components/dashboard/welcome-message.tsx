import { currentUser } from "@/lib/auth-user";
import { Greeting } from "./greeting";

export async function WelcomeMessage() {
  const loggedUser = await currentUser();

  return <Greeting userName={loggedUser?.name!} />;
}
