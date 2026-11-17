
import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, FlatList, StyleSheet,
  ActivityIndicator, Button
} from 'react-native';
import EscudoEquipo from './EscudoEquipo';

const API = 'https://api.openligadb.de/getbltable/bl1/2025';

export default function Home() {
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const respuesta = await fetch(API);
      if (!respuesta.ok) throw new Error('Error al consultar API');
      const datos = await respuesta.json();
      if (!Array.isArray(datos)) throw new Error('Datos no válidos');
      setEquipos(datos);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Bundesliga</Text>
      <Text style={styles.subtitulo}>Temporada 2025/2026</Text>

      {cargando ? (
        <ActivityIndicator size="large" color="#D71920" />
      ) : error ? (
        <View>
          <Text>{error}</Text>
          <Button title="Reintentar" onPress={cargar} />
        </View>
      ) : (
        <FlatList
          data={equipos}
          keyExtractor={(item, i) => String(item.teamInfoId ?? i)}
          ListHeaderComponent={
            <View style={styles.fila}>
              <Text style={styles.equipo}>Equipo</Text>
              <Text style={styles.numero}>PJ</Text>
              <Text style={styles.numero}>DG</Text>
              <Text style={styles.numero}>PTS</Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <View style={styles.fila}>
              <Text style={styles.posicion}>{index + 1}</Text>
              <EscudoEquipo
                url={item.teamIconUrl}
                nombre={item.teamName}
                size={35}
                  />
              <View style={styles.equipo}>
                <Text style={styles.nombre}>{item.teamName}</Text>
                <Text style={styles.detalle}>
                  G {item.won ?? 0} · E {item.draw ?? 0} · P {item.lost ?? 0}
                </Text>
              </View>
              <Text style={styles.numero}>{item.matches ?? 0}</Text>
              <Text style={styles.numero}>{item.goalDiff ?? 0}</Text>
              <Text style={styles.numero}>{item.points ?? 0}</Text>
            </View>
          )}
          ListFooterComponent={
            <Button title="Actualizar tabla" onPress={cargar} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fff' },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#D71920' },
  subtitulo: { color: '#666', marginBottom: 15 },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  posicion: { width: 23, fontWeight: 'bold' },
  escudo: { width: 35, height: 35, marginRight: 7 },
  equipo: { flex: 1 },
  nombre: { fontSize: 13, fontWeight: 'bold' },
  detalle: { color: '#777', fontSize: 11 },
  numero: { width: 34, textAlign: 'center', fontSize: 12 }
});
