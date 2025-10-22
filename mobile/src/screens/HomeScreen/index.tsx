import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Heart, Star, Bell, Settings, Plus, Trash2, Edit, Share2} from 'lucide-react-native';
import {Layout} from '@/components/Layout';
import {
  Button,
  Text,
  Input,
  Spinner,
  Spacer,
  Divider,
  Badge,
  Card,
  ListItem,
  SearchBar,
  Avatar,
  Chip,
  IconButton,
} from '@/components';
import {styles} from './styles';
import {theme} from '@/theme';

export function HomeScreen() {
  const [searchText, setSearchText] = useState('');
  const [inputValue, setInputValue] = useState('');

  return (
    <Layout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <Text variant="h1" align="center">
          Component Library
        </Text>
        <Spacer size="sm" />
        <Text variant="body" color="textSecondary" align="center">
          Examples of all available components
        </Text>
        <Spacer size="lg" />

        {/* Buttons Section */}
        <Card padding="medium">
          <Text variant="h3">Buttons</Text>
          <Spacer size="md" />
          <Button title="Primary Button" onPress={() => {}} />
          <Spacer size="sm" />
          <Button title="Secondary Button" onPress={() => {}} variant="secondary" />
          <Spacer size="sm" />
          <Button title="Outline Button" onPress={() => {}} variant="outline" />
          <Spacer size="sm" />
          <Button title="Ghost Button" onPress={() => {}} variant="ghost" />
          <Spacer size="sm" />
          <View style={styles.row}>
            <Button title="Small" onPress={() => {}} size="small" />
            <Spacer size="sm" horizontal />
            <Button title="Medium" onPress={() => {}} size="medium" />
            <Spacer size="sm" horizontal />
            <Button title="Large" onPress={() => {}} size="large" />
          </View>
          <Spacer size="sm" />
          <Button title="Loading" onPress={() => {}} loading />
          <Spacer size="sm" />
          <Button title="Disabled" onPress={() => {}} disabled />
        </Card>

        <Spacer size="lg" />

        {/* Text Section */}
        <Card padding="medium">
          <Text variant="h3">Typography</Text>
          <Spacer size="md" />
          <Text variant="h1">Heading 1</Text>
          <Spacer size="xs" />
          <Text variant="h2">Heading 2</Text>
          <Spacer size="xs" />
          <Text variant="h3">Heading 3</Text>
          <Spacer size="xs" />
          <Text variant="body">Body text - Regular paragraph text</Text>
          <Spacer size="xs" />
          <Text variant="caption" color="textSecondary">
            Caption text - Small secondary text
          </Text>
          <Spacer size="md" />
          <Text variant="body" color="primary">
            Primary Color
          </Text>
          <Text variant="body" color="error">
            Error Color
          </Text>
          <Text variant="body" color="success">
            Success Color
          </Text>
        </Card>

        <Spacer size="lg" />

        {/* Input Section */}
        <Card padding="medium">
          <Text variant="h3">Input Fields</Text>
          <Spacer size="md" />
          <Input placeholder="Enter text..." value={inputValue} onChangeText={setInputValue} />
          <Spacer size="md" />
          <Input
            placeholder="With clear button"
            value={inputValue}
            onChangeText={setInputValue}
            showClearButton
            onClear={() => setInputValue('')}
          />
          <Spacer size="md" />
          <Input placeholder="Disabled input" editable={false} />
        </Card>

        <Spacer size="lg" />

        {/* Search Bar Section */}
        <Card padding="medium">
          <Text variant="h3">Search Bar</Text>
          <Spacer size="md" />
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search..."
            showCancelButton
            onCancel={() => setSearchText('')}
          />
        </Card>

        <Spacer size="lg" />

        {/* Avatars Section */}
        <Card padding="medium">
          <Text variant="h3">Avatars</Text>
          <Spacer size="md" />
          <View style={styles.row}>
            <Avatar initials="JD" size="small" />
            <Spacer size="md" horizontal />
            <Avatar initials="AB" size="medium" />
            <Spacer size="md" horizontal />
            <Avatar initials="XY" size="large" showOnlineIndicator />
          </View>
        </Card>

        <Spacer size="lg" />

        {/* Badges Section */}
        <Card padding="medium">
          <Text variant="h3">Badges</Text>
          <Spacer size="md" />
          <View style={styles.row}>
            <Badge count={5} />
            <Spacer size="md" horizontal />
            <Badge count={99} color="primary" />
            <Spacer size="md" horizontal />
            <Badge count={150} maxCount={99} color="success" />
            <Spacer size="md" horizontal />
            <Badge count={0} showZero color="warning" />
          </View>
        </Card>

        <Spacer size="lg" />

        {/* Chips Section */}
        <Card padding="medium">
          <Text variant="h3">Chips</Text>
          <Spacer size="md" />
          <View style={styles.chipContainer}>
            <Chip label="Default" />
            <Spacer size="sm" horizontal />
            <Chip label="Primary" variant="primary" />
            <Spacer size="sm" horizontal />
            <Chip label="Secondary" variant="secondary" />
          </View>
          <Spacer size="sm" />
          <View style={styles.chipContainer}>
            <Chip label="Outlined" variant="outlined" />
            <Spacer size="sm" horizontal />
            <Chip label="Closeable" onClose={() => {}} />
            <Spacer size="sm" horizontal />
            <Chip label="Clickable" onPress={() => {}} variant="primary" />
          </View>
        </Card>

        <Spacer size="lg" />

        {/* Icon Buttons Section */}
        <Card padding="medium">
          <Text variant="h3">Icon Buttons</Text>
          <Spacer size="md" />
          <Text variant="caption" color="textSecondary">
            Different Sizes
          </Text>
          <Spacer size="sm" />
          <View style={styles.row}>
            <IconButton
              icon={<Heart size={16} color="#FFF" />}
              onPress={() => {}}
              size="small"
            />
            <Spacer size="md" horizontal />
            <IconButton
              icon={<Star size={20} color="#FFF" />}
              onPress={() => {}}
              size="medium"
            />
            <Spacer size="md" horizontal />
            <IconButton
              icon={<Bell size={24} color="#FFF" />}
              onPress={() => {}}
              size="large"
            />
          </View>
          <Spacer size="md" />
          <Text variant="caption" color="textSecondary">
            Different Variants
          </Text>
          <Spacer size="sm" />
          <View style={styles.row}>
            <IconButton
              icon={<Plus size={20} color="#FFF" />}
              onPress={() => {}}
              variant="primary"
            />
            <Spacer size="md" horizontal />
            <IconButton
              icon={<Share2 size={20} color="#FFF" />}
              onPress={() => {}}
              variant="secondary"
            />
            <Spacer size="md" horizontal />
            <IconButton
              icon={<Edit size={20} color={theme.colors.primary} />}
              onPress={() => {}}
              variant="outline"
            />
            <Spacer size="md" horizontal />
            <IconButton
              icon={<Trash2 size={20} color={theme.colors.error} />}
              onPress={() => {}}
              variant="ghost"
            />
          </View>
          <Spacer size="md" />
          <Text variant="caption" color="textSecondary">
            Non-circular
          </Text>
          <Spacer size="sm" />
          <View style={styles.row}>
            <IconButton
              icon={<Settings size={20} color="#FFF" />}
              onPress={() => {}}
              circular={false}
            />
          </View>
        </Card>

        <Spacer size="lg" />

        {/* Spinner Section */}
        <Card padding="medium">
          <Text variant="h3">Spinners</Text>
          <Spacer size="md" />
          <View style={styles.row}>
            <Spinner size="small" />
            <Spacer size="lg" horizontal />
            <Spinner size="medium" />
            <Spacer size="lg" horizontal />
            <Spinner size="large" />
          </View>
        </Card>

        <Spacer size="lg" />

        {/* List Items Section */}
        <Card padding="none">
          <View style={styles.cardHeader}>
            <Text variant="h3">List Items</Text>
          </View>
          <Divider />
          <ListItem title="Simple List Item" onPress={() => {}} rightAccessory="arrow" />
          <Divider />
          <ListItem title="With Subtitle" subtitle="This is a subtitle" onPress={() => {}} />
          <Divider />
          <ListItem
            title="With Left Icon"
            subtitle="And a subtitle too"
            leftIcon={<View style={styles.iconPlaceholder} />}
            onPress={() => {}}
          />
          <Divider />
          <ListItem
            title="With Right Text"
            rightAccessory="text"
            rightText="Detail"
            onPress={() => {}}
          />
          <Divider />
          <ListItem
            title="With Badge"
            rightAccessory="component"
            rightComponent={<Badge count={5} />}
            onPress={() => {}}
          />
        </Card>

        <Spacer size="lg" />

        {/* Cards Section */}
        <Text variant="h3">Cards</Text>
        <Spacer size="md" />
        <Card padding="medium" shadow="small">
          <Text variant="body">Card with small shadow</Text>
        </Card>
        <Spacer size="sm" />
        <Card padding="medium" shadow="medium">
          <Text variant="body">Card with medium shadow</Text>
        </Card>
        <Spacer size="sm" />
        <Card padding="large" shadow="large">
          <Text variant="body">Card with large shadow and padding</Text>
        </Card>
        <Spacer size="sm" />
        <Card padding="medium" border>
          <Text variant="body">Card with border (default color)</Text>
        </Card>
        <Spacer size="sm" />
        <Card padding="medium" border borderColor="#007AFF" borderWidth={2}>
          <Text variant="body">Card with custom blue border</Text>
        </Card>
        <Spacer size="sm" />
        <Card padding="medium" shadow="large" border borderColor="#34C759">
          <Text variant="body">Card with shadow and green border</Text>
        </Card>
        <Spacer size="sm" />
        <Card padding="medium" shadow="none" border borderColor="#FF3B30" borderWidth={3}>
          <Text variant="body">Card with thick red border, no shadow</Text>
        </Card>
        <Spacer size="sm" />
        <Card padding="medium" onPress={() => {}}>
          <Text variant="body">Clickable Card - Tap me!</Text>
        </Card>

        <Spacer size="xxl" />
      </ScrollView>
    </Layout>
  );
}
