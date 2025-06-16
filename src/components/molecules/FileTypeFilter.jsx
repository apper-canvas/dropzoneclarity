import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const FileTypeFilter = ({ 
  selectedTypes = [], 
  onTypesChange, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const fileTypes = [
    { key: 'all', label: 'All Files', extensions: [], icon: 'File' },
    { key: 'images', label: 'Images', extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'], icon: 'Image' },
    { key: 'documents', label: 'Documents', extensions: ['.pdf', '.doc', '.docx', '.txt', '.rtf'], icon: 'FileText' },
    { key: 'videos', label: 'Videos', extensions: ['.mp4', '.avi', '.mov', '.wmv', '.webm'], icon: 'Video' },
    { key: 'audio', label: 'Audio', extensions: ['.mp3', '.wav', '.ogg', '.m4a'], icon: 'Music' },
    { key: 'archives', label: 'Archives', extensions: ['.zip', '.rar', '.7z', '.tar'], icon: 'Archive' }
  ];

  const handleTypeToggle = (type) => {
    if (type.key === 'all') {
      onTypesChange([]);
      return;
    }

    const newTypes = selectedTypes.includes(type.key)
      ? selectedTypes.filter(t => t !== type.key)
      : [...selectedTypes, type.key];
    
    onTypesChange(newTypes);
  };

  const getSelectedLabel = () => {
    if (selectedTypes.length === 0) return 'All Files';
    if (selectedTypes.length === 1) {
      const type = fileTypes.find(t => t.key === selectedTypes[0]);
      return type?.label || 'Custom';
    }
    return `${selectedTypes.length} types selected`;
  };

  const isTypeSelected = (type) => {
    if (type.key === 'all') return selectedTypes.length === 0;
    return selectedTypes.includes(type.key);
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full flex items-center justify-between px-4 py-3 
          bg-white border border-surface-200 rounded-lg
          hover:border-primary/50 transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary/20
        "
      >
        <div className="flex items-center space-x-2">
          <ApperIcon name="Filter" size={18} className="text-surface-500" />
          <Text variant="body" weight="medium">
            {getSelectedLabel()}
          </Text>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ApperIcon name="ChevronDown" size={18} className="text-surface-500" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="
              absolute top-full left-0 right-0 mt-2 
              bg-white border border-surface-200 rounded-lg shadow-lg
              z-50 max-w-full overflow-hidden
            "
          >
            <div className="py-2">
              {fileTypes.map((type, index) => (
                <motion.button
                  key={type.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleTypeToggle(type)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-2
                    hover:bg-surface-50 transition-colors duration-150
                    ${isTypeSelected(type) ? 'bg-primary/5 text-primary' : 'text-surface-700'}
                  `}
                >
                  <ApperIcon 
                    name={type.icon} 
                    size={18} 
                    className={isTypeSelected(type) ? 'text-primary' : 'text-surface-500'}
                  />
                  <div className="flex-1 text-left min-w-0">
                    <Text 
                      variant="body" 
                      weight={isTypeSelected(type) ? 'medium' : 'normal'}
                      className="break-words"
                    >
                      {type.label}
                    </Text>
                    {type.extensions.length > 0 && (
                      <Text variant="caption" size="sm" color="light" className="break-words">
                        {type.extensions.join(', ')}
                      </Text>
                    )}
                  </div>
                  {isTypeSelected(type) && (
                    <ApperIcon name="Check" size={16} className="text-primary flex-shrink-0" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileTypeFilter;