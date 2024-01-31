import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../reducer/user';

export default function SigninScreen({ closeModal }) {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [isSignIn, setIsSignIn] = useState(false)

    const navigation = useNavigation()
    const dispatch = useDispatch()

    useEffect(() => {
        if (isSignIn) {
            handleSignin();
        }
    }, [isSignIn])

    const handleSignin = () => {
        setIsSignIn(false);

        console.log('Submitting:', identifier, password);

        fetch('http://192.168.1.44:3000/users/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identifier,
                password,
            }),
        })
            .then(response => {
                console.log('Full Response:', response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Response:', data);

                if (data.result) {
                    dispatch(loginUser({ identifier, token: data.token }));
                    console.log('Signin successful');
                    if (navigation) {
                        navigation.navigate('TabNavigator');
                    } else {
                        console.error('Navigation object is undefined');
                    }
                } else {
                    console.log('Signin failed:', data.error);
                }
            })
            .catch(error => {
                console.error('Error during signin:', error);
            });
    };


    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.modalContent}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.innerContainer}
                >
                    <Text style={styles.modalTitle}>Sign in</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email or Username"
                        placeholderTextColor="#999"
                        value={identifier}
                        onChangeText={setIdentifier}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#999"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => { handleSignin(); closeModal() }}>
                        <Text style={styles.buttonText}>Sign in</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={closeModal}>
                        <Text style={styles.linkText}>Cancel</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
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
    linkText: {
        marginTop: 20,
        color: '#3498db',
        marginBottom: 20,
    },
});


