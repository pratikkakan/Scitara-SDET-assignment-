import "../styles/empty-state.css";

interface EmptyStateProps {
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: string;
}

export const EmptyState = ({
  title,
  message,
  action,
  icon = "📦",
}: EmptyStateProps) => {
  return (
    <div className="empty-state" data-testid="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h2 className="empty-state-title" data-testid="empty-state-title">
        {title}
      </h2>
      <p className="empty-state-message" data-testid="empty-state-message">
        {message}
      </p>
      {action && (
        <button
          className="empty-state-action"
          onClick={action.onClick}
          data-testid="empty-state-action"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
