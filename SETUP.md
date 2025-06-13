# TMDB API Setup

To use the movie discovery features, you need to obtain a TMDB API key:

## Steps:

1. Go to [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Create an account or sign in
3. Go to Settings > API
4. Request an API key (choose "Developer" option)
5. Fill out the required information

## Configuration:

Create a `.env` file in the project root and add:

```
EXPO_PUBLIC_TMDB_API_KEY=your_actual_api_key_here
```

## Alternative:

If you don't want to use environment variables, you can directly edit the API key in:
`lib/api-config.ts` and replace `YOUR_TMDB_API_KEY_HERE` with your actual API key.

**Note:** Never commit your actual API key to version control! 