import { useLocalSearchParams, router } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, ScrollView } from 'react-native'
import { Text, Card, Chip, Button, Divider, useTheme } from 'react-native-paper'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import { format } from 'date-fns'

export default function ProjectDetail() {
    const { projectid } = useLocalSearchParams()
    const [project, setProject] = useState(null)
    const theme = useTheme()

    useEffect(() => {
        const fetchProject = async () => {
            const docRef = doc(db, 'projects', projectid as string)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                setProject({ id: docSnap.id, ...docSnap.data() })
            } else {
                console.log('No such project!')
            }
        }

        if (projectid) fetchProject()
    }, [projectid])

    if (!project) return <Text style={{ padding: 16 }}>Loading...</Text>

    return (
        <ScrollView contentContainerStyle={{ padding: 16, marginTop: 70 }}>
            {/* Header Row */}
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

            {/* Project Description */}
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
                            {format(project.startDate.toDate(), 'd LLLL yyyy')}
                        </Text>
                    </Card.Content>
                </Card>
                <Card style={{ flex: 1 }}>
                    <Card.Content>
                        <Text variant="labelSmall">Due Date</Text>
                        <Text>
                            {format(project.endDate.toDate(), 'd LLLL yyyy')}
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
                {project.assignedTo?.map((member: string) => (
                    <Chip
                        key={member}
                        style={{
                            marginRight: 8,
                            marginBottom: 8,
                        }}
                    >
                        {member}
                    </Chip>
                )) || <Text>None</Text>}
            </View>

            <Divider style={{ marginVertical: 8 }} />

            {/* Task Section */}
            <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
                Tasks
            </Text>

            {/* You will later render the list of tasks here */}
            <Card>
                <Card.Content>
                    <Text>No tasks yet. Add one!</Text>
                </Card.Content>
            </Card>
        </ScrollView>
    )
}
