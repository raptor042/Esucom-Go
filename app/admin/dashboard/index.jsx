import { useEffect, useState } from "react";
import { Dimensions, SafeAreaView } from "react-native";
import { Snackbar } from "react-native-magnus";
import { supabase } from "../../../libs/supabase";
import { Link } from "expo-router";

const snackbarRef = React.createRef();

export default function Dashboard() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        getData()
    }, [users])

    const { width } = Dimensions.get("window")
    const height = width

    const getData = async () => {
        try {
            const { data: users, error } = await supabase.from("users").select()

            if(error) {
                snackbarRef.current.show(error.message, {
                    duration: 5000,
                    suffix: <Icon name="closecircle" color="white" fontSize="md" fontFamily="AntDesign"/>
                })
    
                throw error
            } else {
                setUsers(users)
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <SafeAreaView>
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
                        <Avatar bg="gray500" color="white" size={36}>{users.email.charAt(0).toUpperCase()}</Avatar>
                    </View>
                </View>
            </View>
            <View className="flex flex-row items-center m-4 p-2">
                <View className="basis-1/3">
                    <View className="flex items-center">
                        <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-black font-black text-3xl">Dashboard</Text>
                    </View>
                </View>
                <View className="basis-1/3"></View>
                <View className="basis-1/3">
                    <View className="flex items-center">
                        <Text style={{ fontFamily: "Poppins_700Bold" }} className="text-black font-black text-3xl">Classes</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}