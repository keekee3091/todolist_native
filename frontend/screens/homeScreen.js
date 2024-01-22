import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    Modal,
    View
} from 'react-native';

export default function HomeScreen({ navigation }) {

    const [signUpModalVisible, setSignUpModalVisible] = useState(false)
    const [signInModalVisible, setSignInModalVisible] = useState(false)

    const toggleSignUpModal = () => {
        setSignUpModalVisible(!signUpModalVisible)
    }

    const toggleSignInModal = () => {
        setSignInModalVisible(!signInModalVisible)
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Image style={styles.image} source={require('../assets/to-do-list.jpeg')} />
            <Text style={styles.title}>Welcome to Todolist</Text>
            <TouchableOpacity onPress={toggleSignUpModal} style={styles.button} activeOpacity={0.8}>
                <Text style={styles.textButton}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleSignInModal} style={styles.button} activeOpacity={0.8}>
                <Text style={styles.textButton}>Sign In</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={signUpModalVisible}
                onRequestClose={toggleSignUpModal}
            >
                <View style={styles.modalContent}>
                    {/* Content for Signup Modal */}
                    {/* ... */}
                    <TouchableOpacity onPress={toggleSignUpModal}>
                        <Text>Close Modal</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={signInModalVisible}
                onRequestClose={toggleSignInModal}
            >
                <View style={styles.modalContent}>
                    {/* Content for Signin Modal */}
                    {/* ... */}
                    <TouchableOpacity onPress={toggleSignInModal}>
                        <Text>Close Modal</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </KeyboardAvoidingView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '50%',
    },
    title: {
        width: '80%',
        fontSize: 38,
        fontWeight: '600',
    },
    input: {
        width: '80%',
        marginTop: 25,
        borderBottomColor: '#ec6e5b',
        borderBottomWidth: 1,
        fontSize: 18,
    },
    button: {
        alignItems: 'center',
        paddingTop: 8,
        width: '80%',
        marginTop: 20,
        backgroundColor: '#ec6e5b',
        borderRadius: 10,
    },
    textButton: {
        color: '#ffffff',
        height: 30,
        fontWeight: '600',
        fontSize: 16,
    },
    modalContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});
