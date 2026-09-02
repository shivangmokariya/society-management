import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius } from '../theme/spacing';

interface SuccessOverlayProps {
  visible: boolean;
  title: string;
  description: string;
  buttonText: string;
  onButtonPress: () => void;
  secondaryButtonText?: string;
  onSecondaryButtonPress?: () => void;
}

export const SuccessOverlay: React.FC<SuccessOverlayProps> = ({
  visible,
  title,
  description,
  buttonText,
  onButtonPress,
  secondaryButtonText = 'Back to Dashboard',
  onSecondaryButtonPress,
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="check-circle" size={48} color={colors.onPrimaryContainer} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onButtonPress}>
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>

            {!!onSecondaryButtonPress && (
              <TouchableOpacity
                style={styles.secondaryButton}
                activeOpacity={0.8}
                onPress={onSecondaryButtonPress}
              >
                <MaterialIcons name="dashboard" size={18} color={colors.onPrimary} style={{ marginRight: 6 }} />
                <Text style={styles.secondaryButtonText}>{secondaryButtonText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 340,
    width: '100%',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: 'rgba(51, 58, 61, 0.08)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
    alignItems: 'stretch',
  },
  button: {
    paddingHorizontal: 24,
    height: 48,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...typography.labelMd,
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  secondaryButton: {
    paddingHorizontal: 24,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(63, 102, 81, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 2,
  },
  secondaryButtonText: {
    ...typography.labelMd,
    color: colors.onPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
