import React from 'react';
import { View } from 'react-native';
import { MovieSkeleton } from './movie-skeleton';

type Props = {
  count?: number;
};

export function MovieSkeletonList({ count = 8 }: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 16,
      }}
    >
      {Array.from({ length: count }, (_, index) => (
        <MovieSkeleton key={index} />
      ))}
    </View>
  );
} 