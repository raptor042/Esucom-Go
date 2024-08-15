import React, { useEffect, useState } from "react";
import { Dimensions, SafeAreaView, Pressable, View, Text, ScrollView } from "react-native";
import { Avatar, Button, Icon, Image, Snackbar } from "react-native-magnus";
import { supabase } from "../../../libs/supabase";
import { Link, router, useLocalSearchParams } from "expo-router";

const snackbarRef = React.createRef();

export default function Profile() {
    const [user, setUser] = useState({ role: "", reg: "" })

    const [image, setImage] = useState(null)

    useEffect(() => {
        getData()
    }, [])

    const { width } = Dimensions.get("window")
    const height = width

    const { id } = useLocalSearchParams()

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
            uploadImg(result.assets[0].uri)
        }
    }

    const getData = async () => {
        try {
            const { data: user, error } = await supabase.from("users").select().eq("user_id", id)
            console.log(user)

            setImage(user.avatar)

            if(error) {
                snackbarRef.current.show(error.message, {
                    duration: 5000,
                    suffix: <Icon name="closecircle" color="white" fontSize="md" fontFamily="AntDesign"/>
                })
    
                throw error
            }

            if(user.length > 0) {
                setUser(user[0])
            } else {
                router.push("/account")
            }
        } catch (e) {
            console.log(e)
        }
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()

        if(error) {
            snackbarRef.current.show(error.message, {
                duration: 5000,
                suffix: <Icon name="closecircle" color="white" fontSize="md" fontFamily="AntDesign"/>
            })

            throw error
        } else {
            router.push(`/auth/${user.role}`)
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
            await updateUserAvatar(`${date}.png`)
        }
    }

    const updateUserAvatar = async (avatar) => {
        const { error } = await supabase.from("users").update({ avatar: `https://hygdceqkiqsrkubfdydw.supabase.co/storage/v1/object/public/Avatars/${avatar}` }).eq({ user_id: id })

        if(error) {
            snackbarRef.current.show(error.message, {
                duration: 5000,
                suffix: <Icon name="closecircle" color="white" fontSize="md" fontFamily="AntDesign"/>
            })

            throw error
        }
    }

    return (
        <View>
            <Snackbar ref={snackbarRef} bg="red700" color="white"></Snackbar>
            <View className="bg-[#26DDC0] p-2 pt-10">
                <View className="flex flex-row items-center p-2">
                    <View className="basis-1/3">
                        <View className="flex items-start">
                            <Pressable onPress={() => router.back()}>
                                <Icon
                                    name="chevron-left"
                                    color="white"
                                    fontSize="5xl"
                                    fontFamily="Entypo"
                                />
                            </Pressable>
                        </View>
                    </View>
                    <View className="basis-1/3">
                        <Text style={{ fontFamily: "Caveat_700Bold" }} className="text-white font-bold text-3xl text-center m-2">{user.role.toUpperCase()}</Text>
                    </View>
                    <View className="basis-1/3">
                        <View className="flex items-end">
                            <Icon
                                name="bell"
                                color="white"
                                fontSize="5xl"
                                fontFamily="Entypo"
                            />
                        </View>
                    </View>
                </View>
                <View className="flex justify-center items-center m-1 p-2">
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
                    <View className="m-1">
                        <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-white font-bold text-lg text-center m-2">Nwoye Chiemezie Benjamin</Text>
                        <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-white font-bold text-lg text-center m-2">{user.reg}</Text>
                    </View>
                </View>
            </View>
            <View className="border-2 border-[#26DDC0] rounded-lg mt-8 mx-4 p-4">
                <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-md text-gray-500 font-bold m-2">
                    Dept: <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-md text-black font-black">Medicine and Surgery</Text>
                </Text>
                <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-md text-gray-500 font-bold m-2">
                    Class: <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-md text-black font-black">C2A</Text>
                </Text>
                <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-md text-gray-500 font-bold m-2">
                    Contact: <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-md text-black font-black">08089672675</Text>
                </Text>
                <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-md text-gray-500 font-bold m-2">
                    ESUMSA Fee: <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-md text-[#26DDC0] font-black">Cleared</Text>
                </Text>
                <View className="flex justify-center m-4">
                    <Button onPress={signOut} bg="#26DDC0" rounded="md" block>
                        <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-sm text-white">LogOut</Text>
                    </Button>
                </View>
            </View>
        </View>
    )
}