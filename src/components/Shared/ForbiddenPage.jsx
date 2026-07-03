import { useNavigate } from 'react-router-dom';
import TitleHeader from './TitleHeader';

function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div className="mt-14 text-center">
      <TitleHeader title="403" dinamicClasses="md:!text-center" />
      <h2>No posee permisos para acceder a esta página.</h2>
      <br></br>
      <button type="button" onClick={() => navigate(-1)} className="font-semibold">Volver</button>
    </div>
  );
}

export default ForbiddenPage;