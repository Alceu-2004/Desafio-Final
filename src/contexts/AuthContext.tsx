import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  user: string | null;
  isLoading: boolean; 
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const stored = await AsyncStorage.getItem("user");
      if (stored) {
        setUser(stored);
      }
    } catch (error) {
        console.error("Erro ao carregar usuário:", error);
    } finally {
      setIsLoading(false); 
    }
  }

  async function register(email: string, password: string) {
    const data = JSON.stringify({ email, password });
    await AsyncStorage.setItem("credentials", data);
    await AsyncStorage.setItem("user", email);
    setUser(email);
    return true;
  }

  async function login(email: string, password: string) {
    const stored = await AsyncStorage.getItem("credentials");

    if (!stored) return false;

    const { email: savedEmail, password: savedPass } = JSON.parse(stored);

    if (email === savedEmail && password === savedPass) {
      await AsyncStorage.setItem("user", email);
      setUser(email);
      return true;
    }

    return false;
  }

  async function logout() {
    try{
      await AsyncStorage.removeItem("user");
    } catch (e){
      console.error("Erro ao remover item do AsyncStorage:", e)
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}