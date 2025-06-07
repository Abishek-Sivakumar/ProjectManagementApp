import { useState, useEffect, useCallback } from 'react'
import { ScrollView, View } from 'react-native'
import { Text, TextInput, Button, Chip, RadioButton } from 'react-native-paper'
import { useLocalSearchParams, router } from 'expo-router'
import { DatePickerModal } from 'react-native-paper-dates'
import { doc, getDoc, collection, addDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import { format } from 'date-fns'
import { getDocs } from '@/firebaseConfig'
import { useFocusEffect } from '@react-navigation/native'

export default function AddTask() {
    const { projectId } = useLocalSearchParams()

    const [taskName, setTaskName] = useState('')
    const [description, setDescription] = useState('')
    const [dueDate, setDueDate] = useState<Date | undefined>()
    const [openDueDate, setOpenDueDate] = useState(false)

    const [assignedTo, setAssignedTo] = useState<string | null>(null)
    const [projectMembers, setProjectMembers] = useState<string[]>([])
    const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>(
        'Medium'
    )

    useEffect(() => {
        const fetchMembers = async () => {
            const docRef = doc(db, 'projects', projectId as string)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                const data = docSnap.data()
                setProjectMembers(data.assignedTo || [])
            }
        }

        if (projectId) fetchMembers()
    }, [projectId])

    const handleSubmit = async () => {
        if (!taskName || !dueDate || !assignedTo) {
            alert('Please fill in all required fields.')
            return
        }

        await addDoc(collection(db, 'tasks'), {
            taskName,
            description,
            dueDate,
            assignedTo,
            priority,
            projectId,
            createdAt: new Date(),
        })

        router.back()
    }

    return (
        <ScrollView contentContainerStyle={{ padding: 16, marginTop: 60 }}>
            <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
                Add Task
            </Text>

            <TextInput
                label="Task Name"
                value={taskName}
                onChangeText={setTaskName}
                mode="outlined"
                style={{ marginBottom: 16 }}
            />

            <TextInput
                label="Description"
                value={description}
                onChangeText={setDescription}
                mode="outlined"
                multiline
                numberOfLines={4}
                style={{ marginBottom: 16 }}
            />

            <Text variant="labelLarge" style={{ marginBottom: 8 }}>
                Assign To
            </Text>
            <View
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginBottom: 16,
                }}
            >
                {projectMembers.map((member) => (
                    <Chip
                        key={member}
                        selected={assignedTo === member}
                        onPress={() => setAssignedTo(member)}
                        style={{ marginRight: 8, marginBottom: 8 }}
                    >
                        {member}
                    </Chip>
                ))}
            </View>

            <TextInput
                label="Due Date"
                value={dueDate ? format(dueDate, 'd LLLL yyyy') : ''}
                mode="outlined"
                onFocus={() => setOpenDueDate(true)}
                style={{ marginBottom: 16 }}
            />
            <DatePickerModal
                locale="en"
                mode="single"
                visible={openDueDate}
                onDismiss={() => setOpenDueDate(false)}
                date={dueDate}
                onConfirm={(params) => {
                    setOpenDueDate(false)
                    setDueDate(params.date)
                }}
            />

            <Text variant="labelLarge" style={{ marginBottom: 8 }}>
                Priority
            </Text>
            <RadioButton.Group
                onValueChange={(newValue) =>
                    setPriority(newValue as 'Low' | 'Medium' | 'High')
                }
                value={priority}
            >
                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                    <RadioButton.Item label="Low" value="Low" />
                    <RadioButton.Item label="Medium" value="Medium" />
                    <RadioButton.Item label="High" value="High" />
                </View>
            </RadioButton.Group>

            <Button mode="contained" onPress={handleSubmit}>
                Create Task
            </Button>
        </ScrollView>
    )
}
