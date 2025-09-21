import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/lib/colors';

const { width, height } = Dimensions.get('window');

export const makeStyles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.75,
    height: height,
    backgroundColor: Colors.white,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  sidebarClosed: {
    transform: [{ translateX: -width * 0.75 }],
  },
  sidebarOpen: {
    transform: [{ translateX: 0 }],
  },
  sidebarContent: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  sidebarHeader: {
    marginBottom: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.gray[900],
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.gray[600],
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsList: {
    gap: 12,
  },
  tabItem: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  tabItemActive: {
    backgroundColor: Colors.primary[50],
    borderWidth: 2,
    borderColor: Colors.primary[200],
  },
  tabItemInactive: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  tabIconActive: {
    backgroundColor: Colors.primary[100],
  },
  tabIconInactive: {
    backgroundColor: Colors.gray[100],
  },
  tabTextContainer: {
    flex: 1,
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  tabTitleActive: {
    color: Colors.primary[700],
  },
  tabTitleInactive: {
    color: Colors.gray[700],
  },
  tabDescription: {
    fontSize: 14,
    color: Colors.gray[500],
    lineHeight: 18,
  },
  badge: {
    backgroundColor: Colors.error,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  menuButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 997,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
});