import { motion } from 'framer-motion';

const ProgressBar = ({ 
  progress = 0, 
  showPercentage = true,
  showStripes = false,
  size = 'md',
  color = 'primary',
  className = '',
  animated = false
}) => {
  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };
  
  const colors = {
    primary: 'bg-gradient-primary',
    secondary: 'bg-gradient-accent',
    success: 'bg-gradient-success',
    warning: 'bg-warning',
    error: 'bg-error'
  };

  const progressValue = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      <div className={`bg-surface-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressValue}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`
            ${colors[color]} 
            ${sizes[size]} 
            rounded-full relative
            ${showStripes ? 'progress-stripes' : ''}
            ${animated ? 'shadow-lg' : ''}
          `}
        >
          {animated && progressValue > 0 && (
            <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-r from-transparent to-white/30 rounded-full"></div>
          )}
        </motion.div>
      </div>
      {showPercentage && (
        <div className="mt-1 text-sm text-surface-600 text-right">
          {progressValue}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;