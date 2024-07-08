import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type RootStackParamList = {
  Search: undefined;
  Detail: {content: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const ItemSeparatorComponent = () => <View style={styles.itemSeperator} />;

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const onEndEditing = () => {
    console.log('onendediting');
    fetch(
      `https://newsapi.org/v2/everything?pageSize=10&page=1&q=${searchTerm}&apiKey=${process.env.API_KEY}`,
    )
      .then(res => res.json())
      .then(json => setData(json));
  };

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={text => setSearchTerm(text)}
        onEndEditing={onEndEditing}
        style={styles.search}
        placeholder="Search for a...."
      />
      <FlatList
        ItemSeparatorComponent={ItemSeparatorComponent}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={data?.articles}
        renderItem={({item}) => (
          <TouchableOpacity
            testID="news-item"
            onPress={() =>
              navigation.navigate('Detail', {content: item.content})
            }
            style={styles.tileContainer}>
            <Text numberOfLines={3} style={styles.tileTitle}>
              {item.title}
            </Text>
            <Image
              resizeMode="cover"
              source={{uri: item.urlToImage}}
              style={styles.image}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const Detail = ({
  route,
}: NativeStackScreenProps<RootStackParamList, 'Detail'>) => {
  return (
    <View>
      <Text>{route.params.content}</Text>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Detail" component={Detail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  itemSeperator: {height: 20},
  container: {paddingTop: 16, backgroundColor: 'white'},
  image: {
    width: '100%',
    flex: 1,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  tileTitle: {
    paddingTop: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  tileContainer: {borderWidth: 2, borderRadius: 8, height: 250},
  list: {marginTop: 16},
  listContent: {paddingHorizontal: 16, paddingBottom: 80},
  search: {
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal: 16,
    height: 56,
    borderRadius: 8,
  },
});
