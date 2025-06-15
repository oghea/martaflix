import { CastCard } from '@/components/cast-card';
import { MovieDetailSkeleton } from '@/components/movie-detail-skeleton';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { VStack } from '@/components/ui/vstack';
import { useFavorites } from '@/hooks/use-favorites';
import { useMovieCredits, useMovieDetails } from '@/hooks/use-movie-details';
import { useTheme } from '@/hooks/use-theme';
import { getImageUrl, IMAGE_SIZES } from '@/lib/api-config';
import { BlurView } from 'expo-blur';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, Clock, Heart, Star } from 'lucide-react-native';
import * as React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

// Memoized Detail Card Component
const DetailCard = React.memo(({ 
  label, 
  value, 
  theme 
}: { 
  label: string; 
  value: string; 
  theme: any;
}) => (
  <View 
    className="flex-1 min-w-[45%] mr-2 mb-2 p-4 rounded-xl border"
    style={{
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    }}
    accessible={true}
    accessibilityRole="text"
    accessibilityLabel={`${label}: ${value}`}
  >
    <Text 
      size="xs"
      className="mb-1"
      style={{ color: theme.colors.text.tertiary }}
    >
      {label}
    </Text>
    <Text 
      size="md"
      className="font-semibold"
      style={{ color: theme.colors.text.primary }}
    >
      {value}
    </Text>
  </View>
));

DetailCard.displayName = 'DetailCard';

// Memoized Genre Badge Component
const GenreBadge = React.memo(({ 
  genre, 
  theme 
}: { 
  genre: { id: number; name: string }; 
  theme: any;
}) => (
  <View
    className="rounded-2xl px-3 py-1.5 mr-2 mb-2"
    style={{ backgroundColor: theme.colors.primary }}
    accessible={true}
    accessibilityRole="text"
    accessibilityLabel={`Genre: ${genre.name}`}
  >
    <Text 
      size="xs"
      className="font-semibold"
      style={{
        color: theme.mode === 'dark' ? theme.colors.background : theme.colors.surface,
      }}
    >
      {genre.name}
    </Text>
  </View>
));

GenreBadge.displayName = 'GenreBadge';

// Memoized Cast List Component
const CastList = React.memo(({ 
  cast, 
  theme 
}: { 
  cast: any[]; 
  theme: any;
}) => (
  <VStack space="md" className="mb-6">
    <Heading 
      size="lg"
      className="font-bold"
      style={{ color: theme.colors.text.primary }}
      accessibilityRole="heading"
      accessibilityLevel={3}
    >
      Cast
    </Heading>
    
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 16 }}
      accessible={true}
      accessibilityRole="list"
      accessibilityLabel="Movie cast list"
    >
      {cast.map((castMember) => (
        <CastCard
          key={castMember.id}
          cast={castMember}
        />
      ))}
    </ScrollView>
  </VStack>
));

CastList.displayName = 'CastList';

