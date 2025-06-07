import { TextInput, View } from 'react-native'
import { useState, useEffect, useCallback } from 'react'
import { app, db, collection, addDoc, getDocs } from '../../firebaseConfig'
import { Text, Button, Card, TouchableRipple } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { Link, useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { format } from 'date-fns'

export default function Index() {
    const router = useRouter()
    const [projects, setProjects] = useState<any[]>([])
    const fetchProjects = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'projects'))
            const data: any[] = []
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() })
            })
            setProjects(data)
        } catch (error) {
            console.error('Error fetching projects:', error)
        }
    }
    useFocusEffect(
        useCallback(() => {
            fetchProjects()
        }, [])
    )
    // @ts-ignore
    // @ts-ignore
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View className="flex-1 px-5">
                <View
                    style={{
                        flexDirection: 'row',
                        // backgroundColor: 'tomato',
                        justifyContent: 'space-between',
                        padding: 2,
                        alignItems: 'center',
                        marginTop: 30,
                        marginBottom: 20,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 30,
                            fontWeight: 'bold',
                        }}
                    >
                        Projects List
                    </Text>
                    <Link href="../addProjects" asChild>
                        <Feather name="plus" size={30} color="black" />
                    </Link>
                </View>
                {projects.map((project) => (
                    <TouchableRipple
                        key={project.id}
                        onPress={() => router.push(`/${project.id}`)}
                        rippleColor="rgba(0, 0, 0, .1)"
                        borderless={false}
                    >
                        <Card key={project.id} style={{ marginBottom: 10 }}>
                            <Card.Content>
                                <Text variant="titleLarge">
                                    {project.projectName}
                                </Text>
                                <Text variant="bodyMedium">
                                    {project.description}
                                </Text>
                                <Text variant="bodySmall">
                                    {`Project Due : ${format(project.startDate.toDate(), 'd LLLL yyyy')}`}
                                </Text>
                                {/*<Text variant="bodySmall">*/}
                                {/*    Members:{' '}*/}
                                {/*    {project.assignedTo?.join(', ') || 'None'}*/}
                                {/*</Text>*/}
                            </Card.Content>
                        </Card>
                    </TouchableRipple>
                ))}
            </View>
        </SafeAreaView>
    )
}
