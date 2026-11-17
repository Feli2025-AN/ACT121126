
import React, { useCallback, useState } from 'react';
import {
  View, Text, TextInput, Button,
  Alert, StyleSheet, ScrollView, ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseConfig';

export default function Perfil() {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [ganados, setGanados] = useState(0);
  const [perdidos, setPerdidos] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useFocusEffect(useCallback(() => {
    let activo = true;

    const cargar = async () => {
      setCargando(true);
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error('Sesión no disponible');

        const resultado = await getDoc(doc(db, 'usuarios', uid));
        if (!resultado.exists()) {
          throw new Error('Perfil no encontrado');
        }

        const datos = resultado.data();
        if (activo) {
          setNombre(datos.nombre || '');
          setFecha(datos.fecha || '');
          setTelefono(datos.telefono || '');
          setCorreo(datos.correo || '');
          setGanados(datos.ganados || 0);
          setPerdidos(datos.perdidos || 0);
        }
      } catch (e) {
        if (activo) Alert.alert('Error', e.message);
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargar();
    return () => { activo = false; };
  }, []));

  const guardar = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || guardando) return;
    if (!nombre.trim()) {
      Alert.alert('Atención', 'Ingresa un nombre');
      return;
    }

    setGuardando(true);
    try {
      await updateDoc(doc(db, 'usuarios', uid), {
        nombre: nombre.trim(),
        fecha: fecha.trim(),
        telefono: telefono.trim()
      });
      Alert.alert('Éxito', 'Datos actualizados');
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Mi perfil</Text>

      <Text style={styles.label}>Correo</Text>
      <Text style={styles.correo}>{correo}</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.label}>Fecha de nacimiento</Text>
      <TextInput
        style={styles.input}
        value={fecha}
        onChangeText={setFecha}
        placeholder="AAAA-MM-DD"
      />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />

      <View style={styles.stats}>
        <Text>Ganados: {ganados}</Text>
        <Text>Perdidos: {perdidos}</Text>
      </View>

      <Button
        title={guardando ? 'Guardando...' : 'Guardar cambios'}
        color="#D71920"
        disabled={guardando}
        onPress={guardar}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  titulo: {
    fontSize: 27, fontWeight: 'bold',
    color: '#D71920', marginBottom: 20
  },
  label: { fontWeight: '600', marginBottom: 6 },
  correo: { color: '#666', marginBottom: 18 },
  input: {
    borderWidth: 1, borderColor: '#ccc',
    borderRadius: 9, padding: 12, marginBottom: 16
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#eee',
    padding: 18, borderRadius: 10, marginBottom: 20
  }
});
