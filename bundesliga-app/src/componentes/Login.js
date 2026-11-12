
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert
} from 'react-native';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

import { auth } from '../../firebase/firebaseConfig';

export default function Login() {

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);

  const navigation = useNavigation();

  const handleLogin = async () => {

    if (!correo.trim() || !contrasena) {
      Alert.alert('Atención', 'Ingresa tu correo y contraseña.');
      return;
    }

    setCargando(true);

    try {

      await signInWithEmailAndPassword(
        auth,
        correo.trim(),
        contrasena
      );

    } catch (error) {
      Alert.alert(
        'Error al iniciar sesión',
        'Verifica tu correo y contraseña.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>Bundesliga App</Text>

      <Text style={styles.subtitulo}>
        Inicia sesión para continuar
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />

      <Button
        title={cargando ? 'Ingresando...' : 'Iniciar sesión'}
        onPress={handleLogin}
        disabled={cargando}
        color="#D71920"
      />

      <View style={{ marginTop: 20 }}>
        <Button
          title="¿No tienes cuenta? Regístrate"
          onPress={() => navigation.navigate('Registro')}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#FFFFFF'
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#D71920'
  },
  subtitulo: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
    marginBottom: 30
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 14,
    borderRadius: 8,
    marginBottom: 15
  }
});
