import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SudokuPreview() {
  const router = useRouter();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back-sharp" size={38} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sudoku for Thinker</Text>
        <Text style={styles.headerSubtitle}>Enjoy your games</Text>
      </View>

      {/* Preview image */}
      <View style={styles.previewContainer}>
        <Image
          source={require('../../assets/images/games/sudoku.png')}
          style={styles.previewImage}
          resizeMode="cover"
        />
      </View>

      {/* Info */}
      <View style={styles.infoRow}>
        <View style={styles.infoBadge}>
          <Text style={styles.infoBadgeText}>Solo</Text>
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.sectionText}>
          Sudoku is a relaxing number puzzle played on a 9×9 grid. Fill every row, column,
          and 3×3 box with the digits 1–9 without repeating any number. Choose your difficulty
          Easy, Medium, or Hard and challenge yourself to finish as fast as possible.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How to Play</Text>
        <Text style={styles.sectionText}>• Tap an empty cell to select it</Text>
        <Text style={styles.sectionText}>• Type a number 1–9 to fill it in</Text>
        <Text style={styles.sectionText}>• Invalid entries are highlighted in red</Text>
        <Text style={styles.sectionText}>• Fill the whole board correctly to win</Text>
        <Text style={styles.sectionText}>• Your progress is saved automatically</Text>
      </View>

      {/* Difficulty info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Difficulty Levels</Text>
        <View style={styles.diffRow}>
          <View style={[styles.diffBadge, { backgroundColor: '#d4edda' }]}>
            <Text style={[styles.diffText, { color: '#155724' }]}>Easy</Text>
          </View>
          <View style={[styles.diffBadge, { backgroundColor: '#fff3cd' }]}>
            <Text style={[styles.diffText, { color: '#856404' }]}>Medium</Text>
          </View>
          <View style={[styles.diffBadge, { backgroundColor: '#f8d7da' }]}>
            <Text style={[styles.diffText, { color: '#721c24' }]}>Hard</Text>
          </View>
        </View>
      </View>

      {/* Action buttons */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push('/Sudoku' as any)}
        activeOpacity={0.85}
      >
        <Text style={styles.primaryButtonText}>Play Now</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.back()}
        activeOpacity={0.85}
      >
        <Text style={styles.secondaryButtonText}>Back to Games</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginBottom: 8,
  },
  backText: {
    fontSize: 22,
    color: '#333',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  previewContainer: {
    height: 220,
    backgroundColor: '#000',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  infoBadge: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  infoBadgeText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  diffRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  diffBadge: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  diffText: {
    fontSize: 13,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#111',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '500',
  },
});