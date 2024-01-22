import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function SigninScreen({ navigation }) {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');

    const handleSignin = () => {

    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Signin Screen</Text>
            <TextInput
                style={styles.input}
                placeholder="Email or Username"
                value={identifier}
                onChangeText={setIdentifier}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleSignin}>
                <Text style={styles.buttonText}>Signin</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: '80%',
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
    },
});


