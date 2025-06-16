import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import ProgressBar from '@/components/atoms/ProgressBar';

const FileCard = ({ 
  file, 
  onRemove, 
  onCancel,
  showPreview = true,
  className = '' 
}) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimeRemaining = (seconds) => {
    if (!seconds || seconds === 0) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (mins > 0) {
      return `${mins}m ${secs}s remaining`;
    }
    return `${secs}s remaining`;
  };

  const formatUploadSpeed = (bytesPerSecond) => {
    if (!bytesPerSecond || bytesPerSecond === 0) return '';
    const mbps = bytesPerSecond / (1024 * 1024);
    return `${mbps.toFixed(1)} MB/s`;
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return 'Image';
    if (type.startsWith('video/')) return 'Video';
    if (type.startsWith('audio/')) return 'Music';
    if (type.includes('pdf')) return 'FileText';
    if (type.includes('document') || type.includes('word')) return 'FileText';
    if (type.includes('spreadsheet') || type.includes('excel')) return 'FileSpreadsheet';
    if (type.includes('zip') || type.includes('rar')) return 'Archive';
    return 'File';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'uploading': return 'primary';
      case 'error': return 'error';
      case 'cancelled': return 'warning';
      default: return 'primary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'uploading': return 'Upload';
      case 'error': return 'AlertCircle';
      case 'cancelled': return 'XCircle';
      default: return 'Clock';
    }
  };

  const canRemove = file.status === 'pending' || file.status === 'error' || file.status === 'completed';
  const canCancel = file.status === 'uploading';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className={`
        bg-white rounded-xl p-4 shadow-sm border border-surface-200 
        glass hover:shadow-md hover:border-primary/30
        transition-all duration-200 max-w-full overflow-hidden
        ${className}
      `}
    >
      <div className="flex items-start space-x-4 min-w-0">
        {/* File Icon/Preview */}
        <div className="flex-shrink-0">
          {showPreview && file.preview && file.type.startsWith('image/') ? (
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-100">
              <img 
                src={file.preview} 
                alt={file.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-lg bg-surface-100 flex items-center justify-center">
              <ApperIcon 
                name={getFileIcon(file.type)} 
                size={24} 
                className="text-surface-500"
              />
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="min-w-0 flex-1">
              <Text 
                variant="body" 
                weight="medium" 
                className="break-words"
                title={file.name}
              >
                {file.name}
              </Text>
              <Text variant="caption" size="sm" color="muted">
                {formatFileSize(file.size)} • {file.type.split('/')[1]?.toUpperCase() || 'Unknown'}
              </Text>
            </div>

            {/* Status indicator */}
            <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
              <ApperIcon 
                name={getStatusIcon(file.status)} 
                size={16}
                className={`text-${getStatusColor(file.status)}`}
              />
              {(canRemove || canCancel) && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={canCancel ? "X" : "Trash2"}
                  onClick={canCancel ? () => onCancel?.(file.Id) : () => onRemove?.(file.Id)}
                  className="text-surface-400 hover:text-error p-1"
                />
              )}
            </div>
          </div>

          {/* Progress bar for uploading files */}
          {file.status === 'uploading' && (
            <div className="mb-2">
              <ProgressBar 
                progress={file.progress} 
                showPercentage={false}
                showStripes={true}
                animated={true}
                color="primary"
              />
            </div>
          )}

          {/* Upload details */}
          {file.status === 'uploading' && (
            <div className="flex items-center justify-between text-xs">
              <Text variant="caption" size="sm" color="muted">
                {file.progress}%
              </Text>
              <div className="flex items-center space-x-3">
                {file.uploadSpeed > 0 && (
                  <Text variant="caption" size="sm" color="muted">
                    {formatUploadSpeed(file.uploadSpeed * 1024 * 1024)}
                  </Text>
                )}
                {file.timeRemaining > 0 && (
                  <Text variant="caption" size="sm" color="muted">
                    {formatTimeRemaining(file.timeRemaining)}
                  </Text>
                )}
              </div>
            </div>
          )}

          {/* Status messages */}
          {file.status === 'completed' && (
            <Text variant="caption" size="sm" color="success">
              Upload completed
            </Text>
          )}
          
          {file.status === 'error' && (
            <Text variant="caption" size="sm" color="error">
              Upload failed
            </Text>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FileCard;