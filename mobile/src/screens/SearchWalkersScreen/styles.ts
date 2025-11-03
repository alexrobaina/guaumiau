import {StyleSheet} from 'react-native';
import {theme} from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  mapContainer: {
    height: '50%',
  },
  map: {
    flex: 1,
  },
  bottomPanel: {
    height: '50%',
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  pullHandle: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handleBar: {
    width: 48,
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  walkersList: {
    marginTop: 16,
  },
  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  walkerMarkerContainer: {
    alignItems: 'center',
  },
  walkerMarker: {
    width: 40,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walkerMarkerPin: {
    width: 32,
    height: 40,
    backgroundColor: '#FF8C42',
    borderRadius: 16,
    borderBottomLeftRadius: 0,
    transform: [{rotate: '45deg'}],
    position: 'absolute',
  },
  walkerMarkerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    zIndex: 1,
  },
  selectedMarker: {
    transform: [{scale: 1.2}],
  },
  selectedMarkerPin: {
    backgroundColor: '#FF6B35',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
  },
});
