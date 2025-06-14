import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useFavorites } from '@/hooks/use-favorites';
import { useTheme } from '@/hooks/use-theme';
import { getImageUrl, IMAGE_SIZES } from '@/lib/api-config';
import type { Movie } from '@/types/movie';
import { Heart } from 'lucide-react-native';
import * as React from 'react';
import { Dimensions, Image, Platform, TouchableOpacity } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const horizontalPadding = 16; // Total horizontal padding from screen edges
const cardWidth = (screenWidth - (horizontalPadding * 2)) / 2 - 6; // Subtract small margin for spacing

type Props = {
  movie: Movie;
  onPress: (movieId: number) => void;
};

export function MovieCard({ movie, onPress }: Props) {
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

  const formatRating = (rating: number): string => {
    return rating.toFixed(1);
  };

  const imageUri = movie.poster_path 
    ? getImageUrl(movie.poster_path, IMAGE_SIZES.poster.small)
    : null;

  return (
    <TouchableOpacity 
      testID={`movie-card-${movie.id}`}
      onPress={handlePress}
      style={{
        width: cardWidth,
        marginBottom: 16,
        backgroundColor: theme.colors.card.background,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
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
    >
      {/* Movie Poster */}
      <View style={{ position: 'relative' }}>
        {imageUri ? (
          <Image
            testID={`movie-poster-${movie.id}`}
            source={{ uri: imageUri }}
            style={{ 
              width: '100%', 
              height: 140, 
              backgroundColor: theme.colors.placeholder.background
            }}
            resizeMode="cover"
          />
        ) : (
          <View 
            testID={`movie-poster-placeholder-${movie.id}`}
            style={{ 
              width: '100%', 
              height: 140, 
              backgroundColor: theme.colors.placeholder.background,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: theme.colors.border,
              borderStyle: 'dashed'
            }}
          >
            <Text style={{ fontSize: 48, marginBottom: 8 }}>🎬</Text>
            <Text 
              testID={`movie-no-image-text-${movie.id}`}
              style={{ 
                fontSize: 12, 
                color: theme.colors.placeholder.text, 
                textAlign: 'center', 
                fontWeight: '500' 
              }}
            >
              No Image
            </Text>
          </View>
        )}
        
        {/* Favorite Button */}
        <TouchableOpacity
          testID={`favorite-button-${movie.id}`}
          onPress={handleFavoritePress}
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: theme.mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
            borderRadius: 20,
            padding: 8,
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
        >
          <Heart
            size={18}
            color={isMovieFavorite ? '#ef4444' : theme.colors.text.secondary}
            fill={isMovieFavorite ? '#ef4444' : 'transparent'}
          />
        </TouchableOpacity>
        
        {/* Rating Badge */}
        <View 
          testID={`rating-badge-${movie.id}`}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: theme.colors.rating.background,
            borderRadius: 20,
            paddingHorizontal: 8,
            paddingVertical: 4,
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
        >
          <Text 
            testID={`rating-text-${movie.id}`}
            style={{ 
              color: theme.colors.rating.text, 
              fontSize: 12, 
              fontWeight: 'bold' 
            }}
          >
            ⭐ {formatRating(movie.vote_average)}
          </Text>
        </View>
      </View>

      {/* Movie Info */}
      <View style={{ padding: 16 }}>
        <Text 
          testID={`movie-title-${movie.id}`}
          style={{ 
            fontSize: 18, 
            fontWeight: 'bold', 
            color: theme.colors.text.primary, 
            lineHeight: 22,
            marginBottom: 8 
          }}
          numberOfLines={2}
        >
          {movie.title}
        </Text>
        
        <Text 
          testID={`movie-year-${movie.id}`}
          style={{ 
            fontSize: 12, 
            color: theme.colors.text.secondary, 
            fontWeight: '500',
            marginBottom: 8 
          }}
        >
          📅 {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}
        </Text>
        
        <View 
          testID={`popular-badge-${movie.id}`}
          style={{
            backgroundColor: theme.colors.badge.background,
            borderRadius: 20,
            paddingHorizontal: 8,
            paddingVertical: 4,
            alignSelf: 'flex-start',
            marginBottom: 12
          }}
        >
          <Text 
            testID={`popular-text-${movie.id}`}
            style={{ 
              color: theme.colors.badge.text, 
              fontSize: 12, 
              fontWeight: '600' 
            }}
          >
            POPULAR
          </Text>
        </View>
        
        <Text 
          testID={`movie-overview-${movie.id}`}
          style={{ 
            fontSize: 12, 
            color: theme.colors.text.tertiary, 
            lineHeight: 18 
          }}
          numberOfLines={3}
        >
          {movie.overview}
        </Text>
      </View>
    </TouchableOpacity>
  );
} 