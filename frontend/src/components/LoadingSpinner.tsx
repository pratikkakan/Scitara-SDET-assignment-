import "../styles/loading.css";

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({
  message = "Loading...",
}: LoadingSpinnerProps) => {
  return (
    <div className="loading-container" data-testid="loading-spinner">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
};
