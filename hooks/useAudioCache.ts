import { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_FOLDER = `${FileSystem.cacheDirectory}audio-cache/`;
const CACHE_INDEX_KEY = 'audio-cache-index';
const MAX_CACHE_SIZE = 500 * 1024 * 1024; // 500MB

interface CacheIndex {
  [url: string]: {
    localUri: string;
    size: number;
    lastAccessed: number;
  };
}

export function useAudioCache() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [cacheIndex, setCacheIndex] = useState<CacheIndex>({});

  useEffect(() => {
    initializeCache();
  }, []);

  const initializeCache = async () => {
    try {
      // Create cache directory if it doesn't exist
      const dirInfo = await FileSystem.getInfoAsync(CACHE_FOLDER);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(CACHE_FOLDER);
      }

      // Load cache index
      const storedIndex = await AsyncStorage.getItem(CACHE_INDEX_KEY);
      if (storedIndex) {
        setCacheIndex(JSON.parse(storedIndex));
      }

      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize cache:', error);
    }
  };

  const getCachedUri = async (url: string): Promise<string> => {
    if (!isInitialized) {
      await initializeCache();
    }

    // Check if file is cached
    if (cacheIndex[url]) {
      const cachedFile = await FileSystem.getInfoAsync(cacheIndex[url].localUri);
      if (cachedFile.exists) {
        // Update last accessed time
        const updatedIndex = {
          ...cacheIndex,
          [url]: {
            ...cacheIndex[url],
            lastAccessed: Date.now(),
          },
        };
        setCacheIndex(updatedIndex);
        await AsyncStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(updatedIndex));
        return cacheIndex[url].localUri;
      }
    }

    // Download and cache file
    const filename = url.split('/').pop() || Date.now().toString();
    const localUri = `${CACHE_FOLDER}${filename}`;

    try {
      const downloadResult = await FileSystem.downloadAsync(url, localUri);
      
      // Ensure we have space in cache
      await ensureCacheSpace(downloadResult.size);

      // Update cache index
      const updatedIndex = {
        ...cacheIndex,
        [url]: {
          localUri,
          size: downloadResult.size,
          lastAccessed: Date.now(),
        },
      };
      setCacheIndex(updatedIndex);
      await AsyncStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(updatedIndex));

      return localUri;
    } catch (error) {
      console.error('Failed to cache audio:', error);
      return url; // Fallback to original URL
    }
  };

  const ensureCacheSpace = async (neededSpace: number) => {
    let currentSize = Object.values(cacheIndex).reduce((total, item) => total + item.size, 0);

    if (currentSize + neededSpace > MAX_CACHE_SIZE) {
      // Sort cached files by last accessed time
      const files = Object.entries(cacheIndex)
        .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);

      // Remove files until we have enough space
      for (const [url, file] of files) {
        try {
          await FileSystem.deleteAsync(file.localUri);
          currentSize -= file.size;
          delete cacheIndex[url];

          if (currentSize + neededSpace <= MAX_CACHE_SIZE) {
            break;
          }
        } catch (error) {
          console.error('Failed to remove cached file:', error);
        }
      }

      // Update cache index
      await AsyncStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(cacheIndex));
    }
  };

  const clearCache = async () => {
    try {
      await FileSystem.deleteAsync(CACHE_FOLDER);
      await FileSystem.makeDirectoryAsync(CACHE_FOLDER);
      await AsyncStorage.removeItem(CACHE_INDEX_KEY);
      setCacheIndex({});
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  return {
    getCachedUri,
    clearCache,
    isInitialized,
  };
}