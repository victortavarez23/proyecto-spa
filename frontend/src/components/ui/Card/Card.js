import './Card.css';

const Card = ({ 
    children, 
    className = '', 
    variant = 'default',
    padding = 'medium',
    ...props 
}) => {
    const variantClass = `card--${variant}`;
    const paddingClass = `card--padding-${padding}`;
    const combinedClasses = `card ${variantClass} ${paddingClass} ${className}`.trim();

    return (
        <div className={combinedClasses} {...props}>
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`card__header ${className}`}>{children}</div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`card__body ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`card__footer ${className}`}>{children}</div>
);

export default Card;
