import { ActivityIndicator, Alert, AppState, Pressable, SafeAreaView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import { Button, Icon, Input, Snackbar } from "react-native-magnus";
import { store } from "../../../libs/store";
import { supabase } from "../../../libs/supabase";

const snackbarRef = React.createRef();

AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
})

const ADMIN_CODE = process.env.EXPO_PUBLIC_ADMIN_CODE;

export default function Auth() {
    const [reg, setReg] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [code, setCode] = useState("")

    const [login, setLogin] = useState(false)

    const [loading, setLoading] = useState(false)

    const { state } = useContext(store)
    const { auth } = state

    const { role } = useLocalSearchParams()

    useEffect(() => {
        // if(auth && auth.user && role == "admin") {
        //     router.navigate("/admin/dashboard")
        // } else if(auth && auth.user && role == "student") {
        //     router.navigate("/home")
        // }
    }, [])

    const signUp = async () => {
        const { data: { session, user }, error } = await supabase.auth.signUp({
            email,
            password
        })

        if(error) {
            snackbarRef.current.show(error.message, {
                duration: 5000,
                suffix: <Icon name="closecircle" color="white" fontSize="md" fontFamily="AntDesign"/>
            })

            throw error
        }

        if(!session) {
            Alert.alert("Please check your inbox for email verification!!!")

            await addUser(user.id)

            setLoading(false)
            setLogin(true)
        }
    }

    const signIn = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if(error) {
            snackbarRef.current.show(error.message, {
                duration: 5000,
                suffix: <Icon name="closecircle" color="white" fontSize="md" fontFamily="AntDesign"/>
            })

            throw error
        }
    }

    const addUser = async (id) => {
        const data = {
            id,
            email,
            reg,
            role,
            created_at: new Date()
        }

        const { error } = await supabase.from("users").upsert(data)

        if(error) {
            snackbarRef.current.show(error.message, {
                duration: 5000,
                suffix: <Icon name="closecircle" color="white" fontSize="md" fontFamily="AntDesign"/>
            })

            throw error
        }
    }

    const onClick = async () => {
        setLoading(true)

        try {
            if(reg == "" || email == "" || password == "" || code == "") {
                snackbarRef.current.show("Missing Data!!!", {
                    duration: 5000,
                    suffix: <Icon name="closecircle" color="white" fontSize="md" fontFamily="AntDesign"/>
                })
    
                setLoading(false)
            } else if(code != ADMIN_CODE) {
                snackbarRef.current.show("Wrong Admin Code!!!", {
                    duration: 5000,
                    suffix: <Icon name="closecircle" color="white" fontSize="md" fontFamily="AntDesign"/>
                })
    
                setLoading(false)
            } else {
                if(!login) {
                    await signUp()
                } else {
                    await signIn()
                }
    
                setLoading(false)
    
                if(role == "admin") {
                    router.navigate("/admin/dashboard")
                } else {
                    router.navigate("/home")
                }
            }
        } catch (error) {
            console.log(error)

            setLoading(false)
        }
    }

    return (
        <SafeAreaView>
            <Snackbar ref={snackbarRef} bg="red700" color="white"></Snackbar>
            <View className="flex justify-center h-screen">
                {!login && <View className="flex items-center m-4">
                    <Input
                        onChangeText={(text) => setReg(text)}
                        defaultValue={reg}
                        placeholder="Reg Number"
                        p={10}
                        focusBorderColor="#26DDC0"
                        suffix={<Icon name="user" color="gray900" fontFamily="Feather" />}
                    />
                </View>}
                <View className="flex items-center m-4">
                    <Input
                        onChangeText={(text) => setEmail(text)}
                        defaultValue={email}
                        placeholder="Email Address"
                        p={10}
                        focusBorderColor="#26DDC0"
                        suffix={<Icon name="mail" color="gray900" fontFamily="Feather" />}
                    />
                </View>
                <View className="flex items-center m-4">
                    <Input
                        onChangeText={(text) => setPassword(text)}
                        defaultValue={password}
                        placeholder="Password"
                        mt="md"
                        p={10}
                        secureTextEntry
                        focusBorderColor="#26DDC0"
                        suffix={<Icon name="lock" color="gray900" fontFamily="FontAwesome5" />}
                    />
                </View>
                {role == "admin" && <View className="flex items-center m-4">
                    <Input
                        onChangeText={(text) => setCode(text)}
                        defaultValue={code}
                        placeholder="Admin Code"
                        mt="md"
                        p={10}
                        secureTextEntry
                        focusBorderColor="#26DDC0"
                        suffix={<Icon name="tags" color="gray900" fontFamily="AntDesign" />}
                    />
                </View>}
                <View className="flex justify-center m-4">
                    <Button onPress={onClick} bg="#26DDC0" rounded="md" block>
                        {loading && <ActivityIndicator />}
                        {!loading && <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-sm text-white">{login ? "Login" : "Sign Up"}</Text>}
                    </Button>
                </View>
                <View className="flex justify-center m-4">
                    <Text style={{ fontFamily: "Poppins_400Regular" }} className="text-xs text-gray-500">
                        {!login ? "Already have an account?" : "Don't have an account?"}
                        <Pressable onPress={() => login ? setLogin(false) : setLogin(true)}>
                            <Text style={{ fontFamily: "Poppins_400Regular" }} className="text-xs mx-2 text-[#26DDC0]">{!login ? "Login Here" : "SignUp Here"}</Text>
                        </Pressable>
                    </Text>
                </View>
            </View>
            <StatusBar style="auto" />
        </SafeAreaView>
    )
}