import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Button, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';

interface Track {
  id: number;
  title: string;
  artist: {
    name: string;
  };
  album: {
    cover_big: string;
  };
  preview: string;
}

export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [track, setTrack] = useState<Track | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAndPlay = async () => {
      try {
        const res = await fetch(`https://api.deezer.com/track/${id}`);
        const json = await res.json();

        if (isMounted) setTrack(json);

        if (json.preview) {
          const { sound } = await Audio.Sound.createAsync({ uri: json.preview });
          if (isMounted) {
            setSound(sound);
            await sound.playAsync();
          }
        } else {
          console.warn('Track has no preview available');
        }
      } catch (error) {
        console.error('Error fetching or playing track:', error);
      }
    };

    fetchAndPlay();

    return () => {
      isMounted = false;
      if (sound) {
        sound.unloadAsync().catch(() => {});
      }
    };
  }, [id]);

  if (!track) {
    return <ActivityIndicator style={{ marginTop: 20 }} />;
  }

  if (!track.preview) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: track.album.cover_big }} style={styles.image} />
        <Text style={styles.title}>{track.title}</Text>
        <Text style={styles.artist}>{track.artist.name}</Text>
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>
          No preview available for this track.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: track.album.cover_big }} style={styles.image} />
      <Text style={styles.title}>{track.title}</Text>
      <Text style={styles.artist}>{track.artist.name}</Text>
      <View style={styles.controls}>
        <Button title="Pause" onPress={() => sound?.pauseAsync()} />
        <Button title="Play" onPress={() => sound?.playAsync()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  artist: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
});
