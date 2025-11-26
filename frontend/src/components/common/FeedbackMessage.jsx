export default function FeedbackMessage({ children, role = "status" }) {
  return (
    <div className="feedbackMessage" role={role}>
      {children}
    </div>
  );
}
