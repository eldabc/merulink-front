import { lockerCategories } from '../../utils/StaticData/locker-room-utils.js';

export default function FilterByFields({ 
  searchValue, 
  searchDateValue, 
  onSearchChange, 
  filterStatus, 
  onFilterStatus, 
  onFilterDate,
  onFilterCategory, 
  showFilterStatus = false, 
  showFilterDate = false, 
  showFilterCategory = false,
  moduleName = '', 
  placeholder = '',
  active = 'activo',
  inactive = 'inactivo'}) {

  return (
    <div className="mb-6 p-4 rounded-lg search-container shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
        {/* Label y Input de búsqueda */}
        <div className="flex-1">
          <label className="block text-sm mb-2 font-bold">
            Buscar {moduleName}:
          </label>
          <input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 rounded-lg filter-input focus:outline-none transition-all placeholder:text-gray-500 placeholder:italic"
          />
        </div>
        <div className="flex-1 gap-2 flex-wrap">
          {showFilterDate && (
          
              <input 
                onChange={(e) => onFilterDate(e.target.value) } value={searchDateValue}
                type='date' className="px-3 py-2 rounded-lg filter-input"  />

          )}

          {showFilterCategory && (
            <>
              <span className='text-sm font-bold  mr-2.5'>Categoría: </span>
              <select 
                onChange={(e) => onFilterCategory(e.target.value) }
                className={`text-lg w-auto px-2 py-1 rounded-md filter-input text-gray-300 cursor-pointer`}
              >
                <option className='bg-[#3c4042]' value="">Todos</option>
                {lockerCategories.map((item) => (
                  <option key={`category-${item.id}`} className='bg-[#3c4042]' value={item.key}>
                    {item.value}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        {/* Filtros por Estado */}
        {showFilterStatus && (
        <div className="flex flex-none">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => onFilterStatus('all')}
              className={`skip-style-btn status-btn ${filterStatus === 'all' ? 'status-btn--all' : 'status-btn--neutral'}`}
              aria-pressed={filterStatus === 'all'}
            >
              Todos
            </button>
            <button
              onClick={() => onFilterStatus(active)}
              className={`skip-style-btn status-btn ${filterStatus === active ? 'status-btn--active' : 'status-btn--neutral'}`}
              aria-pressed={filterStatus === active}
            >
              <span className="capitalize"> {active}s </span>
            </button>
            <button
              onClick={() => onFilterStatus(inactive)}
              className={`skip-style-btn status-btn ${filterStatus === inactive ? 'status-btn--inactive' : 'status-btn--neutral'}`}
              aria-pressed={filterStatus === inactive}
            >
              <span className="capitalize"> {inactive}s </span>
            </button>
          </div>
        </div>

        )}
      </div>
    </div>
  );
}
