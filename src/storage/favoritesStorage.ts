import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@cinevault_favorites";

export async function loadFavorites() {
  try {
    const data = await AsyncStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Erro ao carregar favoritos:", error);
    return [];
  }
}

export async function saveFavorites(favorites: any[]) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Erro ao salvar favoritos:", error);
  }
}
