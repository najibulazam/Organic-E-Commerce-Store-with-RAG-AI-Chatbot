function ErrorMessage({ message }) {
  return (
    <div className="alert alert-danger" role="alert">
      <h4 className="alert-heading">Error!</h4>
      <p>{message || 'Something went wrong. Please try again later.'}</p>
    </div>
  );
}

export default ErrorMessage;
