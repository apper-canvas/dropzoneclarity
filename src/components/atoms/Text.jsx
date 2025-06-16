const Text = ({ 
  children, 
  variant = 'body', 
  size = 'base', 
  weight = 'normal',
  color = 'default',
  className = '',
  as: Component = 'p',
  ...props 
}) => {
  const variants = {
    display: 'font-heading',
    heading: 'font-heading',
    body: 'font-sans',
    caption: 'font-sans'
  };
  
  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm', 
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl'
  };
  
  const weights = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold'
  };
  
  const colors = {
    default: 'text-surface-900',
    muted: 'text-surface-600',
    light: 'text-surface-500',
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    white: 'text-white'
  };

  const textClasses = `
    ${variants[variant]}
    ${sizes[size]}
    ${weights[weight]}
    ${colors[color]}
    ${className}
  `.trim();

  return (
    <Component className={textClasses} {...props}>
      {children}
    </Component>
  );
};

export default Text;