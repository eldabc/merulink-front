import { PencilIcon } from "@heroicons/react/24/solid";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function HeadFormButtons({ setIsEditing, onBack, url = '', data = [] }) {
  const navigate = useNavigate();
  const isAFunction = typeof setIsEditing === 'function';
  const isOnBackAFunction = typeof onBack === 'function';

  return (
    <div className="buttons-bar flex gap-2 aling-items-right justify-end">
      <button onClick={() => isAFunction ? setIsEditing(true) : navigate(url, { state: { data: data } })} className="buttons-bar-btn flex text-3xl font-semibold" title="Editar">
      <PencilIcon className="w-4 h-4 text-white-500" />
      </button>
      <button type="button" onClick={() => isOnBackAFunction ? onBack() : navigate(-1) } className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg">
          <ArrowLeft className="w-4 h-4 text-white-500" />
      </button>
    </div>
  );

}

export default HeadFormButtons;