import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useAuth } from "../../src/contexts/AuthContext";
import { router } from "expo-router";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function isEmailValid(mail: string) {
    return /\S+@\S+\.\S+/.test(mail);
  }

  async function handleRegister() {
    if (!isEmailValid(email)) {
      Alert.alert("Erro", "Digite um email válido.");
      return;
    }

    if (senha.length < 3) {
      Alert.alert("Erro", "A senha deve ter ao menos 3 caracteres.");
      return;
    }

    await register(email, senha);
    router.replace("(drawer)/home");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <Button title="Cadastrar" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 32, textAlign: "center", fontWeight: "bold", marginBottom: 30 },
  input: { borderWidth: 1, padding: 12, marginBottom: 10, borderRadius: 8 },
});
