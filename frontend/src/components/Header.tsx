import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  logoUrl?: string;
  avatarUrl?: string;
  onAvatarPress?: () => void;
}

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBackPress,
  logoUrl,
  avatarUrl,
  onAvatarPress,
}) => {
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  const finalLogo = logoUrl || getImageUrl('/public/assets/logos/society_logo.jpg');
  const finalAvatar = avatarUrl || getImageUrl(user?.avatarUrl || user?.society?.profileAvatarUrl || '/public/assets/avatars/avatar_1.jpg');

  const handleAvatarClick = () => {
    if (onAvatarPress) {
      onAvatarPress();
    } else {
      navigation.navigate('EditProfile');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftGroup}>
        {showBack ? (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton} activeOpacity={0.7}>
            <MaterialIcons name="arrow-back" size={24} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        ) : (
          <Image source={{ uri: finalLogo }} style={styles.logo} resizeMode="contain" />
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      {!showBack && (
        <TouchableOpacity onPress={handleAvatarClick} activeOpacity={0.8}>
          <Image source={{ uri: finalAvatar }} style={styles.avatar} resizeMode="cover" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: STATUSBAR_HEIGHT,
    height: 64 + STATUSBAR_HEIGHT,
    paddingHorizontal: spacing.containerPaddingMobile,
    backgroundColor: 'rgba(250, 249, 244, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 58, 61, 0.04)',
    zIndex: 50,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    height: 32,
    width: 32,
  },
  backButton: {
    padding: 4,
    marginRight: 4,
  },
  title: {
    ...typography.headlineMd,
    color: colors.primary,
    fontWeight: '600',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.surfaceContainer,
  },
});
