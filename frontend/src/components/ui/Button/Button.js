import './Button.css';  

/**
    * Componente Button reutilizable
    * @param {object} props - Propiedades del componente
    * @param {string} props.variant - Tipo de botón ('primary', 'secondary', 'outline')
    * @param {string} props.size - Tamaño del botón ('small', 'medium', 'large')
    * @param {boolean} props.disabled - Estado deshabilitado del botón
    * @param {function} props.onClick - Función a ejecutar al hacer clic
    * @param {sting} props.type - Tipo de botón HTML ('button', 'submit', 'reset')
    * @param {ReactNode} props.children - Contenido del botón
    * @param {string} props.className - Clases CSS adicionales
*/

const Button = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  type = 'button',
    children,
    className = '',
    ...props
}) => {
    const buttonClass = `btn btn--${variant} btn--${size} ${size} ${className}`.trim();
    return (
        <button
            className={buttonClass}
            disabled={disabled}
            onClick={onClick}
            type={type}
            {...props}
        >
            {children}
        </button>
    );
};
export default Button;
