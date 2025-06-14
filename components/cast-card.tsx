import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useTheme } from '@/hooks/use-theme';
import { getImageUrl } from '@/lib/api-config';
import type { CastMember } from '@/types/movie';
import * as React from 'react';
import { Image, TouchableOpacity } from 'react-native';

type Props = {
  cast: CastMember;
  onPress?: (castId: number) => void;
};

export function CastCard({ cast, onPress }: Props) {
  const { theme } = useTheme();

  const handlePress = React.useCallback(() => {
    onPress?.(cast.id);
  }, [cast.id, onPress]);

  const imageUri = cast.profile_path 
    ? getImageUrl(cast.profile_path, 'w185')
    : null;

  return (
    <TouchableOpacity 
      onPress={handlePress}
      disabled={!onPress}
      style={{
        width: 120,
        marginRight: 12,
      }}
    >
      {/* Profile Image */}
      <View style={{ position: 'relative', marginBottom: 8 }}>
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
          />
        ) : (
          <View style={{ 
            width: 120, 
            height: 160, 
            backgroundColor: theme.colors.placeholder.background,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: theme.colors.border,
            borderStyle: 'dashed'
          }}>
            <Text style={{ fontSize: 32, marginBottom: 4 }}>👤</Text>
            <Text style={{ 
              fontSize: 10, 
              color: theme.colors.placeholder.text, 
              textAlign: 'center', 
              fontWeight: '500' 
            }}>
              No Photo
            </Text>
          </View>
        )}
        
        {/* Overlay for better text readability */}
        <View 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            padding: 8,
          }}
        >
          <Text 
            style={{ 
              fontSize: 12, 
              fontWeight: 'bold', 
              color: '#fff',
              textAlign: 'center'
            }}
            numberOfLines={1}
          >
            {cast.name}
          </Text>
          <Text 
            style={{ 
              fontSize: 10, 
              color: '#e5e5e5',
              textAlign: 'center',
              marginTop: 2
            }}
            numberOfLines={1}
          >
            {cast.character}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
} 