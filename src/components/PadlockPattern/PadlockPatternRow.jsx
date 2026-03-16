import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePadlockPatterns } from '../../context/PadlockPatternContext';

function PadlockpatternRow({ padlockPattern }) {

  const navigate = useNavigate();

  const handleSelectedPadlock = (id) => {
    navigate(`/empleados/vestuarios/candados/patrones/ver/${id}`, { 
      state: { data: [] } 
    }); 
  };

  return (
    <>
      <tr
        key={padlockPattern.id}
        onClick={() => handleSelectedPadlock(padlockPattern.id)}
        className="border-b tr-table hover:bg-blue-50 transition-colors duration-150"
      >
        <td className="px-4 py-3 text-white-800 font-medium">{padlockPattern.model_name} </td>
        <td className="px-4 py-3 text-white-800 font-medium">
          <ul className="mt-2 space-y-2">
            {padlockPattern.unlock_sequence.map((step, index) => (
              <li key={index} className="p-2 rounded bg-[#2f3d44] ">
                <span className="font-semibold text-[#9fd8ff]">Paso {index + 1}: </span>
                {step.action} {step.value} {step.value > 1 ? 'veces' : 'vez'} hacia la {step.direction}
              </li>
            ))}
          </ul>
        </td>
        <td className="px-4 py-3 text-white-800 font-medium">{padlockPattern.reset_instructions}</td>        
      </tr>
    </>
  )
}
export default PadlockpatternRow;