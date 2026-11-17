
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

export default function EscudoEquipo({
  url,
  nombre = '',
  size = 40
}) {
  const [urlFallida, setUrlFallida] = useState(null);

  if (!url || urlFallida === url) {
    return (
      <View style={[
        styles.alternativa,
        { width: size, height: size }
      ]}>
        <Text style={styles.texto}>
          {nombre.substring(0, 3).toUpperCase() || 'FC'}
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: url }}
      style={{ width: size, height: size }}
      contentFit="contain"
      recyclingKey={url}
      onError={() => {
        console.log('Error cargando escudo:', nombre, url);
        setUrlFallida(url);
      }}
    />
  );
}

const styles = StyleSheet.create({
  alternativa: {
    backgroundColor: '#EEEEEE',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  texto: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555555'
  }
});
