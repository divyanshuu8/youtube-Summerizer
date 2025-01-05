import { X } from 'lucide-react';
import { ReactNode } from 'react';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
};

export function AuthModal({ isOpen, onClose, children, title }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}