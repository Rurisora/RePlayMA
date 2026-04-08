import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
// Calculate card size: (Screen Width - (Left Padding + Right Padding + Gap)) / 2
const CARD_SIZE = (width - (20 * 2 + 15)) / 2;

const GAMES = [
  { id: 'checker', name: 'Checker', image: require('../../assets/images/games/checker.png'), route: '/GameHomePage/checkerpreview' },
  { id: 'sudoku_n', name: 'Sudoku', image: require('../../assets/images/games/sudoku.png'), route: '/GameHomePage/sudokupreview' },
  { id: 'chess', name: 'Chess', image: require('../../assets/images/games/chess.png'), route: '/GameHomePage/chesspreview' },
  { id: 'whackamole', name: 'Whack-a-mole', image: require('../../assets/images/games/whackamole.png'), route: '/GameHomePage/whackamole' },
];

export default function GameHomePageIndex() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header - Centered as per screenshot */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to our{'\n'}Entertainment</Text>
          <Text style={styles.subtitle}>Enjoy your stay</Text>
        </View>

        {/* Recent Section */}
        <Text style={styles.sectionLabel}>Recent</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentRow}>
          {GAMES.slice(0, 2).map((game) => (
            <TouchableOpacity
              key={game.id}
              style={styles.recentCard}
              onPress={() => router.push(game.route as any)}
            >
              <Image source={game.image} style={styles.fullImage} />
              <View style={styles.recentOverlay}>
                <Text style={styles.recentName}>{game.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* All Games Grid - Squares filling the width */}
        <Text style={styles.sectionLabel}>All games</Text>
        <View style={styles.grid}>
          {GAMES.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={styles.gridCard}
              onPress={() => router.push(game.route as any)}
            >
              <Image source={game.image} style={styles.fullImage} />
              <View style={styles.pillOverlay}>
                <Text style={styles.gridName}>{game.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scroll: {
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
    lineHeight: 36,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#AAA',
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  recentRow: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  recentCard: {
    width: width * 0.44,
    height: 120,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  gridCard: {
    width: CARD_SIZE,
    height: CARD_SIZE, // Makes it a perfect square
    borderRadius: 30, // Extra rounded as per screenshot
    marginBottom: 15,
    overflow: 'hidden',
    backgroundColor: '#eee',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  fullImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  recentOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
  },
  pillOverlay: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    backgroundColor: 'rgba(40,40,40,0.7)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: '70%',
  },
  recentName: { color: '#fff', fontSize: 12, fontWeight: '700' },
  recentTime: { color: '#ddd', fontSize: 10 },
  gridName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});