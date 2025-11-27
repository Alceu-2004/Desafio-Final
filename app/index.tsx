import { Redirect } from "expo-router";
import { useAuth } from "../src/contexts/AuthContext"; 

export default function Index() {
  const { user, isLoading } = useAuth(); 

  if (isLoading) {
    return null; 
  }

  if (user) {
    return <Redirect href="/(drawer)/home" />; 
  } else {
    return <Redirect href="/(auth)/login" />; 
  }
}