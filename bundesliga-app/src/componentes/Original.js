
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, StyleSheet
} from 'react-native';
import {
  doc, getDoc, collection, writeBatch,
  increment, serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseConfig';
import EscudoEquipo from './EscudoEquipo';

const API = 'https://api.openligadb.de/getbltable/bl1/2025';
const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const MAX_FALLOS = 5;

const normalizar = (texto) =>
  (texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export default function Original() {
  const [equipos, setEquipos] = useState([]);
  const [equipo, setEquipo] = useState(null);
  const [elegidas, setElegidas] = useState([]);
  const [fallos, setFallos] = useState(0);
  const [terminado, setTerminado] = useState(false);
  const [victoria, setVictoria] = useState(false);
  const [ganados, setGanados] = useState(0);
  const [perdidos, setPerdidos] = useState(0);
  const [cargando, setCargando] = useState(true);
  const bloqueado = useRef(false);

  const nuevaPartida = (lista) => {
    if (!lista.length) return;

    setEquipo(lista[Math.floor(Math.random() * lista.length)]);
    setElegidas([]);
    setFallos(0);
    setTerminado(false);
    setVictoria(false);
    bloqueado.current = false;
  };

  const cargar = async () => {
    setCargando(true);

    try {
      const respuesta = await fetch(API);
      if (!respuesta.ok) throw new Error('No se pudo consultar la API');

      const datos = await respuesta.json();
      if (!Array.isArray(datos) || !datos.length) {
        throw new Error('No hay equipos disponibles');
      }

      setEquipos(datos);
      nuevaPartida(datos);

      const uid = auth.currentUser?.uid;
      if (uid) {
        const perfil = await getDoc(doc(db, 'usuarios', uid));
        if (perfil.exists()) {
          setGanados(perfil.data().ganados || 0);
          setPerdidos(perfil.data().perdidos || 0);
        }
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const finalizar = async (gano) => {
    if (bloqueado.current) return;
    bloqueado.current = true;

    setTerminado(true);
    setVictoria(gano);

    if (gano) setGanados(x => x + 1);
    else setPerdidos(x => x + 1);

    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      const lote = writeBatch(db);
      const resultadoRef = doc(collection(db, 'resultados'));

      lote.set(resultadoRef, {
        uid,
        equipo: equipo.teamName,
        aciertos: gano ? 1 : 0,
        errores: gano ? 0 : 1,
        fecha: serverTimestamp()
      });

      lote.update(doc(db, 'usuarios', uid), {
        ganados: increment(gano ? 1 : 0),
        perdidos: increment(gano ? 0 : 1)
      });

      await lote.commit();
    } catch (e) {
      Alert.alert('Error al guardar partida', e.message);
    }
  };

  const seleccionar = async (letra) => {
    if (!equipo || bloqueado.current || elegidas.includes(letra)) {
      return;
    }

    const nuevas = [...elegidas, letra];
    setElegidas(nuevas);

    const palabra = normalizar(equipo.teamName);

    if (!palabra.includes(letra)) {
      const errores = fallos + 1;
      setFallos(errores);

      if (errores >= MAX_FALLOS) await finalizar(false);
    } else {
      const completo = palabra.split('').every(
        c => c === ' ' || nuevas.includes(c)
      );

      if (completo) await finalizar(true);
    }
  };

  const palabra = normalizar(equipo?.teamName);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Adivina el equipo</Text>
      <Text style={styles.stats}>
        Ganados: {ganados} | Perdidos: {perdidos}
      </Text>

      {cargando ? (
        <ActivityIndicator size="large" color="#D71920" />
      ) : !equipo ? (
        <TouchableOpacity style={styles.boton} onPress={cargar}>
          <Text style={styles.blanco}>Reintentar</Text>
        </TouchableOpacity>
      ) : (
        <>
          <Text>¿Cuál es este club de la Bundesliga?</Text>

          
          <EscudoEquipo
            url={equipo.teamIconUrl}
            nombre={equipo.teamName}
            size={130}
            />


          <View style={styles.palabra}>
            {palabra.split('').map((c, i) => (
              <Text key={i} style={styles.letra}>
                {c === ' '
                  ? '  '
                  : elegidas.includes(c) || terminado ? c : '_'}
              </Text>
            ))}
          </View>

          <Text style={styles.stats}>
            Fallos: {fallos} / {MAX_FALLOS}
          </Text>

          <View style={styles.teclado}>
            {LETRAS.map(letra => (
              <TouchableOpacity
                key={letra}
                onPress={() => seleccionar(letra)}
                disabled={terminado || elegidas.includes(letra)}
                style={[
                  styles.tecla,
                  elegidas.includes(letra) && styles.usada
                ]}
              >
                <Text>{letra}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {terminado && (
            <>
              <Text style={styles.resultado}>
                {victoria ? '¡Ganaste!' : '¡Perdiste!'}
                {'\n'}Era: {equipo.teamName}
              </Text>

              <TouchableOpacity
                style={styles.boton}
                onPress={() => nuevaPartida(equipos)}
              >
                <Text style={styles.blanco}>Jugar otra vez</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, padding: 18,
    alignItems: 'center', backgroundColor: '#fff'
  },
  titulo: {
    fontSize: 25, fontWeight: 'bold',
    color: '#D71920', marginBottom: 10
  },
  stats: { fontSize: 16, marginVertical: 15 },
  escudo: { width: 130, height: 130, margin: 15 },
  palabra: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center', marginVertical: 20
  },
  letra: { fontSize: 21, margin: 3, fontWeight: '600' },
  teclado: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center'
  },
  tecla: {
    width: 38, height: 42, margin: 3,
    backgroundColor: '#eee', borderRadius: 8,
    alignItems: 'center', justifyContent: 'center'
  },
  usada: { backgroundColor: '#bbb' },
  resultado: {
    fontSize: 19, fontWeight: 'bold',
    textAlign: 'center', marginTop: 20
  },
  boton: {
    backgroundColor: '#D71920', borderRadius: 9,
    padding: 14, marginTop: 18
  },
  blanco: { color: '#fff', fontWeight: 'bold' }
});
