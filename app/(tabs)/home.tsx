import { useEffect, useState, useCallback } from 'react'
import { SafeAreaView, View, StyleSheet } from 'react-native'
import { Text, Card, TouchableRipple } from 'react-native-paper'
import { Feather } from '@expo/vector-icons'
import { format } from 'date-fns'
import { Link, useRouter } from 'expo-router'
import { collection, getDocs, db } from '../../firebaseConfig'
import { useFocusEffect } from '@react-navigation/native'

export default function HomeScreen() {
    const router = useRouter()
    const [projects, setProjects] = useState<any[]>([])

    const fetchProjects = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'projects'))
            const list: any[] = []
            querySnapshot.forEach((doc) =>
                list.push({ id: doc.id, ...doc.data() })
            )
            setProjects(list)
        } catch (error) {
            console.error('Error fetching projects:', error)
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchProjects()
        }, [])
    )

    return (
        <SafeAreaView style={{ flex: 1, marginTop: 50 }}>
            <View style={{ padding: 20 }}>
                <View style={styles.header}>
                    <Text variant="titleLarge">Projects List</Text>
                    <Link href="/addProjects" asChild>
                        <Feather name="plus" size={30} color="black" />
                    </Link>
                </View>

                {projects.map((project) => (
                    <TouchableRipple
                        key={project.id}
                        onPress={() => router.push(`/${project.id}`)}
                        rippleColor="rgba(0, 0, 0, .1)"
                    >
                        <Card style={{ marginBottom: 10 }}>
                            <Card.Content>
                                <Text variant="titleLarge">
                                    {project.projectName}
                                </Text>
                                <Text>{project.description}</Text>
                                <Text variant="bodySmall">
                                    Project Due:{' '}
                                    {format(
                                        project.startDate.toDate(),
                                        'd LLLL yyyy'
                                    )}
                                </Text>
                            </Card.Content>
                        </Card>
                    </TouchableRipple>
                ))}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
})
