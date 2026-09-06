import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius } from '../theme/spacing';

export interface UploadedFile {
  id: string;
  name: string;
  sizeMB: string;
  type: 'image' | 'pdf' | 'doc';
}

interface DocumentUploaderProps {
  label?: string;
  subLabel?: string;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  label = "Tap to upload documents",
  subLabel = "Supports PDF, JPG, PNG up to 5MB",
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleAddMockFile = () => {
    const mockFiles: UploadedFile[] = [
      { id: Date.now() + '-1', name: 'ID_Proof_Aadhar.jpg', sizeMB: '0.85', type: 'image' },
      { id: Date.now() + '-2', name: 'Allotment_Letter.pdf', sizeMB: '2.10', type: 'pdf' },
    ];
    const newFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    setFiles((prev) => [...prev, newFile]);
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.dropzone} activeOpacity={0.7} onPress={handleAddMockFile}>
        <View style={styles.cloudIconBg}>
          <MaterialIcons name="cloud-upload" size={24} color={colors.onSurfaceVariant} />
        </View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.subLabel}>{subLabel}</Text>
      </TouchableOpacity>

      {files.length > 0 && (
        <View style={styles.fileList}>
          {files.map((file) => (
            <View key={file.id} style={styles.fileCard}>
              <View style={styles.fileInfo}>
                <View style={styles.fileIconBg}>
                  <MaterialIcons
                    name={file.type === 'image' ? 'image' : 'picture-as-pdf'}
                    size={20}
                    color={colors.tertiary}
                  />
                </View>
                <View style={styles.fileTextCol}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {file.name}
                  </Text>
                  <Text style={styles.fileSize}>{file.sizeMB} MB</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => handleRemoveFile(file.id)} style={styles.removeBtn}>
                <MaterialIcons name="close" size={20} color={colors.outlineVariant} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  dropzone: {
    borderWidth: 2,
    borderColor: colors.borderDefault,
    borderStyle: 'dashed',
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cloudIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  label: {
    ...typography.labelMd,
    color: colors.onSurface,
    marginBottom: 4,
  },
  subLabel: {
    ...typography.bodyMd,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  fileList: {
    gap: 8,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  fileIconBg: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileTextCol: {
    flex: 1,
  },
  fileName: {
    ...typography.labelMd,
    color: colors.onSurface,
  },
  fileSize: {
    ...typography.bodyMd,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  removeBtn: {
    padding: 6,
  },
});
