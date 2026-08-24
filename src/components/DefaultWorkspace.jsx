import { useNavigate, useLocation } from 'react-router-dom';
import { findMenuContextByPath } from '../utils/menu-utils';
import { useAuth } from '../context/AuthContext';
import TitleHeader from './Shared/TitleHeader';

function DefaultWorkspace() {
  const navigate = useNavigate();
  const location = useLocation();
  const { menu } = useAuth();
  const context = findMenuContextByPath(location.pathname, menu);
  const activeMenu = context?.activeMenu || '404';

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