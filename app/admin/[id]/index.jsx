import React, { useEffect, useState } from "react";
import { Dimensions, SafeAreaView, Pressable, View, Text, ScrollView } from "react-native";
import { Avatar, Button, Snackbar } from "react-native-magnus";
import { supabase } from "../../../libs/supabase";
import { Link, useLocalSearchParams } from "expo-router";
import { VictoryChart, VictoryLine, VictoryPie, VictoryTheme } from "victory-native";

const snackbarRef = React.createRef();

const classes = [
    {
        class: "PC1",
        rep: "Kingsley Kalu",
        contact: "08082456341"
    },
    {
        class: "PC2",
        rep: "Ogochukwu Cherry",
        contact: "09067213456"
    },
    {
        class: "C1",
        rep: "Eze Stephen",
        contact: "0807634512"
    },
    {
        class: "C2B",
        rep: "Nnnedi Vivian",
        contact: "07012452378"
    },
    {
        class: "C2A",
        rep: "Nwoye Benjamin",
        contact: "08089672675"
    },
    {
        class: "C3",
        rep: "Ojukwu Nelson",
        contact: "08045342145"
    }
]

export default function Dashboard() {
    const [user, setUser] = useState({ email: "" })

    const [dashboard, setDashboard] = useState(true)
    const [weekly, setWeekly] = useState(true)
    const [list, setList] = useState(false)


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

    return (
        <SafeAreaView>
            <ScrollView>
                <Snackbar ref={snackbarRef} bg="red700" color="white"></Snackbar>
                <View className="flex flex-row items-center m-4 p-2">
                    <View className="basis-1/2">
                        <View className="flex items-start">
                            <Text style={{ fontFamily: "Caveat_700Bold" }} className="text-black font-black text-3xl">Esucom Go</Text>
                        </View>
                    </View>
                    <View className="basis-1/4"></View>
                    <View className="basis-1/4">
                        <View className="flex items-end">
                            <Avatar bg="gray500" color="white" size={36}>{user.email.charAt(0).toUpperCase()}</Avatar>
                        </View>
                    </View>
                </View>
                <View className="flex flex-row items-center m-4 p-2">
                    <View className="basis-1/3">
                        <View className={dashboard ? "border-b-2 border-b-[#26DDC0] flex items-center" : "flex items-center"}>
                            <Pressable onPress={() => setDashboard(true)}>
                                <Text style={{ fontFamily: "Poppins_700Bold" }} className={dashboard ? "text-[#26DDC0] font-bold text-lg" : "text-gray-500 font-bold text-lg"}>Dashboard</Text>
                            </Pressable>
                        </View>
                    </View>
                    <View className="basis-1/3"></View>
                    <View className="basis-1/3">
                        <View className={!dashboard ? "border-b-2 border-b-[#26DDC0] flex items-center" : "flex items-center"}>
                            <Pressable onPress={() => setDashboard(false)}>
                                <Text style={{ fontFamily: "Poppins_700Bold" }} className={!dashboard ? "text-[#26DDC0] font-bold text-lg" : "text-gray-500 font-bold text-lg"}>Classes</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
                {dashboard &&
                    <>
                        <View className="border-2 border-[#26DDC0] rounded-lg my-4 mx-2 p-2">
                            <View className="flex flex-row items-center m-2">
                                <View className="basis-1/3">
                                    <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-gray-500 font-bold text-lg">Funds</Text>
                                </View>
                                <View className="basis-1/3"></View>
                                <View className="basis-1/3">
                                    <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-black font-bold text-lg">&#8358;2,000,000</Text>
                                </View>
                            </View>
                            <View className="flex flex-row justify-center items-center my-2">
                                <VictoryPie
                                    animate
                                    colorScale={["#26DDC0", "#40E4AC", "#5BEB9F", "#77F09A", "#94F59D", "#B8F9B2"]}
                                    data={[
                                        {x: "PC1", y: 20},
                                        {x: "PC2", y: 20},
                                        {x: "C1", y: 20},
                                        {x: "C2B", y: 20},
                                        {x: "C2A", y: 10},
                                        {x: "C3", y: 10},
                                    ]}
                                />
                            </View>
                        </View>
                        <View className="my-4 mx-2 p-2">
                            <View className="flex flex-row items-center m-2">
                                <View className="basis-1/3">
                                    <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-black font-bold text-lg">Progress</Text>
                                </View>
                                <View className="basis-1/3">
                                    <View className={weekly ? "border-b-2 border-b-[#26DDC0] flex items-center" : "flex items-center"}>
                                        <Pressable onPress={() => setWeekly(true)}>
                                            <Text style={{ fontFamily: "Poppins_700Bold" }} className={weekly ? "text-[#26DDC0] font-bold text-md" : "text-gray-500 font-bold text-md"}>Weekly</Text>
                                        </Pressable>
                                    </View>
                                </View>
                                <View className="basis-1/3">
                                    <View className={!weekly ? "border-b-2 border-b-[#26DDC0] flex items-center" : "flex items-center"}>
                                        <Pressable onPress={() => setWeekly(false)}>
                                            <Text style={{ fontFamily: "Poppins_700Bold" }} className={!weekly ? "text-[#26DDC0] font-bold text-md" : "text-gray-500 font-bold text-md"}>Monthly</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                            <View className="flex flex-row justify-center items-center my-2">
                                <VictoryChart theme={VictoryTheme.material}>
                                    <VictoryLine
                                        style={{
                                            data: { stroke: "#26DDC0" },
                                            parent: { border: "1px solid #ccc"}
                                        }}
                                        data={[
                                            { x: 1, y: 2 },
                                            { x: 2, y: 3 },
                                            { x: 3, y: 5 },
                                            { x: 4, y: 4 },
                                            { x: 5, y: 7 }
                                        ]}
                                    />
                                </VictoryChart>
                            </View>
                        </View>
                    </>
                }
                {!dashboard &&
                    classes.map((clas, i) => (
                        <View key={i} className="border-2 border-[#26DDC0] rounded-lg m-4 p-2">
                            <View className="flex justify-center m-4">
                                <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-xl text-black font-black">{clas.class}</Text>
                            </View>
                            <View className="flex justify-center m-4">
                                <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-md text-gray-500 font-bold">
                                    Course Rep: <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-md text-black font-black">{clas.rep}</Text>
                                </Text>
                            </View>
                            <View className="flex justify-center m-4">
                                <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-md text-gray-500 font-bold">
                                    Contact: <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-md text-black font-black">{clas.contact}</Text>
                                </Text>
                            </View>
                            <View className="flex justify-center m-4">
                                <Button onPress={() => setList(true)} bg="#26DDC0" rounded="md" block>
                                    <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-sm text-white">View Class List</Text>
                                </Button>
                            </View>
                        </View>
                    ))
                }
            </ScrollView>
        </SafeAreaView>
    )
}