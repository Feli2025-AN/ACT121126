
import React, { useEffect } from 'react';

import {
  View,
  ActivityIndicator,
  Alert
} from 'react-native';

import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';

export default function Logout() {

  useEffect(() => {

    const cerrarSesion = async () => {
      try {
        await signOut(auth);
      } catch (error) {
        Alert.alert('Error', 'No se pudo cerrar sesión.');
      }
    };

    cerrarSesion();

  }, []);

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <ActivityIndicator size="large" color="#D71920" />
    </View>
  );
}
