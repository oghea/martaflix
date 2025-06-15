import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { VStack } from '@/components/ui/vstack';
import { useFavorites } from '@/hooks/use-favorites';
import { useTheme } from '@/hooks/use-theme';
import { getImageUrl, IMAGE_SIZES } from '@/lib/api-config';
import type { Movie } from '@/types/movie';
import { Heart } from 'lucide-react-native';
import * as React from 'react';
import { Dimensions, Image, Platform } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const horizontalPadding = 16; // Total horizontal padding from screen edges
const cardWidth = (screenWidth - (horizontalPadding * 2)) / 2 - 6; // Subtract small margin for spacing

type Props = {
  movie: Movie;
  onPress: (movieId: number) => void;
};

// Memoized Rating Badge Component
const RatingBadge = React.memo(({ 
  rating, 
  theme,
  movieId 
}: { 
  rating: number; 
  theme: any;
  movieId: number;
}) => (
  <View 
    className="absolute top-3 right-3 rounded-full px-2 py-1 shadow-md"
    style={{
      backgroundColor: theme.colors.rating.background,
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
        },
        android: {
          elevation: 6,
        },
      }),
    }}
    accessible={true}
    accessibilityRole="text"
    accessibilityLabel={`Rating: ${rating.toFixed(1)} out of 10`}
  >
    <Text 
      testID={`rating-text-${movieId}`}
      size="xs"
      className="font-bold"
      style={{ color: theme.colors.rating.text }}
    >
      ⭐ {rating.toFixed(1)}
    </Text>
  </View>
));

RatingBadge.displayName = 'RatingBadge';

// Memoized Favorite Button Component
const FavoriteButton = React.memo(({ 
  isFavorite, 
  onPress, 
  theme,
  movieTitle,
  movieId 
}: { 
  isFavorite: boolean; 
  onPress: (e?: any) => void;
  theme: any;
  movieTitle: string;
  movieId: number;
}) => (
  <Pressable
    testID={`favorite-button-${movieId}`}
    onPress={onPress}
    className="absolute top-3 left-3 rounded-full p-2 shadow-md"
    style={{
      backgroundColor: theme.mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
        },
        android: {
          elevation: 6,
        },
      }),
    }}
    accessible={true}
    accessibilityRole="button"
    accessibilityLabel={isFavorite ? `Remove ${movieTitle} from favorites` : `Add ${movieTitle} to favorites`}
    accessibilityHint={isFavorite ? "Double tap to remove from favorites" : "Double tap to add to favorites"}
  >
    <Heart
      size={18}
      color={isFavorite ? '#ef4444' : theme.colors.text.secondary}
      fill={isFavorite ? '#ef4444' : 'transparent'}
    />
  </Pressable>
));

FavoriteButton.displayName = 'FavoriteButton';

// Memoized Movie Poster Component
const MoviePoster = React.memo(({ 
  imageUri, 
  movieTitle, 
  theme,
  movieId 
}: { 
  imageUri: string | null; 
  movieTitle: string;
  theme: any;
  movieId: number;
}) => (
  <View className="relative">
    {imageUri ? (
      <Image
        testID={`movie-poster-${movieId}`}
        source={{ uri: imageUri }}
        className="w-full rounded-t-2xl"
        style={{ 
          height: 140, 
          backgroundColor: theme.colors.placeholder.background
        }}
        resizeMode="cover"
        accessible={true}
        accessibilityRole="image"
        accessibilityLabel={`${movieTitle} movie poster`}
      />
    ) : (
      <VStack 
        testID={`movie-poster-placeholder-${movieId}`}
        className="w-full rounded-t-2xl justify-center items-center border-2 border-dashed"
        style={{ 
          height: 140, 
          backgroundColor: theme.colors.placeholder.background,
          borderColor: theme.colors.border
        }}
      >
        <Text className="text-5xl mb-2">🎬</Text>
        <Text 
          testID={`movie-no-image-text-${movieId}`}
          size="xs"
          className="text-center font-medium"
          style={{ color: theme.colors.placeholder.text }}
        >
          No Image
        </Text>
      </VStack>
    )}
  </View>
));

