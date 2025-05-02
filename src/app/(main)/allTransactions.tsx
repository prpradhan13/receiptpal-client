import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTransactionStore } from '@/src/store/TransactionStore'
import TransactionList from '@/src/components/home/TransactionList'

const AllTransactionsScreen = () => {
    const { allExpenses } = useTransactionStore();

  return (
    <View className='flex-1 p-4'>
      <FlatList
        data={allExpenses}
        keyExtractor={item => item._id}
        renderItem={({ item }) => <TransactionList transaction={item} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
            <View className='flex-1 justify-center items-center'>
                <Text className='text-[#fff] text-xl font-medium'>No Transactions</Text>
            </View>
        )}
      />
    </View>
  )
}

export default AllTransactionsScreen