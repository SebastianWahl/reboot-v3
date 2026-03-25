// Props: message (string), onRetry (fn), visible (bool)
export default function ErrorToast({ message, onRetry, visible }) {
  if (!visible) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 bg-red-50 border border-red-300 rounded-xl p-4 shadow-lg flex items-center justify-between gap-4 z-50">
      <p className="text-red-700 text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-semibold text-red-600 hover:text-red-800 whitespace-nowrap"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}
