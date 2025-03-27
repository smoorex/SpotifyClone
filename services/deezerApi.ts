// services/deezerApi.ts
export async function searchDeezerTracks(query: string) {
    try {
      const response = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(query)}`);
      const json = await response.json();
      return json.data;
    } catch (error) {
      console.error('Deezer search error:', error);
      return [];
    }
  }
  