import { Link } from 'react-router-dom';

function RoleBarLinks({ id }) {
  return (
    <div className='flex flex-row w-full mt-1 hover:bg-[#ffffff0f]'>
      <Link
        to={`/empleados/roles/ver/${id}`}
        className="flex flex-col gap-0.5 px-3 rounded-lg transition-colors duration-200 border border-transparent items-end"
      >
        <span className="text-xs text-gray-200 hover:text-[#9fd8ff]">Ver</span>
      </Link>
      <Link
        to={`/empleados/roles/editar/${id}`}
        className="flex flex-col gap-0.5 px-3 rounded-lg transition-colors duration-200 border border-transparent items-end"
      >
        <span className="text-xs text-gray-200 hover:text-[#9fd8ff]">Editar</span>
      </Link>
    </div>
  );
}

export default RoleBarLinks; 