import { StyleSheet } from 'react-native';

export const makeStyles = () => StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  description: {
    color: '#555',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  howToUse: {
    color: '#555',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    maxWidth: 300,
    width: '100%',
  },
  statusContainer: {
    marginTop: 32,
  },
  status: {
    color: '#666',
    fontSize: 14,
  },
});