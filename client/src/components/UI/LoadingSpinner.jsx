export default function LoadingSpinner({ fullScreen = true }) {
  const wrapper = fullScreen
    ? 'min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950'
    : 'flex items-center justify-center py-20';

  return (
    <div className={wrapper}>
      <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
