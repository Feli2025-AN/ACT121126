
import React, { useEffect, useState } from 'react';

import {
  View,
  ActivityIndicator
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';

import Home from './src/componentes/Home';
import Original from './src/componentes/Original';
import Login from './src/componentes/Login';
import Registro from './src/componentes/Registro';
import Perfil from './src/componentes/Perfil';
import Logout from './src/componentes/Logout';

const Tab = createBottomTabNavigator();

const iconos = {
  Inicio: 'soccer-field',
  Juego: 'trophy-outline',
  Perfil: 'account-circle-outline',
  Salir: 'logout',
  Login: 'login',
  Registro: 'account-plus-outline'
};

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUsuario(user);
      setCargando(false);
    });

    return unsubscribe;
  }, []);

  if (cargando) {
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

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#D71920',
          tabBarInactiveTintColor: '#777777',
          tabBarStyle: {
            height: 65,
            paddingBottom: 8,
            paddingTop: 5
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600'
          },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name={iconos[route.name] || 'soccer'}
              size={size}
              color={color}
            />
          )
        })}
      >
        {usuario ? (
          <>
            <Tab.Screen name="Inicio" component={Home} />
            <Tab.Screen name="Juego" component={Original} />
            <Tab.Screen name="Perfil" component={Perfil} />
            <Tab.Screen name="Salir" component={Logout} />
          </>
        ) : (
          <>
            <Tab.Screen name="Login" component={Login} />
            <Tab.Screen name="Registro" component={Registro} />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
