export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type: 'movie' | 'tv';
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
  air_date: string | null;
  overview: string;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  runtime: number | null;
}

export interface SeasonDetails extends Season {
  episodes: Episode[];
}

export interface MediaDetails extends MediaItem {
  genres: { id: number; name: string }[];
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: Season[];
  status: string;
  tagline: string;
  credits: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  videos: {
    results: Video[];
  };
  similar: {
    results: MediaItem[];
  };
  external_ids?: {
    imdb_id?: string;
    tvdb_id?: number;
    facebook_id?: string;
    instagram_id?: string;
    twitter_id?: string;
  };
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