export default function MovieDetailScreen(): React.JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const movieId = parseInt(id || '0');
  
  const { 
    data: movie, 
    isLoading: isLoadingMovie, 
    error: movieError 
  } = useMovieDetails(movieId);
  
  const { 
    data: credits, 
    isLoading: isLoadingCredits 
  } = useMovieCredits(movieId);

  const isMovieFavorite = movie ? isFavorite(movie.id) : false;

  const handleBackPress = React.useCallback(() => {
    router.back();
  }, []);

  const handleFavoritePress = React.useCallback(() => {
    if (movie) {
      toggleFavorite({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        popularity: movie.popularity,
        adult: movie.adult,
        genre_ids: movie.genres.map(g => g.id),
        original_language: movie.original_language,
        original_title: movie.original_title,
        video: movie.video,
      });
    }
  }, [movie, toggleFavorite]);

  const formatRuntime = React.useCallback((minutes: number | null): string => {
    if (!minutes) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }, []);

  const formatBudget = React.useCallback((amount: number): string => {
    if (amount === 0) return 'Not disclosed';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  // Memoized values
  const backdropUri = React.useMemo(() => 
    movie?.backdrop_path 
      ? getImageUrl(movie.backdrop_path, IMAGE_SIZES.backdrop.large)
      : null,
    [movie?.backdrop_path]
  );

  const posterUri = React.useMemo(() => 
    movie?.poster_path 
      ? getImageUrl(movie.poster_path, IMAGE_SIZES.poster.medium)
      : null,
    [movie?.poster_path]
  );

  const director = React.useMemo(() => 
    credits?.crew.find(member => member.job === 'Director'),
    [credits?.crew]
  );

  const mainCast = React.useMemo(() => 
    credits?.cast.slice(0, 10) || [],
    [credits?.cast]
  );

  if (movieError) {
    return (
      <SafeAreaView 
        className="flex-1"
        style={{ backgroundColor: theme.colors.background }}
      >
        <VStack 
          className="flex-1 justify-center items-center p-5"
          accessible={true}
          accessibilityRole="alert"
        >
          <Text 
            size="lg"
            className="text-center mb-4 font-medium"
            style={{ color: theme.colors.text.primary }}
          >
            Failed to load movie details
          </Text>
          <Button
            onPress={handleBackPress}
            size="md"
            variant="solid"
            className="px-5 py-2.5 rounded-lg"
            style={{ backgroundColor: theme.colors.primary }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Go back to previous screen"
          >
            <ButtonText style={{ color: theme.colors.surface }}>
              Go Back
            </ButtonText>
          </Button>
        </VStack>
      </SafeAreaView>
    );
  }

  if (isLoadingMovie || !movie) {
    return <MovieDetailSkeleton />;
  }

  return (
    <SafeAreaView 
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
    >
             <ScrollView 
         className="flex-1"
         showsVerticalScrollIndicator={false}
         accessible={true}
         accessibilityRole="scrollbar"
         accessibilityLabel="Movie details"
       >
        {/* Hero Section with Backdrop */}
                 <View 
           className="relative h-96"
           accessible={true}
           accessibilityRole="image"
           accessibilityLabel={`${movie.title} backdrop image`}
         >
          {backdropUri ? (
            <ImageBackground
              source={{ uri: backdropUri }}
              className="w-full h-full"
              resizeMode="cover"
            >
              <BlurView
                intensity={20}
                tint={theme.mode === 'dark' ? 'dark' : 'light'}
                className="absolute inset-0"
                style={{
                  backgroundColor: theme.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)',
                }}
              />
            </ImageBackground>
          ) : (
            <View 
              className="w-full h-full justify-center items-center"
              style={{ backgroundColor: theme.colors.surface }}
            >
              <Text className="text-5xl opacity-30">🎬</Text>
            </View>
          )}

          {/* Header Controls */}
          <HStack
            className="absolute top-12 left-0 right-0 justify-between items-center px-4 z-10"
            style={{ top: Platform.OS === 'ios' ? 50 : 20 }}
          >
            <Pressable
              onPress={handleBackPress}
              className="bg-black/70 rounded-full p-2"
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              accessibilityHint="Navigate to previous screen"
            >
              <ArrowLeft size={24} color="#fff" />
            </Pressable>

            <Pressable
              onPress={handleFavoritePress}
              className="bg-black/70 rounded-full p-2"
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={isMovieFavorite ? "Remove from favorites" : "Add to favorites"}
              accessibilityHint={isMovieFavorite ? "Double tap to remove from favorites" : "Double tap to add to favorites"}
            >
              <Heart
                size={24}
                color={isMovieFavorite ? '#ef4444' : '#fff'}
                fill={isMovieFavorite ? '#ef4444' : 'transparent'}
              />
            </Pressable>
          </HStack>

          {/* Movie Poster and Basic Info */}
          <HStack 
            className="absolute bottom-5 left-4 right-4"
            space="md"
          >
            {/* Poster */}
            <View>
              {posterUri ? (
                <Image
                  source={{ uri: posterUri }}
                  className="w-30 h-44 rounded-xl border-4 border-white"
                  resizeMode="cover"
                  accessible={true}
                  accessibilityRole="image"
                  accessibilityLabel={`${movie.title} movie poster`}
                />
              ) : (
                <View 
                  className="w-30 h-44 rounded-xl border-4 border-white justify-center items-center"
                  style={{ backgroundColor: theme.colors.placeholder.background }}
                >
                  <Text className="text-3xl">🎬</Text>
                </View>
              )}
            </View>

            {/* Movie Info */}
            <VStack className="flex-1 justify-end" space="xs">
              <Heading
                size="2xl"
                className="font-bold text-white"
                style={{
                  textShadowColor: 'rgba(0,0,0,0.8)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                }}
                accessibilityRole="heading"
                accessibilityLevel={1}
              >
                {movie.title}
              </Heading>

              {movie.tagline && (
                <Text 
                  size="sm"
                  className="text-gray-200 italic"
                  style={{
                    textShadowColor: 'rgba(0,0,0,0.8)',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                  }}
                  accessible={true}
                  accessibilityRole="text"
                  accessibilityLabel={`Tagline: ${movie.tagline}`}
                >
                  "{movie.tagline}"
                </Text>
              )}

              <HStack className="items-center" space="xs">
                <Star size={16} color="#fbbf24" fill="#fbbf24" />
                <Text 
                  className="text-white font-bold"
                  style={{
                    textShadowColor: 'rgba(0,0,0,0.8)',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                  }}
                  accessible={true}
                  accessibilityLabel={`Rating: ${movie.vote_average.toFixed(1)} out of 10`}
                >
                  {movie.vote_average.toFixed(1)}
                </Text>
                <Text 
                  className="text-gray-200"
                  style={{
                    textShadowColor: 'rgba(0,0,0,0.8)',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                  }}
                  accessible={true}
                  accessibilityLabel={`${movie.vote_count} votes`}
                >
                  ({movie.vote_count.toLocaleString()} votes)
                </Text>
              </HStack>

              <HStack className="items-center" space="md">
                <HStack className="items-center" space="xs">
                  <Calendar size={16} color="#e5e5e5" />
                  <Text 
                    className="text-gray-200"
                    style={{
                      textShadowColor: 'rgba(0,0,0,0.8)',
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
                    }}
                    accessible={true}
                    accessibilityLabel={`Release year: ${new Date(movie.release_date).getFullYear()}`}
                  >
                    {new Date(movie.release_date).getFullYear()}
                  </Text>
                </HStack>
                {movie.runtime && (
                  <HStack className="items-center" space="xs">
                    <Clock size={16} color="#e5e5e5" />
                    <Text 
                      className="text-gray-200"
                      style={{
                        textShadowColor: 'rgba(0,0,0,0.8)',
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 2,
                      }}
                      accessible={true}
                      accessibilityLabel={`Runtime: ${formatRuntime(movie.runtime)}`}
                    >
                      {formatRuntime(movie.runtime)}
                    </Text>
                  </HStack>
                )}
              </HStack>
            </VStack>
          </HStack>
        </View>

        {/* Content */}
        <VStack className="p-4" space="lg">
          {/* Genres */}
          {movie.genres.length > 0 && (
            <View 
              className="flex-row flex-wrap"
              accessible={true}
              accessibilityRole="list"
              accessibilityLabel="Movie genres"
            >
              {movie.genres.map((genre) => (
                <GenreBadge key={genre.id} genre={genre} theme={theme} />
              ))}
            </View>
          )}

          {/* Overview */}
          <VStack space="sm">
            <Heading 
              size="lg"
              className="font-bold"
              style={{ color: theme.colors.text.primary }}
              accessibilityRole="heading"
              accessibilityLevel={2}
            >
              Overview
            </Heading>
            <Text 
              size="md"
              className="leading-6"
              style={{ color: theme.colors.text.secondary }}
              accessible={true}
              accessibilityRole="text"
            >
              {movie.overview || 'No overview available.'}
            </Text>
          </VStack>

          {/* Movie Details */}
          <VStack space="md">
            <Heading 
              size="lg"
              className="font-bold"
              style={{ color: theme.colors.text.primary }}
              accessibilityRole="heading"
              accessibilityLevel={2}
            >
              Details
            </Heading>
            
            <View 
              className="flex-row flex-wrap"
              accessible={true}
              accessibilityRole="list"
              accessibilityLabel="Movie details"
            >
              {director && (
                <DetailCard
                  label="Director"
                  value={director.name}
                  theme={theme}
                />
              )}

              <DetailCard
                label="Budget"
                value={formatBudget(movie.budget)}
                theme={theme}
              />

              <DetailCard
                label="Revenue"
                value={formatBudget(movie.revenue)}
                theme={theme}
              />

              <DetailCard
                label="Status"
                value={movie.status}
                theme={theme}
              />
            </View>
          </VStack>

          {/* Cast */}
          {!isLoadingCredits && mainCast.length > 0 && (
            <CastList cast={mainCast} theme={theme} />
          )}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
} 