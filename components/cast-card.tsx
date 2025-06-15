import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { VStack } from '@/components/ui/vstack';
import { useTheme } from '@/hooks/use-theme';
import { getImageUrl } from '@/lib/api-config';
import type { CastMember } from '@/types/movie';
import * as React from 'react';
import { Image } from 'react-native';

type Props = {
  cast: CastMember;
  onPress?: (castId: number) => void;
};

// Memoized Cast Card Component
export const CastCard = React.memo(({ cast, onPress }: Props) => {
  const { theme } = useTheme();

  const handlePress = React.useCallback(() => {
    onPress?.(cast.id);
  }, [cast.id, onPress]);

  const imageUri = React.useMemo(() => 
    cast.profile_path ? getImageUrl(cast.profile_path, 'w185') : null,
    [cast.profile_path]
  );

  return (
    <Pressable 
      onPress={handlePress}
      disabled={!onPress}
      style={{
        width: 120,
        marginRight: 12,
      }}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${cast.name} as ${cast.character}`}
      accessibilityHint={onPress ? "Double tap to view actor details" : "Actor information"}
    >
      <VStack className="relative mb-2">
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{ 
              width: 120, 
              height: 160, 
              borderRadius: 12,
              backgroundColor: theme.colors.placeholder.background
            }}
            resizeMode="cover"
            accessible={true}
            accessibilityRole="image"
            accessibilityLabel={`Photo of ${cast.name}`}
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
            <Text className="text-3xl mb-1">👤</Text>
            <Text 
              size="xs"
              className="text-center font-medium"
              style={{ color: theme.colors.placeholder.text }}
            >
              No Photo
            </Text>
          </View>
        )}
        
        {/* Overlay for better text readability */}
        <View 
          className="absolute bottom-0 left-0 right-0 rounded-b-xl p-2"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        >
          <VStack space="xs">
            <Text 
              size="xs"
              className="font-bold text-white text-center"
              numberOfLines={1}
              accessible={true}
              accessibilityRole="text"
            >
              {cast.name}
            </Text>
            <Text 
              size="xs"
              className="text-gray-200 text-center"
              numberOfLines={1}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={`Character: ${cast.character}`}
            >
              {cast.character}
            </Text>
          </VStack>
        </View>
      </VStack>
    </Pressable>
  );
});

CastCard.displayName = 'CastCard'; 