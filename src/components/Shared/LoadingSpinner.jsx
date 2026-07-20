import { Loader } from 'lucide-react';

export default function LoadingSpinner({ className = 'py-8' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader className="w-6 h-6 text-gray-400 animate-spin" />
    </div>
  );
}
