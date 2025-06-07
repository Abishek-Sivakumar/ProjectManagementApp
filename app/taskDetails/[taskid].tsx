import { useLocalSearchParams, router } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView, View, Alert } from 'react-native'
import { Text, Card, Chip, useTheme, Divider, Button } from 'react-native-paper'
import {
    doc,
    getDoc,
    deleteDoc,
    updateDoc,
    increment,
} from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import { format } from 'date-fns'

export default function TaskDetail() {
    const { taskid } = useLocalSearchParams()
    const [task, setTask] = useState<any>(null)
    const theme = useTheme()

    useEffect(() => {
        const fetchTask = async () => {
            const docRef = doc(db, 'tasks', taskid as string)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                setTask({ id: docSnap.id, ...docSnap.data() })
            } else {
                console.log('No such task!')
            }
        }

        if (taskid) fetchTask()
    }, [taskid])

    const priorityColor = {
        Low: '#4CAF50',
        Medium: '#FFC107',
        High: '#f44336',
    }

    const handleMarkAsDone = async () => {
        if (!task.assignedTo) {
            Alert.alert('Error', 'This task has no assigned user.')
            return
        }

        const userRef = doc(db, 'users', task.assignedTo)

        try {
            await updateDoc(userRef, {
                tasksCompleted: increment(1),
                tasksDue: increment(-1),
                tasksPending: increment(-1),
            })

            Alert.alert('Success', 'Task marked as done and stats updated.')
            router.back()
        } catch (error) {
            console.error('Error updating user stats:', error)
            Alert.alert('Error', 'Failed to update user statistics.')
        }
    }

    const handleDelete = async () => {
        Alert.alert(
            'Delete Task',
            'Are you sure you want to delete this task?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'tasks', taskid as string))
                            router.back()
                        } catch (error) {
                            console.error('Error deleting task:', error)
                            Alert.alert('Error', 'Failed to delete task.')
                        }
                    },
                },
            ]
        )
    }

    if (!task) return <Text style={{ padding: 16 }}>Loading...</Text>

    return (
        <ScrollView contentContainerStyle={{ padding: 16, marginTop: 50 }}>
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
                    {task.taskName}
                </Text>
                <Chip
                    style={{
                        backgroundColor: priorityColor[task.priority] || '#ccc',
                    }}
                    textStyle={{ color: 'white', fontWeight: 'bold' }}
                >
                    {task.priority}
                </Chip>
            </View>

            {/* Description */}
            <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
                Description
            </Text>
            <Card style={{ marginBottom: 16 }}>
                <Card.Content>
                    <Text variant="bodyMedium">{task.description}</Text>
                </Card.Content>
            </Card>

            {/* Due Date */}
            <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
                Due Date
            </Text>
            <Card style={{ marginBottom: 16 }}>
                <Card.Content>
                    <Text>{format(task.dueDate.toDate(), 'd LLLL yyyy')}</Text>
                </Card.Content>
            </Card>

            {/* Assigned Member */}
            <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
                Assigned To
            </Text>
            <View style={{ marginBottom: 16 }}>
                <Chip>{task.assignedTo || 'Unassigned'}</Chip>
            </View>

            <Divider />

            {/* Action Buttons */}
            <View style={{ marginTop: 24, gap: 12 }}>
                <Button
                    mode="contained"
                    onPress={handleMarkAsDone}
                    style={{ backgroundColor: '#4CAF50' }} // Green background
                    textColor="#fff"
                >
                    Mark as Done
                </Button>

                <Button mode="outlined" onPress={() => router.back()}>
                    Back to Project
                </Button>
            </View>
        </ScrollView>
    )
}
