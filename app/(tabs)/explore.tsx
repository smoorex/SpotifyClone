import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import SearchBar from '../../components/SearchBar';
import TrackCard from '../../components/TrackCard';
import { searchDeezerTracks } from '../../services/deezerApi';
import { useRouter } from 'expo-router';

interface Track {
  id: number;
  title: string;
  artist: {
    name: string;
  };
  album: {
    cover_small: string;
  };
  preview: string;
}

export default function ExploreScreen() {
  const [results, setResults] = useState<Track[]>([]);
  const router = useRouter();

  const handleSearch = async (query: string) => {
    const tracks = await searchDeezerTracks(query);
    setResults(tracks);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <SearchBar onSearch={handleSearch} />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TrackCard
            track={item}
            onPress={() =>
              router.push({
                pathname: '/player/[id]',
                params: { id: item.id.toString() },
              })
            }
          />
        )}
      />
    </View>
  );
}
