import { MediaDetails, MediaItem, PaginatedResponse, SeasonDetails } from '../types';

// Fallback API key for demo purposes if not provided in .env
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'aa4f947818d885e4addb8684a408dbaf';
const BASE_URL = 'https://api.themoviedb.org/3';

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const IMAGE_W1280_URL = 'https://image.tmdb.org/t/p/w1280';
export const IMAGE_ORIGINAL_URL = 'https://image.tmdb.org/t/p/original';

const fetchFromTMDB = async <T>(endpoint: string, params: Record<string, string> = {}): Promise<T> => {
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    ...params,
  });
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Invalid TMDB API Key. Please check your configuration.');
      } else if (response.status === 404) {
        throw new Error('Not Found: The requested movie, TV show, or resource could not be found.');
      } else if (response.status === 429) {
        throw new Error('Rate Limit Exceeded: Too many requests to TMDB API. Please try again later.');
      } else if (response.status >= 500) {
        throw new Error('Server Error: TMDB is currently experiencing issues. Please try again later.');
      } else {
        throw new Error(`TMDB API Error (${response.status}): ${response.statusText}`);
      }
    }
    
    return await response.json();
  } catch (error) {
    // Re-throw the error so it can be handled by the calling component
    console.error('TMDB Fetch Error:', error);
    throw error;
  }
};

export const tmdb = {
  getTrending: (mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'day', page: number = 1) => 
    fetchFromTMDB<PaginatedResponse<MediaItem>>(`/trending/${mediaType}/${timeWindow}`, { page: page.toString() }),
    
  getPopular: (mediaType: 'movie' | 'tv', page: number = 1) => 
    fetchFromTMDB<PaginatedResponse<MediaItem>>(`/${mediaType}/popular`, { page: page.toString() }),
    
  getTopRated: (mediaType: 'movie' | 'tv', page: number = 1) => 
    fetchFromTMDB<PaginatedResponse<MediaItem>>(`/${mediaType}/top_rated`, { page: page.toString() }),
    
  getUpcoming: (page: number = 1) => 
    fetchFromTMDB<PaginatedResponse<MediaItem>>('/movie/upcoming', { page: page.toString() }),
    
  search: (query: string, page: number = 1) => 
    fetchFromTMDB<PaginatedResponse<MediaItem>>('/search/multi', { query, page: page.toString() }),
    
  getDetails: (id: number, mediaType: 'movie' | 'tv') => 
    fetchFromTMDB<MediaDetails>(`/${mediaType}/${id}`, { append_to_response: 'credits,videos,similar,external_ids' }),
    
  getSeasonDetails: (tvId: number, seasonNumber: number) =>
    fetchFromTMDB<SeasonDetails>(`/tv/${tvId}/season/${seasonNumber}`),
    
  getGenres: (mediaType: 'movie' | 'tv') => 
    fetchFromTMDB<{genres: {id: number, name: string}[]}>(`/genre/${mediaType}/list`),
    
  getCountries: () => 
    fetchFromTMDB<{iso_3166_1: string, english_name: string}[]>('/configuration/countries'),
    
  discover: (mediaType: 'movie' | 'tv', params: Record<string, string>, page: number = 1) => 
    fetchFromTMDB<PaginatedResponse<MediaItem>>(`/discover/${mediaType}`, { ...params, page: page.toString() }),
};