MoviePoster.displayName = 'MoviePoster';

// Memoized Movie Card Component
export const MovieCard = React.memo(({ movie, onPress }: Props) => {
  const { theme } = useTheme();
  const { toggleFavorite, isFavorite } = useFavorites();
  const isMovieFavorite = isFavorite(movie.id);
  
  const handlePress = React.useCallback(() => {
    onPress(movie.id);
  }, [movie.id, onPress]);

  const handleFavoritePress = React.useCallback((e?: any) => {
    e?.stopPropagation(); // Prevent triggering the card press
    toggleFavorite(movie);
  }, [movie, toggleFavorite]);

  const imageUri = React.useMemo(() => 
    movie.poster_path 
      ? getImageUrl(movie.poster_path, IMAGE_SIZES.poster.small)
      : null,
    [movie.poster_path]
  );

  const releaseYear = React.useMemo(() => {
    if (!movie.release_date) return 'Unknown';
    const year = new Date(movie.release_date).getFullYear();
    return isNaN(year) ? 'Unknown' : year.toString();
  }, [movie.release_date]);

  return (
    <Pressable 
      testID={`movie-card-${movie.id}`}
      onPress={handlePress}
      className="mb-4 rounded-2xl border overflow-hidden shadow-lg"
      style={{
        width: cardWidth,
        backgroundColor: theme.colors.card.background,
        borderColor: theme.colors.card.border,
        // Enhanced shadow for better visibility
        ...Platform.select({
          ios: {
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: theme.mode === 'dark' ? 0.3 : 0.15,
            shadowRadius: 8,
          },
          android: {
            elevation: 12,
          },
        }),
      }}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${movie.title} movie card`}
      accessibilityHint="Double tap to view movie details"
    >
      {/* Movie Poster */}
      <View className="relative">
        <MoviePoster 
          imageUri={imageUri} 
          movieTitle={movie.title}
          theme={theme}
          movieId={movie.id}
        />
        
        {/* Favorite Button */}
        <FavoriteButton 
          isFavorite={isMovieFavorite}
          onPress={handleFavoritePress}
          theme={theme}
          movieTitle={movie.title}
          movieId={movie.id}
        />
        
        {/* Rating Badge */}
        <RatingBadge 
          rating={movie.vote_average}
          theme={theme}
          movieId={movie.id}
        />
      </View>

      {/* Movie Info */}
      <VStack className="p-4" space="sm">
        <Text 
          testID={`movie-title-${movie.id}`}
          size="md"
          className="font-bold leading-5"
          style={{ color: theme.colors.text.primary }}
          numberOfLines={2}
          accessible={true}
          accessibilityRole="text"
        >
          {movie.title}
        </Text>
        
        <HStack className="items-center justify-between">
          <Text 
            testID={`movie-year-${movie.id}`}
            size="xs"
            className="font-medium"
            style={{ color: theme.colors.text.secondary }}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={`Release year: ${releaseYear}`}
          >
            📅 {releaseYear}
          </Text>
          
          <View 
            testID={`popularity-badge-${movie.id}`}
            className="rounded-full px-2 py-1"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <Text 
              testID={`popular-text-${movie.id}`}
              size="xs"
              className="font-bold"
              style={{ 
                color: theme.mode === 'dark' ? theme.colors.background : theme.colors.surface 
              }}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={`Popularity score: ${Math.round(movie.popularity)}`}
            >
              POPULAR
            </Text>
          </View>
        </HStack>
        
        <Text 
          testID={`movie-overview-${movie.id}`}
          size="xs"
          className="leading-4"
          style={{ color: theme.colors.text.tertiary }}
          numberOfLines={3}
          accessible={true}
          accessibilityRole="text"
        >
          {movie.overview || ''}
        </Text>
      </VStack>
    </Pressable>
  );
});

MovieCard.displayName = 'MovieCard'; 