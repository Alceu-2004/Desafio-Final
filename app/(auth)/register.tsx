import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
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
      Alert.alert(
        "Erro",
        "Digite um email válido."
      );
      return;
    }
  
    if (senha.length < 3) {
      Alert.alert(
        "Erro",
        "A senha deve ter ao menos 3 caracteres."
      );
      return;
    }
  
    await register(email, senha);
    Alert.alert(
      "Sucesso",
      "Registro realizado com sucesso!",
      [
        {
          text: "OK",
          onPress: () => router.replace("(drawer)/home"),
        }
      ]
    );
  }
  
  return (
    <View style={styles.background}>
      <View style={styles.views}>
        <Image source={require("../../assets/cinevault.png")} style={styles.image} />
        <Text style={styles.title}>Criar conta</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.titles3}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome Completo"
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.titles3}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="seu@gmail.com"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.titles3}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="•••••"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            placeholderTextColor="#aaa"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.titles3}>Confirmar senha</Text>
          <TextInput
            style={styles.input}
            placeholder="•••••"
            secureTextEntry
            placeholderTextColor="#aaa"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => router.push("(auth)/login")}> 
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Voltar ao login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#f6f7fb",
    justifyContent: "center",
  },
  views: {
    backgroundColor: "#fff",
    height:780,
    borderRadius: 18,
    padding: 28,
    alignSelf: "center",
    width: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.10,
    shadowRadius: 7,
    elevation: 4,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 36,
    color: "#12223b"
  },titles2: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "normal",
    color: "#12223b"},
      titles3: {
      fontSize:15,
      marginBottom: 10,
      fontWeight: "normal",
      color: "#12223b",
      alignSelf: "flex-start",
      width: "100%"},
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
    gap: 16,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 18,
  },
  input: {
    borderWidth: 1.2,
    borderColor: "#d1d1d7",
    backgroundColor: "#fafbfc",
    padding: 14,
    borderRadius: 14,
    fontSize: 16,
    width: "100%",
  },
  button: {
    backgroundColor: "#D8AE82",
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 12,
    width: "100%",
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  },
  secondaryButton: {
    backgroundColor: "#f2f4fc",
    marginTop: 10,
  },
  secondaryButtonText: {
    color: "#143a77",
    fontWeight: "600"
  },
  image: {
    width: 250,
    height: 130,
    marginBottom: 20,
    alignSelf:"center",
  },
});
