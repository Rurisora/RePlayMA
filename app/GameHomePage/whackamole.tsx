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

export default function WhackAMolePreview() {
  const router = useRouter();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back-sharp" size={38} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Whack a Mole</Text>
        <Text style={styles.headerSubtitle}>Enjoy your games</Text>
      </View>

      {/* Preview image */}
      <View style={styles.previewContainer}>
        <Image
          source={require('../../assets/images/games/whackamole.png')}
          style={styles.previewImage}
          resizeMode="cover"
        />
      </View>

      {/* Info */}
      <View style={styles.infoRow}>
        <View style={styles.infoBadge}>
          <Text style={styles.infoBadgeText}>Player Count:</Text>
        </View>
        <View style={styles.infoBadge}>
          <Text style={styles.infoBadgeText}>• 1 Player</Text>
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.sectionText}>
          Whack-a-Mole is a fast-paced reaction game where moles pop up randomly from holes on a
          grid. Tap them as fast as you can before they disappear! Score points for every hit and
          try to beat your high score. Great for sharpening your reflexes.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How to Play</Text>
        <Text style={styles.sectionText}>• Watch for moles popping up on the grid</Text>
        <Text style={styles.sectionText}>• Tap a mole quickly to score a point</Text>
        <Text style={styles.sectionText}>• Moles disappear after a short time</Text>
        <Text style={styles.sectionText}>• Hitting 100 point to win</Text>
      </View>

      {/* Action buttons */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push('/WhackAMole')}
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
    flexDirection: 'column',
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