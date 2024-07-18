import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, SafeAreaView, Text, View } from 'react-native';
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import { store } from '../libs/store';
import { supabase } from "../libs/supabase";
import { Button, Dropdown, Image } from 'react-native-magnus';

const dropdownRef = React.createRef();

export default function App() {
    const { dispatch } = useContext(store)

    const [loading, setLoading] = useState(false)

    const { width } = Dimensions.get("window")
    const height = width

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            dispatch({
                type : "SET_AUTH",
                payload : {
                    auth : session
                }
            })
        })
    
        supabase.auth.onAuthStateChange((_event, session) => {
            dispatch({
                type : "SET_AUTH",
                payload : {
                    auth : session
                }
            })
        })
    }, [])

    const open = () => {
        dropdownRef.current.open()

        setLoading(true)
    }

    const close = () => {
        dropdownRef.current.close()

        setLoading(false)
    }

    const setRole = (role) => {
        console.log(role)

        setLoading(false)

        router.navigate(`/auth/${role}`)
    }

    return (
        <SafeAreaView className="flex items-center justify-center">
            <Dropdown
                ref={dropdownRef}
                title={
                    <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-md mx-4 mb-4 font-bold text-gray-500">
                        Pick your role
                    </Text>
                }
                mt="xs"
                pb="lg"
                showSwipeIndicator={true}
                roundedTop="xl"
                onBackdropPress={close}
                onDismiss={close}
            >
                    <Dropdown.Option onPress={(e) => setRole("admin")} py="md" px="xl" block>
                        <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-md font-bold">Admin</Text>
                    </Dropdown.Option>
                    <Dropdown.Option onPress={(e) => setRole("student")} py="md" px="xl" block>
                        <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-md font-bold">Student</Text>
                    </Dropdown.Option>
            </Dropdown>
            <View className="flex justify-center h-full">
                <View className="">
                    <Image
                        h={height}
                        w={width}
                        source={{ uri: "https://img.freepik.com/free-vector/login-concept-illustration_114360-739.jpg?t=st=1718322451~exp=1718326051~hmac=32e704f20bd6b81c900fbedf248a0c1cd6748d415dbdb4223abcec461f3cc4a2&w=740" }}
                    />
                </View>
                <View className="m-4">
                    <Button onPress={open} bg="#26DDC0" rounded="md" block>
                        {loading && <ActivityIndicator />}
                        {!loading && <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-md font-bold text-white">Select your role</Text>}
                    </Button>
                </View>
            </View>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}
