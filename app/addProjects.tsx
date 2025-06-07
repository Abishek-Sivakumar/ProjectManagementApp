// app/addProjectForm.tsx or screens/AddProjectForm.tsx

import React, { useState, useEffect } from 'react'
import { View, ScrollView } from 'react-native'
import {
    Modal,
    Portal,
    TextInput,
    Button,
    Text,
    Chip,
} from 'react-native-paper'
import { DatePickerModal } from 'react-native-paper-dates'
import { format } from 'date-fns'
import {
    app,
    db,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    doc,
    updateDoc,
} from '../firebaseConfig'
import { useRouter } from 'expo-router'

export default function AddProjectForm() {
    const [members, setMembers] = useState([])
    const [projectName, setProjectName] = useState('')
    const [description, setDescription] = useState('')
    const [startDate, setStartDate] = useState<Date | undefined>()
    const [endDate, setEndDate] = useState<Date | undefined>()

    const [openStart, setOpenStart] = useState(false)
    const [openEnd, setOpenEnd] = useState(false)

    const [selectedMembers, setSelectedMembers] = useState<string[]>([])
    const [visible, setVisible] = useState(false)
    const [modalMessage, setModalMessage] = useState('')
    const router = useRouter()

    const loadMembers = async () => {
        const querySnapshot = await getDocs(collection(db, 'users'))
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`)
            // @ts-ignore
            console.log(doc.data().name)
            setMembers([...members, doc.data().email])
        })
    }
    useEffect(() => {
        loadMembers()
    }, [])

    const toggleMember = (member: string) => {
        setSelectedMembers((prev) =>
            prev.includes(member)
                ? prev.filter((m) => m !== member)
                : [...prev, member]
        )
    }

    const handleSubmit = async () => {
        try {
            // Create the project document
            await addDoc(collection(db, 'projects'), {
                projectName,
                description,
                startDate,
                endDate,
                assignedTo: selectedMembers,
            })

            // Update project count for each member
            for (const email of selectedMembers) {
                const userQuery = query(
                    collection(db, 'users'),
                    where('email', '==', email)
                )
                const snapshot = await getDocs(userQuery)

                snapshot.forEach(async (userDoc) => {
                    const userRef = doc(db, 'users', userDoc.id)
                    const currentCount = userDoc.data().projectsCount || 0

                    await updateDoc(userRef, {
                        projectsCount: currentCount + 1,
                    })
                })
            }
            const success = true
            setModalMessage('Project Added Successfully.')
            setVisible(true)
            console.log('Project created and users updated.')
        } catch (error) {
            setModalMessage('Unable to add project')
            setVisible(true)
            console.error('Error submitting project:', error)
        }
    }

    return (
        <ScrollView contentContainerStyle={{ padding: 16, marginTop: 70 }}>
            <Text variant="headlineMedium">Create Project</Text>

            <TextInput
                label="Project Name"
                value={projectName}
                onChangeText={setProjectName}
                mode="outlined"
                style={{ marginTop: 16 }}
            />

            <TextInput
                label="Description"
                value={description}
                onChangeText={setDescription}
                mode="outlined"
                multiline
                numberOfLines={4}
                style={{ marginTop: 16 }}
            />

            <TextInput
                label="Start Date"
                value={startDate ? format(startDate, 'PPP') : ''}
                mode="outlined"
                style={{ marginTop: 16 }}
                onFocus={() => setOpenStart(true)}
            />
            <DatePickerModal
                locale="en"
                mode="single"
                visible={openStart}
                onDismiss={() => setOpenStart(false)}
                date={startDate}
                onConfirm={(params) => {
                    setOpenStart(false)
                    setStartDate(params.date)
                }}
            />

            <TextInput
                label="End Date"
                value={endDate ? format(endDate, 'PPP') : ''}
                mode="outlined"
                style={{ marginTop: 16 }}
                onFocus={() => setOpenEnd(true)}
            />
            <DatePickerModal
                locale="en"
                mode="single"
                visible={openEnd}
                onDismiss={() => setOpenEnd(false)}
                date={endDate}
                onConfirm={(params) => {
                    setOpenEnd(false)
                    setEndDate(params.date)
                }}
            />

            <Text style={{ marginTop: 16, marginBottom: 8 }}>
                Assign Members
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {members.map((member) => (
                    <Chip
                        key={member}
                        selected={selectedMembers.includes(member)}
                        onPress={() => toggleMember(member)}
                        style={{ marginRight: 8, marginBottom: 8 }}
                    >
                        {member}
                    </Chip>
                ))}
            </View>

            <Button
                mode="contained"
                onPress={handleSubmit}
                style={{ marginTop: 24 }}
            >
                Create Project
            </Button>
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    contentContainerStyle={{
                        backgroundColor: 'white',
                        padding: 20,
                        margin: 20,
                        borderRadius: 10,
                    }}
                >
                    <Text>{modalMessage}</Text>
                    <Button
                        onPress={() => {
                            setVisible(false)
                            router.back() // or router.push('/home') if you want to go to a specific screen
                        }}
                    >
                        OK
                    </Button>
                </Modal>
            </Portal>
        </ScrollView>
    )
}
