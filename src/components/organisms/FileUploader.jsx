import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import DropZone from '@/components/molecules/DropZone';
import FileCard from '@/components/molecules/FileCard';
import FileTypeFilter from '@/components/molecules/FileTypeFilter';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import ProgressBar from '@/components/atoms/ProgressBar';
import ApperIcon from '@/components/ApperIcon';
import uploadFileService from '@/services/api/uploadFileService';
import uploadSessionService from '@/services/api/uploadSessionService';

const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const [uploadSession, setUploadSession] = useState(null);
  const [selectedFileTypes, setSelectedFileTypes] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Configuration
  const maxFileSize = 50 * 1024 * 1024; // 50MB
  const allowedExtensions = {
    images: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    documents: ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
    videos: ['.mp4', '.avi', '.mov', '.wmv', '.webm'],
    audio: ['.mp3', '.wav', '.ogg', '.m4a'],
    archives: ['.zip', '.rar', '.7z', '.tar']
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await uploadFileService.getAll();
      setFiles(result);
    } catch (err) {
      setError(err.message || 'Failed to load files');
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const getAcceptedTypes = () => {
    if (selectedFileTypes.length === 0) return [];
    
    let extensions = [];
    selectedFileTypes.forEach(type => {
      if (allowedExtensions[type]) {
        extensions = [...extensions, ...allowedExtensions[type]];
      }
    });
    
    return extensions;
  };

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxFileSize) {
      return `File "${file.name}" is too large. Maximum size is ${maxFileSize / (1024 * 1024)}MB.`;
    }

    // Check file type if filters are applied
    const acceptedTypes = getAcceptedTypes();
    if (acceptedTypes.length > 0) {
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      if (!acceptedTypes.includes(extension)) {
        return `File type "${extension}" is not allowed.`;
      }
    }

    return null;
  };

  const createFilePreview = (file) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const handleFilesDrop = async (droppedFiles) => {
    if (isUploading) {
      toast.warning('Please wait for current upload to complete');
      return;
    }

    const validFiles = [];
    const errors = [];

    for (const file of droppedFiles) {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    }

    // Show validation errors
    errors.forEach(error => toast.error(error));

    if (validFiles.length === 0) return;

    try {
      // Create file records
      const newFiles = [];
      for (const file of validFiles) {
        const preview = createFilePreview(file);
        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          preview: preview
        };
        
        const createdFile = await uploadFileService.create(fileData);
        newFiles.push(createdFile);
      }

      setFiles(prev => [...prev, ...newFiles]);
      
      // Create upload session if not exists
      if (!uploadSession) {
        const session = await uploadSessionService.create({
          totalFiles: newFiles.length,
          totalSize: newFiles.reduce((sum, f) => sum + f.size, 0),
          uploadedSize: 0,
          overallProgress: 0
        });
        setUploadSession(session);
      } else {
        // Update existing session
        const updatedSession = await uploadSessionService.update(uploadSession.Id, {
          totalFiles: uploadSession.totalFiles + newFiles.length,
          totalSize: uploadSession.totalSize + newFiles.reduce((sum, f) => sum + f.size, 0)
        });
        setUploadSession(updatedSession);
      }

      toast.success(`${newFiles.length} file(s) added to queue`);
    } catch (err) {
      toast.error('Failed to add files to queue');
    }
  };

  const handleFileRemove = async (fileId) => {
    try {
      await uploadFileService.delete(fileId);
      setFiles(prev => prev.filter(f => f.Id !== fileId));
      toast.success('File removed from queue');
    } catch (err) {
      toast.error('Failed to remove file');
    }
  };

  const handleFileCancel = async (fileId) => {
    try {
      await uploadFileService.update(fileId, { status: 'cancelled' });
      setFiles(prev => prev.map(f => 
        f.Id === fileId ? { ...f, status: 'cancelled' } : f
      ));
      toast.warning('Upload cancelled');
    } catch (err) {
      toast.error('Failed to cancel upload');
    }
  };

  const updateSessionProgress = async () => {
    if (!uploadSession) return;

    const currentFiles = await uploadFileService.getAll();
    const totalSize = currentFiles.reduce((sum, f) => sum + f.size, 0);
    const uploadedSize = currentFiles.reduce((sum, f) => {
      if (f.status === 'completed') return sum + f.size;
      if (f.status === 'uploading') return sum + (f.size * f.progress / 100);
      return sum;
    }, 0);
    
    const overallProgress = totalSize > 0 ? Math.round((uploadedSize / totalSize) * 100) : 0;

    const updatedSession = await uploadSessionService.update(uploadSession.Id, {
      uploadedSize,
      overallProgress,
      status: overallProgress === 100 ? 'completed' : 'active'
    });

    setUploadSession(updatedSession);
  };

  const startUpload = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) {
      toast.warning('No files to upload');
      return;
    }

    setIsUploading(true);
    
    try {
      // Upload files sequentially
      for (const file of pendingFiles) {
        if (file.status === 'cancelled') continue;
        
        await uploadFileService.simulateUpload(file.Id, async (progress) => {
          // Update file progress
          const updatedFile = await uploadFileService.getById(file.Id);
          setFiles(prev => prev.map(f => 
            f.Id === file.Id ? updatedFile : f
          ));
          
          // Update session progress
          await updateSessionProgress();
        });
        
        // Update file list
        const updatedFile = await uploadFileService.getById(file.Id);
        setFiles(prev => prev.map(f => 
          f.Id === file.Id ? updatedFile : f
        ));
      }

      // Final session update
      await updateSessionProgress();
      
      // Show celebration
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
      
      toast.success('All files uploaded successfully!');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const clearAll = async () => {
    try {
      await uploadFileService.clear();
      setFiles([]);
      setUploadSession(null);
      toast.success('All files cleared');
    } catch (err) {
      toast.error('Failed to clear files');
    }
  };

  const pendingFiles = files.filter(f => f.status === 'pending');
  const uploadingFiles = files.filter(f => f.status === 'uploading');
  const completedFiles = files.filter(f => f.status === 'completed');
  const overallProgress = uploadSession?.overallProgress || 0;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-surface-200 rounded-2xl"></div>
          <div className="h-20 bg-surface-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="text-center mb-8">
        <Text variant="display" size="3xl" weight="bold" className="mb-2">
          DropZone
        </Text>
        <Text variant="body" size="lg" color="muted">
          Upload files quickly and reliably with visual feedback
        </Text>
      </div>

      {/* File Type Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full sm:w-64">
          <FileTypeFilter 
            selectedTypes={selectedFileTypes}
            onTypesChange={setSelectedFileTypes}
          />
        </div>
        
        {files.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon="Trash2"
              onClick={clearAll}
              disabled={isUploading}
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Drop Zone */}
      <DropZone
        onFilesDrop={handleFilesDrop}
        acceptedTypes={getAcceptedTypes()}
        maxSize={maxFileSize}
        disabled={isUploading}
      />

      {/* Overall Progress */}
      {uploadSession && files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-surface-200"
        >
          <div className="flex items-center justify-between mb-4">
            <Text variant="heading" size="lg" weight="semibold">
              Upload Progress
            </Text>
            <Text variant="body" color="muted">
              {completedFiles.length} of {files.length} files completed
            </Text>
          </div>
          
          <ProgressBar 
            progress={overallProgress}
            showPercentage={true}
            showStripes={isUploading}
            animated={isUploading}
            size="lg"
            color="primary"
          />
        </motion.div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Text variant="heading" size="lg" weight="semibold">
              Files ({files.length})
            </Text>
            
            {pendingFiles.length > 0 && (
              <Button
                variant="primary"
                icon="Upload"
                onClick={startUpload}
                disabled={isUploading}
                loading={isUploading}
              >
                Upload {pendingFiles.length} File{pendingFiles.length !== 1 ? 's' : ''}
              </Button>
            )}
          </div>

          <AnimatePresence mode="popLayout">
            {files.map((file) => (
              <FileCard
                key={file.Id}
                file={file}
                onRemove={handleFileRemove}
                onCancel={handleFileCancel}
                showPreview={true}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {files.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Upload" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
          </motion.div>
          <Text variant="heading" size="lg" weight="medium" className="mb-2">
            Ready to upload files
          </Text>
          <Text variant="body" color="muted">
            Drag and drop files or click the zone above to get started
          </Text>
        </motion.div>
      )}

      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            {/* Confetti particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 1 }}
                animate={{ 
                  y: [0, window.innerHeight],
                  x: [0, (Math.random() - 0.5) * 200],
                  rotate: [0, 720],
                  opacity: [1, 0]
                }}
                transition={{ 
                  duration: 3,
                  delay: i * 0.1,
                  ease: 'easeOut'
                }}
                className={`
                  absolute w-4 h-4 rounded-full
                  ${['bg-primary', 'bg-secondary', 'bg-accent', 'bg-success'][i % 4]}
                  confetti
                `}
                style={{
                  left: `${50 + (Math.random() - 0.5) * 20}%`,
                  top: '10%'
                }}
              />
            ))}
            
            {/* Success message */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4"
            >
              <div className="w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="CheckCircle" size={32} className="text-white" />
              </div>
              <Text variant="heading" size="xl" weight="bold" className="mb-2">
                Upload Complete!
              </Text>
              <Text variant="body" color="muted">
                All files have been uploaded successfully
              </Text>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploader;