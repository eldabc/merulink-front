import { TrashIcon } from '@heroicons/react/24/solid';

function ButtonTrash({ disabled, remove, index, dynamicClasses }) {
  return (
    <button
      disabled={disabled}
      type="button"
      onClick={() => remove(index)}
      className={`inline-flex items-center justify-center p-1 rounded ${dynamicClasses}`}
    >
      <TrashIcon className="w-4 h-4" />
    </button>
  );
}

export default ButtonTrash;