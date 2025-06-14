import { CastCard } from '@/components/cast-card';
import { MovieDetailSkeleton } from '@/components/movie-detail-skeleton';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
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
  Platform,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

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

  const formatRuntime = (minutes: number | null): string => {
    if (!minutes) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatBudget = (amount: number): string => {
    if (amount === 0) return 'Not disclosed';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (movieError) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ 
            fontSize: 18, 
            color: theme.colors.text.primary, 
            textAlign: 'center',
            marginBottom: 16 
          }}>
            Failed to load movie details
          </Text>
          <TouchableOpacity
            onPress={handleBackPress}
            style={{
              backgroundColor: theme.colors.primary,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: theme.colors.surface, fontWeight: 'bold' }}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoadingMovie || !movie) {
    return <MovieDetailSkeleton />;
  }

  const backdropUri = movie.backdrop_path 
    ? getImageUrl(movie.backdrop_path, IMAGE_SIZES.backdrop.large)
    : null;

  const posterUri = movie.poster_path 
    ? getImageUrl(movie.poster_path, IMAGE_SIZES.poster.medium)
    : null;

  const director = credits?.crew.find(member => member.job === 'Director');
  const mainCast = credits?.cast.slice(0, 10) || [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Hero Section with Backdrop */}
        <View style={{ position: 'relative', height: 400 }}>
          {backdropUri ? (
            <ImageBackground
              source={{ uri: backdropUri }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            >
              <BlurView
                intensity={20}
                tint={theme.mode === 'dark' ? 'dark' : 'light'}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: theme.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)',
                }}
              />
            </ImageBackground>
          ) : (
            <View style={{
              width: '100%',
              height: '100%',
              backgroundColor: theme.colors.surface,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={{ fontSize: 48, opacity: 0.3 }}>🎬</Text>
            </View>
          )}

          {/* Header Controls */}
          <View style={{
            position: 'absolute',
            top: Platform.OS === 'ios' ? 50 : 20,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            zIndex: 10,
          }}>
            <TouchableOpacity
              onPress={handleBackPress}
              style={{
                backgroundColor: 'rgba(0,0,0,0.7)',
                borderRadius: 20,
                padding: 8,
              }}
            >
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleFavoritePress}
              style={{
                backgroundColor: 'rgba(0,0,0,0.7)',
                borderRadius: 20,
                padding: 8,
              }}
            >
              <Heart
                size={24}
                color={isMovieFavorite ? '#ef4444' : '#fff'}
                fill={isMovieFavorite ? '#ef4444' : 'transparent'}
              />
            </TouchableOpacity>
          </View>

          {/* Movie Poster and Basic Info */}
          <View style={{
            position: 'absolute',
            bottom: 20,
            left: 16,
            right: 16,
            flexDirection: 'row',
          }}>
            {/* Poster */}
            <View style={{ marginRight: 16 }}>
              {posterUri ? (
                <Image
                  source={{ uri: posterUri }}
                  style={{
                    width: 120,
                    height: 180,
                    borderRadius: 12,
                    borderWidth: 3,
                    borderColor: '#fff',
                  }}
                  resizeMode="cover"
                />
              ) : (
                <View style={{
                  width: 120,
                  height: 180,
                  borderRadius: 12,
                  backgroundColor: theme.colors.placeholder.background,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 3,
                  borderColor: '#fff',
                }}>
                  <Text style={{ fontSize: 32 }}>🎬</Text>
                </View>
              )}
            </View>

            {/* Movie Info */}
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#fff',
                marginBottom: 8,
                textShadowColor: 'rgba(0,0,0,0.8)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}>
                {movie.title}
              </Text>

              {movie.tagline && (
                <Text style={{
                  fontSize: 14,
                  color: '#e5e5e5',
                  fontStyle: 'italic',
                  marginBottom: 8,
                  textShadowColor: 'rgba(0,0,0,0.8)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                }}>
                  "{movie.tagline}"
                </Text>
              )}

              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Star size={16} color="#fbbf24" fill="#fbbf24" />
                <Text style={{ 
                  color: '#fff', 
                  marginLeft: 4, 
                  fontWeight: 'bold',
                  textShadowColor: 'rgba(0,0,0,0.8)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                }}>
                  {movie.vote_average.toFixed(1)}
                </Text>
                <Text style={{ 
                  color: '#e5e5e5', 
                  marginLeft: 4,
                  textShadowColor: 'rgba(0,0,0,0.8)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                }}>
                  ({movie.vote_count.toLocaleString()} votes)
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Calendar size={16} color="#e5e5e5" />
                <Text style={{ 
                  color: '#e5e5e5', 
                  marginLeft: 4,
                  textShadowColor: 'rgba(0,0,0,0.8)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                }}>
                  {new Date(movie.release_date).getFullYear()}
                </Text>
                {movie.runtime && (
                  <>
                    <Clock size={16} color="#e5e5e5" style={{ marginLeft: 16 }} />
                    <Text style={{ 
                      color: '#e5e5e5', 
                      marginLeft: 4,
                      textShadowColor: 'rgba(0,0,0,0.8)',
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
                    }}>
                      {formatRuntime(movie.runtime)}
                    </Text>
                  </>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={{ padding: 16 }}>
          {/* Genres */}
          {movie.genres.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
              {movie.genres.map((genre) => (
                <View
                  key={genre.id}
                  style={{
                    backgroundColor: theme.colors.primary,
                    borderRadius: 16,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                >
                  <Text style={{
                    color: theme.mode === 'dark' ? theme.colors.background : theme.colors.surface,
                    fontSize: 12,
                    fontWeight: '600',
                  }}>
                    {genre.name}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Overview */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: theme.colors.text.primary,
              marginBottom: 8,
            }}>
              Overview
            </Text>
            <Text style={{
              fontSize: 16,
              color: theme.colors.text.secondary,
              lineHeight: 24,
            }}>
              {movie.overview || 'No overview available.'}
            </Text>
          </View>

          {/* Movie Details */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: theme.colors.text.primary,
              marginBottom: 12,
            }}>
              Details
            </Text>
            
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {director && (
                <View style={{
                  backgroundColor: theme.colors.surface,
                  borderRadius: 12,
                  padding: 16,
                  marginRight: 8,
                  marginBottom: 8,
                  flex: 1,
                  minWidth: '45%',
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}>
                  <Text style={{
                    fontSize: 12,
                    color: theme.colors.text.tertiary,
                    marginBottom: 4,
                  }}>
                    Director
                  </Text>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: theme.colors.text.primary,
                  }}>
                    {director.name}
                  </Text>
                </View>
              )}

              <View style={{
                backgroundColor: theme.colors.surface,
                borderRadius: 12,
                padding: 16,
                marginRight: 8,
                marginBottom: 8,
                flex: 1,
                minWidth: '45%',
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}>
                <Text style={{
                  fontSize: 12,
                  color: theme.colors.text.tertiary,
                  marginBottom: 4,
                }}>
                  Budget
                </Text>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: theme.colors.text.primary,
                }}>
                  {formatBudget(movie.budget)}
                </Text>
              </View>

              <View style={{
                backgroundColor: theme.colors.surface,
                borderRadius: 12,
                padding: 16,
                marginRight: 8,
                marginBottom: 8,
                flex: 1,
                minWidth: '45%',
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}>
                <Text style={{
                  fontSize: 12,
                  color: theme.colors.text.tertiary,
                  marginBottom: 4,
                }}>
                  Revenue
                </Text>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: theme.colors.text.primary,
                }}>
                  {formatBudget(movie.revenue)}
                </Text>
              </View>

              <View style={{
                backgroundColor: theme.colors.surface,
                borderRadius: 12,
                padding: 16,
                marginBottom: 8,
                flex: 1,
                minWidth: '45%',
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}>
                <Text style={{
                  fontSize: 12,
                  color: theme.colors.text.tertiary,
                  marginBottom: 4,
                }}>
                  Status
                </Text>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: theme.colors.text.primary,
                }}>
                  {movie.status}
                </Text>
              </View>
            </View>
          </View>

          {/* Cast */}
          {!isLoadingCredits && mainCast.length > 0 && (
            <View style={{ marginBottom: 24 }}>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: theme.colors.text.primary,
                marginBottom: 12,
              }}>
                Cast
              </Text>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 16 }}
              >
                {mainCast.map((cast) => (
                  <CastCard
                    key={cast.id}
                    cast={cast}
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 