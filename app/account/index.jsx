import { ActivityIndicator, Pressable, SafeAreaView, Text, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import { Avatar, Button, Icon, Image, Input, Snackbar } from "react-native-magnus";
import { store } from "../../libs/store";
import { supabase } from "../../libs/supabase";
import * as ImagePicker from 'expo-image-picker';
import { decode } from "base64-arraybuffer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const snackbarRef = React.createRef();

export default function Account() {
    const [reg, setReg] = useState("")
    const [phone, setPhone] = useState("")
    const [level, setLevel] = useState("")

    const [role, setRole] = useState("")
    const [email, setEmail] = useState("")

    const [image, setImage] = useState(null)

    const [loading, setLoading] = useState(false)

    const { state } = useContext(store)
    const { auth } = state

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        try {
            const role = await AsyncStorage.getItem('role')
            console.log(role)

            const email = await AsyncStorage.getItem('email')
            console.log(email)

            if (role !== null && email !== null) {
                setRole(role)
                setEmail(email)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })
        console.log(result)
        console.log(decode(result.assets[0].uri))

        if (!result.canceled) {
            setImage(result.assets[0].uri)
        }
    }

    const uploadImg = async (img) => {
        const date = Date()

        const { data: avatar, error } = await supabase.storage.from("Avatars").upload(`${date}.png`, decode(img), {
            contentType: image.mimeType ?? "image/png"
        })
        console.log(avatar)

        if(error) {
            snackbarRef.current.show(error.message, {
                duration: 5000,
                suffix: <Icon name="closecircle" color="white" fontSize="md" fontFamily="AntDesign"/>
            })

            throw error
        } else {
            await addUser(auth.user.id, `${date}.png`)
        }
    }

    const addUser = async (user_id, avatar) => {
        const data = {
            user_id,
            email,
            reg,
            role,
            phone,
            avatar,
            status: false,
            created_at: new Date()
        }

        const { error } = await supabase.from("users").upsert(data)

        if(error) {
            snackbarRef.current.show(error.message, {
                duration: 5000,
                suffix: <Icon name="closecircle" color="white" fontSize="md" fontFamily="AntDesign"/>
            })

            throw error
        } else {
            setLoading(false)
        }
    }

    const onClick = async () => {
        setLoading(true)

        try {
            if(reg == "" || phone == "" || image == null) {
                snackbarRef.current.show("Missing Data!!!", {
                    duration: 5000,
                    suffix: <Icon name="closecircle" color="white" fontSize="md" fontFamily="AntDesign"/>
                })
    
                setLoading(false)
            } else {
                await uploadImg(image)
    
                setLoading(false)
    
                if(role == "admin") {
                    router.navigate(`/admin/${auth.user.id}`)
                } else {
                    router.navigate(`/home/${auth.user.id}`)
                }
            }
        } catch (error) {
            console.log(error)

            setLoading(false)
        }
    }

    return (
        <SafeAreaView className="h-screen">
            <Snackbar ref={snackbarRef} bg="red700" color="white"></Snackbar>
            <View className="flex justify-center items-center mx-4 mt-8 mb-4">
                <Text style={{ fontFamily: "Caveat_700Bold" }} className="text-black font-black text-5xl">Esucom Go</Text>
            </View>
            <View className="flex justify-center items-center m-4">
                {!image &&
                    <View className="flex items-center justify-center m-4">
                        <Pressable onPress={pickImage}>
                            <Avatar bg="gray500" color="white" size={100}>
                                <Icon
                                    name="camera"
                                    color="white"
                                    fontSize="6xl"
                                    fontFamily="AmtDesign"
                                />
                            </Avatar>
                        </Pressable>
                    </View>
                }
                {image &&
                    <View className="flex items-center justify-center m-4">
                        <Pressable onPress={pickImage}>
                            <Image
                                h={100}
                                w={100}
                                m={10}
                                rounded="circle"
                                source={{ uri: image}}
                            />
                        </Pressable>
                    </View>
                }
            </View>
            <View className="flex justify-center items-center m-2">
                <View className="flex items-center m-4">
                    <Input
                        onChangeText={(text) => setReg(text)}
                        defaultValue={reg}
                        placeholder="Reg Number"
                        p={10}
                        focusBorderColor="#26DDC0"
                        suffix={<Icon name="user" color="gray900" fontFamily="Feather" />}
                    />
                </View>
                <View className="flex items-center m-4">
                    <Input
                        onChangeText={(text) => setLevel(text)}
                        defaultValue={level}
                        placeholder="Level"
                        p={10}
                        focusBorderColor="#26DDC0"
                        suffix={<Icon name="mail" color="gray900" fontFamily="Feather" />}
                    />
                </View>
                <View className="flex items-center m-4">
                    <Input
                        onChangeText={(text) => setPhone(text)}
                        defaultValue={phone}
                        placeholder="Phone Number"
                        p={10}
                        focusBorderColor="#26DDC0"
                        suffix={<Icon name="phone" color="gray900" fontFamily="Feather" />}
                    />
                </View>
                <View className="flex justify-center my-4 mx-8">
                    <Button onPress={onClick} bg="#26DDC0" rounded="md" block>
                        {loading && <ActivityIndicator />}
                        {!loading && <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-sm text-white">Create Account</Text>}
                    </Button>
                </View>
            </View>
            <StatusBar style="auto" />
        </SafeAreaView>
    )
}