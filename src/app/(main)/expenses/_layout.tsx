import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router';

const ExpenseDetailsLayout = () => {
  return (
    <Stack>
        <Stack.Screen name='[month]' options={{ headerShown: false }} />
    </Stack>
  )
}

export default ExpenseDetailsLayout;