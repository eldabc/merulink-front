import { formatTimeTo12H } from '../../utils/date-utils';

function ShiftLegend({ shifts=[] }){
  return(
    <div className="w-56 rounded-xl p-5 bg-field">
      <h3 className="text-gray-200 font-semibold"> Horarios: </h3>
      {shifts.map((shift)=>(
        <div key={shift.id} className="flex items-center gap-2 mt-2">
          <div
            className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ backgroundColor: shift.color ?? 'red'}}
          >
            {shift.letterShift}
          </div>

          <span
            className="text-sm">
            {shift.id === 0 ? shift.description : `${formatTimeTo12H(shift.checkInTime)} - ${formatTimeTo12H(shift.checkOutTime)}`}
          </span>
        </div>
      ))}
    </div>
  )

}

export default ShiftLegend;