
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

import { auth, db } from '../../firebase/firebaseConfig';

export default function Registro() {

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [fecha, setFecha] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cargando, setCargando] = useState(false);

  const navigation = useNavigation();

  const handleRegistro = async () => {

    if (!nombre.trim() || !correo.trim() || !contrasena) {
      Alert.alert('Atención', 'Completa los campos obligatorios.');
      return;
    }

    if (contrasena.length < 6) {
      Alert.alert('Atención', 'La contraseña debe tener mínimo 6 caracteres.');
      return;
    }

    setCargando(true);

    try {

      // Crear usuario en Firebase Authentication
      const credencial = await createUserWithEmailAndPassword(
        auth,
        correo.trim(),
        contrasena
      );

      const usuario = credencial.user;

      // Guardar información en Cloud Firestore
      await setDoc(doc(db, 'usuarios', usuario.uid), {
        uid: usuario.uid,
        nombre: nombre.trim(),
        correo: correo.trim(),
        fecha,
        telefono,
        ganados: 0,
        perdidos: 0
      });

      Alert.alert('Éxito', 'Usuario registrado correctamente');

    } catch (error) {
      Alert.alert('Error al registrarse', error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.titulo}>Crear cuenta</Text>

      <Text style={styles.subtitulo}>
        Regístrate para disfrutar Bundesliga App
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Fecha de nacimiento (AAAA-MM-DD)"
        value={fecha}
        onChangeText={setFecha}
      />

      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />

      <Button
        title={cargando ? 'Registrando...' : 'Registrarse'}
        onPress={handleRegistro}
        disabled={cargando}
        color="#D71920"
      />

      <View style={{ marginTop: 15 }}>
        <Button
          title="¿Ya tienes cuenta? Inicia sesión"
          onPress={() => navigation.navigate('Login')}
        />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#FFFFFF'
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
  },
  subtitulo: {
    fontSize: 15,
    textAlign: 'center',
    color: '#777',
    marginBottom: 25
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 13,
    borderRadius: 8,
    marginBottom: 15
  }
});
