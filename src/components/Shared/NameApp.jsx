import { useNavigate, useLocation } from 'react-router-dom';

function NameApp({ dynamicClasses = "text-lg" }) {
  
  const navigate = useNavigate();

  return (
    <span onClick={() => navigate('/')} className={`${dynamicClasses} text-white font-black tracking-wider`}>
      Meru<span className="text-[#9fd8ff]">Link</span>
    </span>
  );
}

export default NameApp;