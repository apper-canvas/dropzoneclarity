import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const DropZone = ({ onFilesDrop, acceptedTypes = [], maxSize, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleFiles = (files) => {
    if (onFilesDrop) {
      onFilesDrop(files);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatAcceptedTypes = () => {
    if (acceptedTypes.length === 0) return 'All file types';
    return acceptedTypes.join(', ').toUpperCase();
  };

  const formatMaxSize = () => {
    if (!maxSize) return '';
    const mb = maxSize / (1024 * 1024);
    return `Max size: ${mb}MB`;
  };

  return (
    <motion.div
      layout
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative max-w-full overflow-hidden"
    >
      <motion.div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        whileHover={disabled ? {} : { scale: 1.02 }}
        whileTap={disabled ? {} : { scale: 0.98 }}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 cursor-pointer
          min-h-[280px] flex flex-col items-center justify-center
          ${isDragging 
            ? 'border-primary bg-gradient-to-br from-primary/10 to-secondary/10 shadow-lg' 
            : 'border-surface-300 hover:border-primary/50 hover:bg-surface-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Background gradient overlay when dragging */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-primary opacity-5 rounded-2xl"
            />
          )}
        </AnimatePresence>

        {/* Ripple effect on hover */}
        <AnimatePresence>
          {isHovering && !isDragging && (
            <motion.div
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 rounded-2xl bg-gradient-primary"
            />
          )}
        </AnimatePresence>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          accept={acceptedTypes.join(',')}
          className="hidden"
          disabled={disabled}
        />

        <motion.div
          animate={isDragging ? { scale: 1.1, rotate: 10 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.2 }}
          className="mb-4"
        >
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center
            ${isDragging 
              ? 'bg-gradient-primary text-white shadow-lg' 
              : 'bg-surface-100 text-surface-400'
            }
            transition-all duration-200
          `}>
            <ApperIcon 
              name={isDragging ? "Upload" : "FolderPlus"} 
              size={32}
            />
          </div>
        </motion.div>

        <motion.div
          animate={isDragging ? { y: -5 } : { y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Text 
            variant="heading" 
            size="xl" 
            weight="semibold" 
            className="mb-2"
            color={isDragging ? "primary" : "default"}
          >
            {isDragging ? "Drop files here" : "Drag & drop files here"}
          </Text>
          
          <Text 
            variant="body" 
            size="base" 
            color="muted" 
            className="mb-4"
          >
            or click to browse files
          </Text>

          <div className="space-y-1">
            <Text variant="caption" size="sm" color="light">
              {formatAcceptedTypes()}
            </Text>
            {maxSize && (
              <Text variant="caption" size="sm" color="light">
                {formatMaxSize()}
              </Text>
            )}
          </div>
        </motion.div>

        {/* Pulse animation when dragging */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 border-2 border-primary rounded-2xl pointer-events-none"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default DropZone;