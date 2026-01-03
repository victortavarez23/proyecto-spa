
const ErrorMessage = ({ message, onRetry, showRetry = true }) => {
  return (
    <div className="error-message-container">
      <div className="error-icon">⚠️</div>
      <h3>Algo salió mal</h3>
      <p>{message || 'Ocurrió un error inesperado'}</p>
      {showRetry && onRetry && (
        <button onClick={onRetry} className="retry-button">
          Reintentar
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;