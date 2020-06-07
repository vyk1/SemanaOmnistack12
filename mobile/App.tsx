import React from 'react';
// Cor do topo
import { AppLoading } from "expo";
import { StatusBar } from 'react-native';
import { Roboto_400Regular, Roboto_500Medium } from "@expo-google-fonts/roboto";
import { Ubuntu_700Bold, useFonts } from "@expo-google-fonts/ubuntu";
import Routes from './src/routes';
// Fontes:expo.cmd install expo-font @expo-google-fonts/ubuntu @expo-google-fonts/roboto
export default function App() {

  // Carregar fontes
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold
  })

  // Enquanto não carrega...
  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    // Nome é Fragment:
    <>
      {/* bgc funciona só no android */}
      {/* transluscent: deixa status bar ficar por cima do conteudo */}
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <Routes />
    </>
  )
}