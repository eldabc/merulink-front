import { Link } from 'react-router-dom';

import NameApp from './NameApp';

function GuestBar() {
  return (
    <header className="w-full bg-[#2f3d44] border-b border-[#43474a] px-6 py-3 flex items-center justify-between">
      <NameApp />
      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="text-sm text-gray-300 hover:text-white transition-colors font-medium"
        >
          Iniciar sesión
        </Link>
        <Link
          to="/register"
          className="text-sm bg-[#008a9e] hover:bg-[#9fd8ff] [text-shadow:_0_2px_2px_rgba(0,0,0,0.8)] !text-gray-200 px-4 py-1.5 rounded-md transition-colors font-medium"
        >
          Registrarse
        </Link>
      </div>
    </header>
  );
}

export default GuestBar; 