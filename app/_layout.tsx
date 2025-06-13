import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import React from 'react';
import { Image, SafeAreaView, Text } from 'react-native';
import '../global.css';

export default function _layout() {
  return (
    <GluestackUIProvider mode="light">
      <SafeAreaView>
        <Text className='text-red-500 text-2xl font-bold'>Hello1</Text>

        <Image
          style={{
            width: 100,
            height: 100,
          }}
          source={{
            uri: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          }}
          alt="image"
        />
      </SafeAreaView>
    </GluestackUIProvider>
    
  )
}