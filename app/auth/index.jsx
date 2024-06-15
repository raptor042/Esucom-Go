import { Pressable, SafeAreaView, Text, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useState } from "react";
import { store } from "../../src/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Icon, Input, Snackbar } from "react-native-magnus";

const snackbarRef = React.createRef();

export default function Auth() {
    const [reg, setReg] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [login, setLogin] = useState(false)

    const [loading, setLoading] = useState(false)

    const { dispatch } = useContext(store)

    const authorize = () => {
        dispatch({
            type : "Authorized",
            payload : {
                auth : true
            }
        })
    }

    const onClick = async () => {
        setLoading(true)

        if(reg == "") {
            snackbarRef.current.show("Enter your registration number.", {
                duration: 5000,
                suffix: <Icon name="closecircle" color="white" fontSize="md" fontFamily="AntDesign"/>
            })

            setLoading(false)
        } else if(reg != "" && email == "") {
            snackbarRef.current.show("Enter your email address.", {
                duration: 5000,
                suffix: <Icon name="closecircle" color="white" fontSize="md" fontFamily="AntDesign"/>
            })

            setLoading(false)
        } else if(reg != "" && email != "" && password == "") {
            snackbarRef.current.show("Enter a password.", {
                duration: 5000,
                suffix: <Icon name="closecircle" color="white" fontSize="md" fontFamily="AntDesign"/>
            })

            setLoading(false)
        } else {
            await storeData("reg", reg)
            await storeData("email", email)
            await storeData("password", password)

            authorize()

            setLoading(false)

            router.navigate("/home")
        }
    }

    const storeData = async (key, value) => {
        try {
          await AsyncStorage.setItem(key, value);
        } catch (e) {
          console.log(e)
        }
    }

    return (
        <SafeAreaView>
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
                <View className="flex justify-center m-4">
                    <Button onPress={onClick} bg="#26DDC0" rounded="md" block>
                        {loading && <ActivityIndicator />}
                        {!loading && <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-sm text-white">{login ? "Login" : "Sign Up"}</Text>}
                    </Button>
                </View>
                <Snackbar ref={snackbarRef} bg="red700" color="white"></Snackbar>
                <View className="flex justify-center m-4">
                    <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-xs text-gray-500">
                        Already have an account? 
                        <Pressable onPress={() => setLogin(true)}>
                            <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-xs text-[#26DDC0]">Login Here</Text>
                        </Pressable>
                    </Text>
                </View>
            </View>
            <StatusBar style="auto" />
        </SafeAreaView>
    )
}