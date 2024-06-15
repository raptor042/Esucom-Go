import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, SafeAreaView } from 'react-native';
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { store } from '../../src/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
    const { state, dispatch } = useContext(store)
    const { auth } = state

    useEffect(() => {
        getData()
    }, [auth])

    const authorize = () => {
        dispatch({
            type : "Authorized",
            payload : {
                auth : true
            }
        })
    }

    const getData = async () => {
        try {
            const reg = await AsyncStorage.getItem('reg');
            const email = await AsyncStorage.getItem('email');
            const password = await AsyncStorage.getItem('password');
            
            if (reg !== null && email !== null && password !== null) {
                authorize()

                router.navigate("/home")
            } else {
                router.navigate("/auth")
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <SafeAreaView className="flex items-center justify-center">
            <ActivityIndicator />
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}
