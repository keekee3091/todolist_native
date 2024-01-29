import React, { useState } from 'react';
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
import SigninScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';

export default function HomeScreen() {

    const [signUpModalVisible, setSignUpModalVisible] = useState(false)
    const [signInModalVisible, setSignInModalVisible] = useState(false)

    const toggleSignUpModal = () => {
        setSignUpModalVisible(!signUpModalVisible)
    }

    const toggleSignInModal = () => {
        setSignInModalVisible(!signInModalVisible)
    }

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.container}>
                <KeyboardAvoidingView style={styles.innerContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
                        visible={signUpModalVisible}
                        onRequestClose={toggleSignUpModal}
                    >
                        <SignUpScreen closeModal={toggleSignUpModal} />
                    </Modal>

                    <Modal
                        animationType="slide"
                        visible={signInModalVisible}
                        onRequestClose={toggleSignInModal}
                    >
                        <SigninScreen closeModal={toggleSignInModal} />
                    </Modal>
                </KeyboardAvoidingView >
            </View>
        </TouchableWithoutFeedback>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    innerContainer: {
        flex: 1,
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
    modalTitle: {
        fontSize: 24,
        color: '#ffffff',
        marginBottom: 20,
    },
});
