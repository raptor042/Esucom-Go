import { SplashScreen, Slot } from "expo-router";
import { useFonts, Poppins_700Bold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { Caveat_700Bold } from '@expo-google-fonts/caveat';
import { useEffect } from "react";
import { StateProvider } from "../libs/store";
import { ThemeProvider } from "react-native-magnus";
import { Provider } from "react-native-paper";

SplashScreen.preventAutoHideAsync()

export default function HomeLayout() {
    const [fontsLoaded, fontError] = useFonts({
        Poppins_700Bold,
        Caveat_700Bold,
        Poppins_400Regular
    });
    
    useEffect(() => {
        if (fontsLoaded || fontError) {
          SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);
    
    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <ThemeProvider>
            <Provider>
                <StateProvider>
                    <Slot/>
                </StateProvider>
            </Provider>
        </ThemeProvider>
    )
}