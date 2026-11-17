
import React, { useCallback } from 'react';

import {
  View,
  Text,
  Alert,
  StyleSheet
} from 'react-native';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';

export default function Logout() {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      Alert.alert(
        'Cerrar sesión',
        '¿Estás seguro de que deseas salir?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => {
              navigation.navigate('Inicio');
            }
          },
          {
            text: 'Sí, cerrar sesión',
            style: 'destructive',
            onPress: async () => {
              try {
                await signOut(auth);
              } catch (error) {
                Alert.alert(
                  'Error',
                  'No se pudo cerrar sesión.'
                );
                navigation.navigate('Inicio');
              }
            }
          }
        ],
        { cancelable: false }
      );
    }, [navigation])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.texto}>
        Administración de sesión
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  texto: {
    fontSize: 17,
    color: '#777'
  }
});
