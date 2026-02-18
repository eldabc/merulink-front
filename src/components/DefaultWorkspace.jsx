import { useNavigate } from 'react-router-dom';

import TitleHeader from './Shared/TitleHeader';

function DefaultWorkspace({ activeMenu }) {

  const navigate = useNavigate();

  return (
    <div className="mt-14 text-center">
      <TitleHeader title={activeMenu} />
      <h2>No se ha encontrado la url.</h2>
      <br></br>
      <button type="button" onClick={() => navigate(-1)} className="font-semibold">Volver</button>
    </div>
  );
}

export default DefaultWorkspace;