import { Redirect } from "expo-router";
import { useAuth } from "../src/contexts/AuthContext";

export default function Index() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="(auth)/login" />;
  }

  return <Redirect href="(tabs)/home" />;
}
