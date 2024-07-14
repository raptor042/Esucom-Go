import React, { useEffect, useState } from "react";
import { Dimensions, SafeAreaView, Pressable, View, Text, ScrollView } from "react-native";
import { Button, Icon, Image, Snackbar } from "react-native-magnus";
import { supabase } from "../../../libs/supabase";
import { Link, router, useLocalSearchParams } from "expo-router";

const snackbarRef = React.createRef();

export default function Profile() {
    const [user, setUser] = useState({ role: "", reg: "" })

    useEffect(() => {
        getData()
    }, [])

    const { width } = Dimensions.get("window")
    const height = width

    const { id } = useLocalSearchParams()

    const getData = async () => {
        try {
            const { data: user, error } = await supabase.from("users").select().eq("user_id", id)
            console.log(user)

            if(error) {
                snackbarRef.current.show(error.message, {
                    duration: 5000,
                    suffix: <Icon name="closecircle" color="white" fontSize="md" fontFamily="AntDesign"/>
                })
    
                throw error
            } else {
                setUser(user[0])
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
                    <View className="m-1">
                        <Image
                            h={100}
                            w={100}
                            m={10}
                            rounded="circle"
                            source={{
                                uri:
                                "https://images.unsplash.com/photo-1593642532400-2682810df593?ixid=MXwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
                            }}
                        />
                    </View>
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