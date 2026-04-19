import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import {useAppTheme} from '../theme/theme';

interface SearchBarProps {
  onSearch: (keyword: string, city: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({onSearch}) => {
  const {colors} = useAppTheme();
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = () => {
    const trimmedKeyword = keyword.trim();
    const trimmedCity = city.trim();
    if (!trimmedKeyword && !trimmedCity) {
      return;
    }
    onSearch(trimmedKeyword, trimmedCity);
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: colors.surface, borderBottomColor: colors.border},
      ]}>
      <View style={styles.row}>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: colors.border,
              backgroundColor: colors.surfaceAlt,
              color: colors.text,
            },
          ]}
          placeholder="Keyword (e.g. music, NBA)"
          placeholderTextColor={colors.textMuted}
          value={keyword}
          onChangeText={setKeyword}
          returnKeyType="search"
          onSubmitEditing={handleSubmit}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={[
            styles.input,
            {
              borderColor: colors.border,
              backgroundColor: colors.surfaceAlt,
              color: colors.text,
            },
          ]}
          placeholder="City (e.g. New York)"
          placeholderTextColor={colors.textMuted}
          value={city}
          onChangeText={setCity}
          returnKeyType="search"
          onSubmitEditing={handleSubmit}
          autoCapitalize="words"
          autoCorrect={false}
        />
      </View>
      <TouchableOpacity
        style={[styles.button, {backgroundColor: colors.primary}]}
        onPress={handleSubmit}
        activeOpacity={0.7}>
        <Text style={styles.buttonText}>Search Events</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#1A73E8',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default SearchBar;
