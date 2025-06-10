import { useLocalSearchParams, router } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { View, ScrollView, Alert, StyleSheet } from 'react-native'
import {
    Text,
    Card,
    Chip,
    Button,
    Divider,
    useTheme,
    TouchableRipple,
} from 'react-native-paper'
import { collection, doc, getDoc, getDocs, deleteDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import { format } from 'date-fns'
import { useFocusEffect } from '@react-navigation/native'

export default function ProjectDetail() {
    const { projectid } = useLocalSearchParams()
    const [project, setProject] = useState<any>(null)
    const [tasks, setTasks] = useState<any[]>([])
    const theme = useTheme()

    const fetchTasks = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'tasks'))
            const data: any[] = []
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() })
            })
            setTasks(data)
        } catch (error) {
            console.error('Error fetching tasks:', error)
        }
    }

    useEffect(() => {
        const fetchProject = async () => {
            const docRef = doc(db, 'projects', projectid as string)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                setProject({ id: docSnap.id, ...docSnap.data() })
            } else {
                console.log(
                    `No such project! fetchProject failed for id ${docSnap.id}`
                )
            }
        }

        if (projectid) fetchProject()
    }, [projectid])

    useFocusEffect(
        useCallback(() => {
            fetchTasks()
        }, [])
    )

    const handleDeleteProject = () => {
        Alert.alert(
            'Delete Project',
            'Are you sure you want to delete this project?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteDoc(
                                doc(db, 'projects', projectid as string)
                            )
                            router.back()
                        } catch (error) {
                            console.error('Error deleting project:', error)
                            Alert.alert(
                                'Error',
                                'Failed to delete the project.'
                            )
                        }
                    },
                },
            ]
        )
    }

    if (!project) return <Text style={{ padding: 16 }}>Loading...</Text>

    const priorityColor = {
        Low: '#4CAF50',
        Medium: '#FFC107',
        High: '#f44336',
    }

    const filteredTasks = tasks.filter((task) => task.projectId === projectid)

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                contentContainerStyle={{
                    padding: 16,
                    paddingBottom: 100, // Extra bottom padding to avoid being hidden behind delete button
                    marginTop: 50,
                }}
            >
                {/* Project Header */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 16,
                    }}
                >
                    <Text variant="titleLarge" style={{ flex: 1 }}>
                        {project.projectName}
                    </Text>
                    <Button
                        mode="contained"
                        onPress={() =>
                            router.push(`/addTask?projectId=${project.id}`)
                        }
                    >
                        Add Task
                    </Button>
                </View>

                {/* Description */}
                <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
                    Project Details
                </Text>
                <Card style={{ marginBottom: 16 }}>
                    <Card.Content>
                        <Text variant="bodyMedium">{project.description}</Text>
                    </Card.Content>
                </Card>

                {/* Dates */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 16,
                        gap: 8,
                    }}
                >
                    <Card style={{ flex: 1 }}>
                        <Card.Content>
                            <Text variant="labelSmall">Start Date</Text>
                            <Text>
                                {format(
                                    project.startDate.toDate(),
                                    'd LLLL yyyy'
                                )}
                            </Text>
                        </Card.Content>
                    </Card>
                    <Card style={{ flex: 1 }}>
                        <Card.Content>
                            <Text variant="labelSmall">Due Date</Text>
                            <Text>
                                {format(
                                    project.endDate.toDate(),
                                    'd LLLL yyyy'
                                )}
                            </Text>
                        </Card.Content>
                    </Card>
                </View>

                {/* Members */}
                <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
                    Assigned Members
                </Text>
                <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginBottom: 16,
                    }}
                >
                    {project.assignedTo?.length ? (
                        project.assignedTo.map((member: string) => (
                            <Chip
                                key={member}
                                style={{ marginRight: 8, marginBottom: 8 }}
                            >
                                {member}
                            </Chip>
                        ))
                    ) : (
                        <Text>None</Text>
                    )}
                </View>

                <Divider style={{ marginVertical: 8 }} />

                {/* Tasks */}
                <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
                    Tasks
                </Text>
                {filteredTasks.length === 0 ? (
                    <Text style={{ fontStyle: 'italic', marginBottom: 16 }}>
                        No tasks yet
                    </Text>
                ) : (
                    filteredTasks.map((task) => (
                        <TouchableRipple
                            key={task.id}
                            onPress={() =>
                                router.push(`/taskDetails/${task.id}`)
                            }
                            rippleColor="rgba(0, 0, 0, .1)"
                            borderless={false}
                        >
                            <Card style={{ marginBottom: 10 }}>
                                <Card.Content
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            flex: 1,
                                        }}
                                    >
                                        <Text
                                            variant="titleMedium"
                                            style={{ flex: 1 }}
                                        >
                                            {task.taskName}
                                        </Text>
                                        {task.status === 'done' && (
                                            <Chip
                                                mode="outlined"
                                                style={{
                                                    marginLeft: 8,
                                                    backgroundColor: '#C8E6C9',
                                                    marginRight: 3,
                                                }}
                                                textStyle={{
                                                    color: 'green',
                                                    fontWeight: 'bold',
                                                }}
                                                icon="check"
                                            >
                                                Done
                                            </Chip>
                                        )}
                                    </View>
                                    <Chip
                                        style={{
                                            backgroundColor:
                                                priorityColor[task.priority] ||
                                                '#ccc',
                                        }}
                                        textStyle={{
                                            color: 'white',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {task.priority}
                                    </Chip>
                                </Card.Content>
                            </Card>
                        </TouchableRipple>
                    ))
                )}
            </ScrollView>

            {/* Floating Delete Button */}
            <View style={styles.floatingDeleteContainer}>
                <Button
                    mode="contained"
                    onPress={handleDeleteProject}
                    style={styles.deleteButton}
                    textColor="#fff"
                >
                    Delete Project
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    floatingDeleteContainer: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        backgroundColor: 'transparent',
    },
    deleteButton: {
        backgroundColor: '#f44336',
        borderRadius: 8,
        paddingVertical: 6,
    },
})
