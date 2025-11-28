export default function FeedbackMessage({ children, role = "status", className = "" }) {
  const mergedClassName = `feedbackMessage ${className}`.trim();
  return (
    <div className={mergedClassName} role={role}>
      {children}
    </div>
  );
}
