import { CastDetailSkeleton } from '@/components/cast-detail-skeleton';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { VStack } from '@/components/ui/vstack';
import { usePersonCredits, usePersonDetails } from '@/hooks/use-movie-details';
import { useTheme } from '@/hooks/use-theme';
import { getImageUrl, IMAGE_SIZES } from '@/lib/api-config';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, MapPin, User } from 'lucide-react-native';
import * as React from 'react';
import {
  Dimensions,
  FlatList,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

// Memoized Detail Card Component
const DetailCard = React.memo(({ 
  label, 
  value, 
  theme,
  icon: Icon
}: { 
  label: string; 
  value: string; 
  theme: any;
  icon?: React.ComponentType<any>;
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
    <HStack className="items-center mb-2" space="xs">
      {Icon && <Icon size={16} color={theme.colors.text.tertiary} />}
      <Text 
        size="xs"
        className="font-medium"
        style={{ color: theme.colors.text.tertiary }}
      >
        {label}
      </Text>
    </HStack>
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

// Memoized Movie Credit Card Component - Custom card for horizontal lists
const MovieCreditCard = React.memo(({ 
  movie, 
  character, 
  onPress, 
  theme 
}: { 
  movie: any;
  character?: string;
  onPress: () => void;
  theme: any;
}) => {
  const imageUri = movie.poster_path 
    ? getImageUrl(movie.poster_path, IMAGE_SIZES.poster.small)
    : null;

  return (
    <Pressable 
      onPress={onPress}
      style={{ width: 120, marginRight: 12 }}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${movie.title}${character ? ` as ${character}` : ''}`}
    >
      <VStack space="xs">
        {/* Movie Poster */}
        <View 
          className="rounded-xl overflow-hidden"
          style={{ 
            width: 120, 
            height: 160,
            backgroundColor: theme.colors.placeholder.background
          }}
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={{ 
                width: '100%', 
                height: '100%'
              }}
              resizeMode="cover"
              accessible={true}
              accessibilityRole="image"
              accessibilityLabel={`${movie.title} poster`}
            />
          ) : (
            <View 
              className="flex-1 justify-center items-center border-2 border-dashed"
              style={{ 
                borderColor: theme.colors.border
              }}
            >
              <Text className="text-3xl mb-1">🎬</Text>
              <Text 
                size="xs"
                className="text-center font-medium"
                style={{ color: theme.colors.placeholder.text }}
              >
                No Image
              </Text>
            </View>
          )}
        </View>

        {/* Movie Info - Fixed height container */}
        <VStack 
          space="xs" 
          style={{ height: 50, justifyContent: 'flex-start' }}
        >
          <Text
            size="sm"
            className="font-medium text-center"
            style={{ color: theme.colors.text.primary }}
            numberOfLines={2}
          >
            {movie.title}
          </Text>
          {character && (
            <Text
              size="xs"
              className="text-center"
              style={{ color: theme.colors.text.secondary }}
              numberOfLines={1}
            >
              as {character}
            </Text>
          )}
        </VStack>
      </VStack>
    </Pressable>
  );
});

MovieCreditCard.displayName = 'MovieCreditCard';

// Memoized Movie Credits List Component
const MovieCreditsList = React.memo(({ 
  credits, 
  theme 
}: { 
  credits: any[]; 
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
      Known For ({credits.length})
    </Heading>
    
    <FlatList
      data={credits.slice(0, 20)} // Limit to top 20 movies
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      ItemSeparatorComponent={() => <View style={{ width: 0 }} />}
      keyExtractor={(item) => `credit-${item.id}`}
      renderItem={({ item }) => (
        <MovieCreditCard
          movie={item}
          character={item.character}
          onPress={() => router.push(`/movie/${item.id}`)}
          theme={theme}
        />
      )}
      accessible={true}
      accessibilityRole="list"
      accessibilityLabel="Movies and shows featuring this person"
    />
  </VStack>
));

MovieCreditsList.displayName = 'MovieCreditsList';

export default function CastDetailScreen(): React.JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  
  const personId = parseInt(id || '0');
  
  const { 
    data: person, 
    isLoading: isLoadingPerson, 
    error: personError 
  } = usePersonDetails(personId);
  
  const { 
    data: credits, 
    isLoading: isLoadingCredits 
  } = usePersonCredits(personId);

  const handleBackPress = React.useCallback(() => {
    router.back();
  }, []);

  const formatAge = React.useCallback((birthday: string | null, deathday: string | null): string => {
    if (!birthday) return 'Unknown';
    
    const birthDate = new Date(birthday);
    const endDate = deathday ? new Date(deathday) : new Date();
    const age = endDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = endDate.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < birthDate.getDate())) {
      return `${age - 1}${deathday ? ' (at death)' : ''}`;
    }
    
    return `${age}${deathday ? ' (at death)' : ''}`;
  }, []);

  const formatDate = React.useCallback((dateString: string | null): string => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  // Memoized values
  const profileUri = React.useMemo(() => 
    person?.profile_path 
      ? getImageUrl(person.profile_path, IMAGE_SIZES.poster.large)
      : null,
    [person?.profile_path]
  );

  const popularMovies = React.useMemo(() => 
    credits?.cast
      .filter(movie => movie.poster_path) // Only movies with posters
      .sort((a, b) => b.popularity - a.popularity) || [],
    [credits?.cast]
  );

  if (personError) {
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
            Failed to load cast details
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

  if (isLoadingPerson || !person) {
    return <CastDetailSkeleton />;
  }

  return (
    <SafeAreaView 
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* Header */}
      <View 
        className="flex-row items-center justify-between p-4 border-b"
        style={{ borderBottomColor: theme.colors.border }}
      >
        <Pressable 
          onPress={handleBackPress}
          className="p-2 rounded-full"
          style={{ backgroundColor: theme.colors.surface }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={24} color={theme.colors.text.primary} />
        </Pressable>
        
        <Heading 
          size="lg"
          className="font-bold flex-1 text-center mx-4"
          style={{ color: theme.colors.text.primary }}
          numberOfLines={1}
        >
          {person.name}
        </Heading>
        
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        accessible={true}
        accessibilityRole="scrollbar"
        accessibilityLabel="Cast details"
      >
        {/* Profile Section */}
        <VStack className="p-4" space="lg">
          <HStack className="items-start" space="md">
            {/* Profile Image */}
            <View className="items-center">
              {profileUri ? (
                <Image
                  source={{ uri: profileUri }}
                  style={{ 
                    width: 120, 
                    height: 160, 
                    borderRadius: 12,
                    backgroundColor: theme.colors.placeholder.background
                  }}
                  resizeMode="cover"
                  accessible={true}
                  accessibilityRole="image"
                  accessibilityLabel={`Photo of ${person.name}`}
                />
              ) : (
                <View 
                  style={{ 
                    width: 120, 
                    height: 160, 
                    backgroundColor: theme.colors.placeholder.background,
                    borderRadius: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: theme.colors.border,
                    borderStyle: 'dashed'
                  }}
                >
                  <User size={32} color={theme.colors.placeholder.text} />
                  <Text 
                    size="xs"
                    className="text-center font-medium mt-2"
                    style={{ color: theme.colors.placeholder.text }}
                  >
                    No Photo
                  </Text>
                </View>
              )}
            </View>

            {/* Basic Info */}
            <VStack className="flex-1" space="sm">
              <Heading
                size="xl"
                className="font-bold"
                style={{ color: theme.colors.text.primary }}
                accessibilityRole="heading"
                accessibilityLevel={1}
              >
                {person.name}
              </Heading>

              <Text 
                size="md"
                className="font-medium"
                style={{ color: theme.colors.text.secondary }}
              >
                {person.known_for_department}
              </Text>

              {person.birthday && (
                <Text 
                  size="sm"
                  style={{ color: theme.colors.text.tertiary }}
                >
                  Age: {formatAge(person.birthday, person.deathday)}
                </Text>
              )}

              {person.place_of_birth && (
                <HStack className="items-center" space="xs">
                  <MapPin size={14} color={theme.colors.text.tertiary} />
                  <Text 
                    size="sm"
                    className="flex-1"
                    style={{ color: theme.colors.text.tertiary }}
                    numberOfLines={2}
                  >
                    {person.place_of_birth}
                  </Text>
                </HStack>
              )}
            </VStack>
          </HStack>

          {/* Biography */}
          {person.biography && (
            <VStack space="sm">
              <Heading 
                size="lg"
                className="font-bold"
                style={{ color: theme.colors.text.primary }}
                accessibilityRole="heading"
                accessibilityLevel={2}
              >
                Biography
              </Heading>
              <Text 
                size="md"
                className="leading-6"
                style={{ color: theme.colors.text.secondary }}
                accessible={true}
                accessibilityRole="text"
              >
                {person.biography}
              </Text>
            </VStack>
          )}

          {/* Personal Details */}
          <VStack space="md">
            <Heading 
              size="lg"
              className="font-bold"
              style={{ color: theme.colors.text.primary }}
              accessibilityRole="heading"
              accessibilityLevel={2}
            >
              Personal Details
            </Heading>
            
            <View 
              className="flex-row flex-wrap"
              accessible={true}
              accessibilityRole="list"
              accessibilityLabel="Personal details"
            >
              {person.birthday && (
                <DetailCard
                  label="Birthday"
                  value={formatDate(person.birthday)}
                  theme={theme}
                  icon={Calendar}
                />
              )}

              {person.deathday && (
                <DetailCard
                  label="Date of Death"
                  value={formatDate(person.deathday)}
                  theme={theme}
                />
              )}

              {person.place_of_birth && (
                <DetailCard
                  label="Place of Birth"
                  value={person.place_of_birth}
                  theme={theme}
                  icon={MapPin}
                />
              )}

              <DetailCard
                label="Known For"
                value={person.known_for_department}
                theme={theme}
              />

              {person.also_known_as && person.also_known_as.length > 0 && (
                <View 
                  className="w-full p-4 rounded-xl border mb-2"
                  style={{
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  }}
                >
                  <Text 
                    size="xs"
                    className="mb-2 font-medium"
                    style={{ color: theme.colors.text.tertiary }}
                  >
                    Also Known As
                  </Text>
                  <Text 
                    size="md"
                    className="font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    {person.also_known_as.join(', ')}
                  </Text>
                </View>
              )}
            </View>
          </VStack>

          {/* Movie Credits */}
          {!isLoadingCredits && popularMovies.length > 0 && (
            <MovieCreditsList credits={popularMovies} theme={theme} />
          )}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
} 