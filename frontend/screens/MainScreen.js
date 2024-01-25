import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    View,
    Keyboard
} from 'react-native';

export default function MainScreen({ navigation }) {

    const [tasks, setTasks] = useState([]);
    const [isTaskAdded, setIsTaskAdded] = useState(false)
    const [taskName, setTaskName] = useState('')
    const [taskPriority, setTaskPriority] = useState(0)
    const [taskEndDate, setTaskEndDate] = useState(new Date())
    const [taskUser, setTaskUser] = useState('')
    const [toggleTaskModal, setToggleTaskModal] = useState(false)

    const user = useSelector(state => state.user.value)

    useEffect(() => {
        fetch(`http://192.168.1.44:3000/tasks/${user.token}`)
            .then(response => response.json())
            .then(data => {
                if (data.tasks) {
                    setTasks(data.tasks)
                } else {
                    console.error('Failed to fetch tasks')
                }
            })
            .catch(error => {
                console.error('Error fetching tasks:', error)
            })
    }, [isTaskAdded])


    const postNewTask = () => {
        fetch('http://192.168.1.44:3000/tasks/newTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                taskName,
                taskPriority,
                taskEndDate,
                taskUser,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    console.log(data.result, 'Task posted')
                } else {
                    console.error('Task failed:', data.error)
                }
            })
            .catch(error => {
                console.error('Error uploading task:', error)
            })
    };

    const deleteTask = (taskId) => {
        fetch(`http://192.168.1.44:3000/tasks/${taskId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Task deleted successfully') {
                    console.log('Task deleted successfully');
                } else {
                    console.error('Failed to delete task:', data.message);
                }
            })
            .catch(error => {
                console.error('Error deleting task:', error);
            });
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss()
    };

    return (
        <View>
            <Text>Main Screen</Text>
            <Button title="Add New Task" onPress={navigateToAddTaskScreen} />

            <FlatList
                data={tasks}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.taskName}</Text>
                        <Text>{item.taskPriority}</Text>
                        <Text>{item.taskEndDate}</Text>
                        <Text>{item.taskUser}</Text>
                        <Button title="Delete Task" onPress={() => deleteTask(item._id)} />
                    </View>
                )}
            />
        </View>
    );

}