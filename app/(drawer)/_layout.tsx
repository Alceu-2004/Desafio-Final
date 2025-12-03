import React from "react";
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { useAuth } from "../../src/contexts/AuthContext";
import { Button, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useRouter } from "expo-router";

function CustomDrawerContent(props) {
  const { logout } = useAuth();
  const router = useRouter();
  
  const handleLogout = async () => {
    await logout(); 
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.drawerContainer}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={styles.logoutSection}>
        <DrawerItem
          label="Sair"
          icon={({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={'red'} />
          )}
          onPress={handleLogout}
          labelStyle={{ color: 'red', fontWeight: 'bold', marginLeft: 0 }} 
        />
      </View>
    </View>
  );
}

export default function DrawerLayout() {
  const { logout } = useAuth();
  
  const handleLogoutHeader = async () => {
    await logout(); 
  };

  return (
    <Drawer
      drawerContent={CustomDrawerContent} 
      screenOptions={{
        headerShown: true,
        drawerActiveBackgroundColor: '#f0f0f0', 
        drawerLabelStyle: { marginLeft: 0 }, 
    
        headerRight: () => ( 
          <Button 
            onPress={handleLogoutHeader} 
            title="Sair" 
            color="red" 
          />
        ),
      }}
      initialRouteName="home"
    >
      

      <Drawer.Screen
        name="home"
        options={{
          title: "Início",
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
          headerRight: undefined, 
        }}
      />
      
      <Drawer.Screen
        name="about"
        options={{
          title: "Sobre",
          drawerIcon: ({ color }) => (
            <Ionicons name="information-circle-outline" size={24} color={color} />
          ),
           headerRight: undefined,
        }}
      />
      
      <Drawer.Screen
        name="assistidos"
        options={{
          title: "Assistidos",
          drawerIcon: ({ color }) => (
            <Ionicons name="checkmark-circle-outline" size={24} color={color} />
          ),
          headerRight: undefined,
        }}
      />
      
      <Drawer.Screen
        name="quero-assistir"
        options={{
          title: "Quero Assistir",
          drawerIcon: ({ color }) => (
            <Ionicons name="bookmark-outline" size={24} color={color} />
          ),
          headerRight: undefined,
        }}
      />
      
      <Drawer.Screen
        name="add-movie/index"
        options={{
          title: "Adicionar Filme",
          drawerItemStyle: { height: 0, overflow: 'hidden' }, 
        }}
      />
      
      <Drawer.Screen
        name="movie/[id]"
        options={{
          title: "Detalhes do Filme",
          drawerItemStyle: { height: 0, overflow: 'hidden' }, 
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
    },
    logoutSection: {
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    }
});