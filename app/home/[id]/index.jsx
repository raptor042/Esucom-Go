import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { StatusBar } from "expo-status-bar";
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Avatar, Button, Icon, Image, Modal, Snackbar } from 'react-native-magnus';
import axios from "axios";
import { Link, router, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../../libs/supabase';

const snackbarRef = React.createRef();

const redirectUrl = Linking.createURL();

const content = [
    {
        heading: "Secure Payment",
        body: "Make payments for your ESUMSA levy, hostel fee, school fees and some much more from the comfort of your room, Stress free.",
        uri: "https://img.freepik.com/free-vector/account-concept-illustration_114360-399.jpg?t=st=1718310843~exp=1718314443~hmac=4302ba13b202998f68fb6fc60d3104f166e119352f181b414145ce762c6de8e1&w=740"
    },
    {
        heading: "Portal",
        body: "Have a portal access to the ESUT website getting your results and reciepts from the comfort of your room, Stress free.",
        uri: "https://img.freepik.com/free-vector/login-concept-illustration_114360-739.jpg?t=st=1718322451~exp=1718326051~hmac=32e704f20bd6b81c900fbedf248a0c1cd6748d415dbdb4223abcec461f3cc4a2&w=740"
    }
]

export default function App() {
    const [active, setActive] = useState(0)

    const [user, setUser] = useState({ email: "" })

    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(false)

    const [uri, setURI] = useState("")

    const { id } = useLocalSearchParams()

    useEffect(() => {
        getData()
    }, [])

    const { width } = Dimensions.get("window")
    const height = width

    const getData = async () => {
        try {
            const { data: users, error } = await supabase.from("users").select().eq("user_id", id)
            console.log(users)

            if(error) {
                snackbarRef.current.show(error.message, {
                    duration: 5000,
                    suffix: <Icon name="closecircle" color="white" fontSize="md" fontFamily="AntDesign"/>
                })
    
                throw error
            } else {
                setUser(users[0])
            }
        } catch (e) {
            console.log(e)
        }
    }

    const change = ({ nativeEvent }) => {
        const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width)

        if(slide !== active) {
            setActive(slide)
        }
    }

    const onClick = async () => {
        const info = {
            currency: "NGN",
            amount: 2000,
            email: email,
            redirect_url: redirectUrl
        }
        console.log(info)

        setLoading(true)

        try {
            const response = await axios.post("https://flw-payment-gateway.onrender.com/init", info, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            })
            const data = response.data
            console.log(data)

            setLoading(false)
            setVisible(true)

            setURI(data.uri)

            // const res = await axios.get("https://flw-payment-gateway.onrender.com/banks/ng")
            // console.log(res.data)
        } catch (error) {
            console.log(error)

            setLoading(false)

            snackbarRef.current.show("An error has occured.", {
                duration: 5000,
                suffix: <Icon name="closecircle" color="yellow" fontSize="md" fontFamily="AntDesign"/>
            })
        }
    }

    const onBrowse = async () => {
        try {
            const browser = await WebBrowser.openBrowserAsync(uri)
            console.log(browser)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <SafeAreaView>
            <Snackbar ref={snackbarRef} bg="black" color="white"></Snackbar>
            <Modal isVisible={visible}>
                <View className="flex justify-center h-full">
                    <View className="">
                        <Image
                            h={height}
                            w={width}
                            source={{ uri: "https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-135.jpg?t=st=1718388137~exp=1718391737~hmac=5dc7b16fd88adf7935e052b333ef5fccdbd819dfc07aeb579ccc6bb238275486&w=740" }}
                        />
                    </View>
                    <View className="flex items-center mb-8">
                        <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-xl text-black">
                            Your payment link is ready 🎉
                        </Text>
                    </View>
                    <View className="m-4">
                        <Button onPress={onBrowse} bg="#26DDC0" rounded="md" block>
                            <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-md font-bold text-white">Pay  &#8358;2,000.00</Text>
                        </Button>
                    </View>
                </View>
                <Button
                    bg="gray400"
                    h={35}
                    w={35}
                    position="absolute"
                    top={50}
                    right={15}
                    rounded="circle"
                    onPress={() => {setVisible(false)}}
                >
                    <Icon color="black900" name="close" />
                </Button>
            </Modal>
            <View className="flex flex-row items-center m-4 p-2">
                <View className="basis-1/2">
                    <View className="flex items-start">
                        <Text style={{ fontFamily: "Caveat_700Bold" }} className="text-black font-black text-3xl">Esucom Go</Text>
                    </View>
                </View>
                <View className="basis-1/4"></View>
                <View className="basis-1/4">
                    <View className="flex items-end">
                        <Pressable onPress={() => router.push(`/profile/${id}`)}>
                            <Avatar bg="gray500" color="white" size={36}>{user.email.charAt(0).toUpperCase()}</Avatar>
                        </Pressable>
                    </View>
                </View>
            </View>
            <View className="m-2">
                <Button onPress={onClick} bg="#26DDC0" rounded="md" block>
                    {loading && <ActivityIndicator />}
                    {!loading && <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-sm font-bold text-white">Make Payment</Text>}
                </Button>
            </View>
            <View className="">
                <ScrollView 
                    pagingEnabled
                    horizontal
                    onScroll={change}
                    showsHorizontalScrollIndicator={false}
                    style={{ width, height }}
                >
                    {content.map((data, index) => (
                        <Image
                            key={index}
                            h={height}
                            w={width}
                            source={{ uri: data.uri }}
                        />
                    ))}
                </ScrollView>
                <View className="flex flex-row self-center">
                    {content.map((data, k) => (
                        <Text key={k} style={{ fontFamily: "Poppins_700Bold" }} className={k == active ? "text-[#888] font-black my-2 mx-3 p-2 text-2xl" : "hidden"}>
                            {data.heading}
                        </Text>
                    ))}
                </View>
                <View className="flex flex-row self-center">
                    {content.map((data, k) => (
                        <Text key={k} style={{ fontFamily: "Poppins_700Bold" }} className={k == active ? "text-[#888] my-2 mx-3 p-2 text-sm" : "hidden"}>
                            {data.body}
                        </Text>
                    ))}
                </View>
                <View className="flex flex-row self-center">
                    {content.map((i, k) => (
                        <Text key={k} style={{ fontFamily: "Poppins_700Bold" }} className={k == active ? "text-[#26DDC0] font-black my-4 mx-1 text-3xl" : "text-[#888] font-black my-4 mx-1 text-3xl"}>
                            .
                        </Text>
                    ))}
                </View>
            </View>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}
