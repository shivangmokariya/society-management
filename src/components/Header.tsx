import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  logoUrl?: string;
  avatarUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBackPress,
  logoUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBM9_DNXZ8koxKRwegQ0iXsISxUFUcSo5dsm78f9M2vuU8L7Jzit5hOxxuBiwjYfv9PFp7fw_R24DsPbA4Uy4XzzqKEZaBl84NqmQq56mxD99nBxPK21OOZckIwmH_HHoCNcLJcQ5RNP4XUg0ZYYTwxmwNj918Cu4I4RfrlMSyHvNCmnBApd0MW5FTpaxzYibgKkkZWa52QirGm9v80WXPgSyb3uF2jMpacLSmNHM2wDLYvT4K4F-Wo",
  avatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDe_WlUEKszuKTSUFIQK37z347bxAL5xwJsxRtkSYwRzkmk0RmCSXoQSiZH5rx-oFg5_k9Dk-fktyElDjNoLzKk1wjFczNvPRw4UlITNMsMBabLN9dOeV72c0wVgSN5oABclmuVzDLsOr8jQl59fsrXNzHKfE3RdXwXQBfYcjcDzj6EOjL6Hyl5EypDFMye3GdZIJ3rC-Tx0himWPeNxklFSChlGeOmx3e1Va3D4wB7UqUWBC1orzJ2",
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftGroup}>
        {showBack ? (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton} activeOpacity={0.7}>
            <MaterialIcons name="arrow-back" size={24} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        ) : (
          <Image source={{ uri: logoUrl }} style={styles.logo} resizeMode="contain" />
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      {!showBack && (
        <Image source={{ uri: avatarUrl }} style={styles.avatar} resizeMode="cover" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    paddingHorizontal: spacing.containerPaddingMobile,
    backgroundColor: 'rgba(250, 249, 244, 0.9)',
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
