// app/addProjectForm.tsx or screens/AddProjectForm.tsx

import React, { useState } from 'react'
import { View, ScrollView } from 'react-native'
import { TextInput, Button, Text, Chip } from 'react-native-paper'
import { DatePickerModal } from 'react-native-paper-dates'
import { format } from 'date-fns'

const allMembers = ['Alice', 'Bob', 'Charlie', 'David']

export default function AddProjectForm() {
    const [projectName, setProjectName] = useState('')
    const [description, setDescription] = useState('')
    const [startDate, setStartDate] = useState<Date | undefined>()
    const [endDate, setEndDate] = useState<Date | undefined>()

    const [openStart, setOpenStart] = useState(false)
    const [openEnd, setOpenEnd] = useState(false)

    const [selectedMembers, setSelectedMembers] = useState<string[]>([])

    const toggleMember = (member: string) => {
        setSelectedMembers((prev) =>
            prev.includes(member)
                ? prev.filter((m) => m !== member)
                : [...prev, member]
        )
    }

    const handleSubmit = () => {
        console.log({
            projectName,
            description,
            startDate,
            endDate,
            selectedMembers,
        })
    }

    return (
        <ScrollView contentContainerStyle={{ padding: 16, marginTop: 40 }}>
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
                {allMembers.map((member) => (
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
        </ScrollView>
    )
}
