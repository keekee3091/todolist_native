import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import {
    ScrollView,
    Platform,
    Button,
    FlatList,
    TextInput,
    StyleSheet,
    Text,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    View,
    Keyboard
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function MainScreen({ navigation }) {

    const [tasks, setTasks] = useState([]);
    const [isTaskAdded, setIsTaskAdded] = useState(false)
    const [taskName, setTaskName] = useState('')
    const [taskPriority, setTaskPriority] = useState(0)
    const [taskEndDate, setTaskEndDate] = useState(new Date())
    const [taskUser, setTaskUser] = useState('')
    const [toggleTaskModal, setToggleTaskModal] = useState(false)
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [remainingTime, setRemainingTime] = useState({});

    const user = useSelector(state => state.user.value)

    const toggleDatePicker = () => {
        setShowDatePicker(!showDatePicker);
    };

    const calulateRemaningTime = (endDate) => {
        const now = new Date().getTime();
        const endTime = new Date(endDate).getTime();
        const timeDifference = endTime - now;

        if (timeDifference > 0) {
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

            return { days, hours, minutes, seconds };
        } else {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            setRemainingTime(calulateRemaningTime(taskEndDate))
        }, 1000);

        return () => {
            clearInterval(intervalId)
        }
    }, [taskEndDate])

    const handleDateChange = (event, selectedDate, taskId) => {
        const currentDate = selectedDate || new Date();
        setShowDatePicker(Platform.OS === 'ios');

        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task._id === taskId ? { ...task, taskEndDate: currentDate } : task
            )
        );
    };

    useEffect(() => {
        fetch(`http://192.168.1.44:3000/tasks/${user.token}`)
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    setTasks(data.taskdata)
                } else {
                    console.error('Failed to fetch tasks')
                }
            })
            .catch(error => {
                console.error('Error fetching tasks:', error)
            })
    }, [isTaskAdded])

    const taskAdded = () => {
        setIsTaskAdded(!isTaskAdded);
        closeModal();
    }

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
                    taskAdded()
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
                    console.log('Task deleted successfully', data);
                } else {
                    console.error('Failed to delete task:', data.message);
                }
            })
            .catch(error => {
                console.error('Error deleting task:', error);
            });
    };

    function openModal() {
        setToggleTaskModal(true)
    }

    function closeModal() {
        setToggleTaskModal(false)
    }

    const dismissKeyboard = () => {
        Keyboard.dismiss()
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TouchableWithoutFeedback onPress={dismissKeyboard}>
                    <View>
                        <Text>Main Screen</Text>
                        <Button title="Add New Task" onPress={openModal} style={styles.addButton} />

                        <FlatList
                            data={tasks}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <View style={styles.taskItem}>
                                    <Text>{item.taskName}</Text>
                                    <Text>{item.taskPriority}</Text>
                                    <Text>
                                        Remaining Time:{' '}
                                        {`${remainingTime[item._id]?.days || 0}d ${remainingTime[item._id]?.hours || 0}h ${remainingTime[item._id]?.minutes || 0
                                            }m ${remainingTime[item._id]?.seconds || 0}s`}
                                    </Text>
                                    <Text>{item.taskUser}</Text>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => deleteTask(item._id)}
                                    >
                                        <Text>Delete Task</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.input}
                                        onPress={() => toggleDatePicker(item._id)}
                                    >
                                        <Text style={{ color: '#000' }}>
                                            {item.taskEndDate.toLocaleDateString()} {item.taskEndDate.toLocaleTimeString()}
                                        </Text>
                                    </TouchableOpacity>
                                    {showDatePicker && (
                                        <DateTimePicker
                                            value={taskEndDate}
                                            mode="datetime"
                                            display="default"
                                            onChange={(event, selectedDate) =>
                                                handleDateChange(event, selectedDate, selectedTaskId)
                                            }
                                        />
                                    )}
                                </View>
                            )}
                        />

                        {/* Modal for adding new tasks */}
                        <Modal
                            visible={toggleTaskModal}
                            animationType="slide"
                            transparent={true}
                            onRequestClose={closeModal}
                        >
                            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                                <View style={styles.modalContent}>
                                    <View style={styles.innerContainer}>
                                        <Text style={styles.modalTitle}>Add New Task</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Task Name"
                                            value={taskName}
                                            onChangeText={setTaskName}
                                            placeholderTextColor="#999"
                                        />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Task Priority"
                                            value={taskPriority.toString()} // Convert taskPriority to string to display in the input
                                            onChangeText={(text) => {
                                                // Ensure that the entered value is a number before updating state
                                                const numericValue = text.replace(/[^0-9]/g, '');
                                                setTaskPriority(numericValue);
                                            }}
                                            keyboardType="numeric" // Set keyboardType to 'numeric'
                                            placeholderTextColor="#999"
                                        />
                                        <TouchableOpacity style={styles.input} onPress={toggleDatePicker}>
                                            <Text style={{ color: '#000' }}>
                                                {taskEndDate.toLocaleDateString()} {taskEndDate.toLocaleTimeString()}
                                            </Text>
                                        </TouchableOpacity>
                                        {showDatePicker && (
                                            <DateTimePicker
                                                value={taskEndDate}
                                                mode="datetime"
                                                display="default"
                                                onChange={handleDateChange}
                                            />
                                        )}
                                        <View style={styles.input}>
                                            <Text style={{ color: '#000' }}>
                                                {user.username}
                                            </Text>
                                        </View>
                                        <TouchableOpacity style={styles.button} onPress={postNewTask}>
                                            <Text style={styles.buttonText}>Add Task</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </Modal>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        marginTop: 50,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    addButton: {
        marginTop: 10,
    },
    taskItem: {
        marginBottom: 10,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
    modalContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    innerContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        marginTop: 10,
        padding: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    button: {
        backgroundColor: '#3498db',
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

