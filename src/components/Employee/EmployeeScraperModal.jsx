import { useState } from 'react';
import { Search, X, CheckCircle, AlertTriangle, Loader2, SkipForward, Shield, ArrowLeft } from 'lucide-react';
import { scrapeIvss, scrapeSeniat, getSeniatCaptcha } from '../../services/scraperService';
import { ciOption } from '../../utils/text-utils';

import RequiredMark from '../Shared/RequiredMark';


export default function EmployeeScraperModal({ isOpen, onDataFound, onSkip }) {
  const [ci, setCi] = useState('');
  const [nationality, setNationality] = useState('V');
  const [birthdate, setBirthdate] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // SENIAT captcha
  const [captchaImage, setCaptchaImage] = useState(null);
  const [captchaCode, setCaptchaCode] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [captchaError, setCaptchaError] = useState('');

  if (!isOpen) return null;

  /** Reinicia todos los estados al formulario inicial (IVSS). */
  const handleReset = () => {
    setCi('');
    setNationality('V');
    setBirthdate('');
    setLoading(false);
    setResult(null);
    setErrorMsg('');
    setCaptchaImage(null);
    setCaptchaCode('');
    setShowCaptcha(false);
    setCaptchaLoading(false);
    setCaptchaError('');
  };

  /** Formatea la cédula con puntos mientras se escribe (ciOption). */
  const handleCiChange = (e) => {
    ciOption.onChange(e);   // aplica el formato 8.123.456 en el input
    setCi(e.target.value);  // sincroniza el estado con el valor formateado
  };

  /** Vuelve al formulario inicial de IVSS (limpia resultados y captcha). */
  const handleGoBack = () => {
    setResult(null);
    setErrorMsg('');
    setCaptchaImage(null);
    setCaptchaCode('');
    setShowCaptcha(false);
    setCaptchaError('');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!ci.replace(/\D/g, '') || !birthdate.trim()) {
      setErrorMsg('Complete ambos campos.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setResult(null);
    setShowCaptcha(false);

    try {
      const [y, m, d] = birthdate.split('-');
      const formattedDate = `${d}/${m}/${y}`;
      const response = await scrapeIvss(ci.replace(/\D/g, ''), formattedDate, nationality);
      setResult(response);
    } catch (err) {
      console.log("error ivss", err);
      const msg = err?.response?.data?.error || err?.response?.data?.message || 'Error de conexión.';
      setErrorMsg(msg);
      setResult({ success: false, data: null, source: 'error', error: msg });
    } finally {
      setLoading(false);
    }
  };

  /** Cargar captcha del SENIAT */
  const handleLoadCaptcha = async () => {
    setCaptchaLoading(true);
    setCaptchaError('');
    setCaptchaCode('');
    try {
      const data = await getSeniatCaptcha();
      if (data.success) {
        setCaptchaImage(data.captcha_image);
        setShowCaptcha(true);
        setResult(null);
      } else {
        setCaptchaError(data.error || 'No se pudo cargar el captcha.');
      }
    } catch (err) {
      setCaptchaError('Error al obtener el captcha del SENIAT.');
    } finally {
      setCaptchaLoading(false);
    }
  };

  /** Enviar código captcha al SENIAT */
  const handleCaptchaSubmit = async (e) => {
    e.preventDefault();
    console.log("captchaCode", captchaCode)
    if (!captchaCode.trim()) {
      setCaptchaError('Ingrese el código de la imagen.');
      return;
    }

    setLoading(true);
    setCaptchaError('');

    try {
      const response = await scrapeSeniat(ci.replace(/\D/g, ''), captchaCode.trim(), nationality);
      console.log("response seniat", response);

      setResult(response);
      setShowCaptcha(false);
    } catch (err) {
      console.log("error seniat", err);
      const msg = err.response?.data?.error || 'Código incorrecto o error de conexión.';
      setCaptchaError(msg);
      setShowCaptcha(false);
      setResult({ success: false, data: null, source: 'error', error: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptData = () => {
    if (result?.success && result?.data) {
      const data = { ...result.data };

      // En caso que IVSS fallo y usaron SENIAT, set a la fecha de nacimiento que el usuario ingresó.
      if (!data.birthdate && birthdate) {
        const [y, m, d] = birthdate.split('-');
        data.birthdate = `${d}/${m}/${y}`;
      }

      // Nacionalidad seleccionada (V/E)
      data.nationality = nationality;

      onDataFound(data);
    }
  };

  const mapSex = (s) => {
    if (!s) return null;
    const x = s.toUpperCase();
    if (x === 'FEMENINO' || x === 'F') return 'Femenino';
    if (x === 'MASCULINO' || x === 'M') return 'Masculino';
    return s;
  };
// console.log("result", result)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#2f3235] border border-[#ffffff21] rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#ffffff15]">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-blue-400" />
            <h2
              onClick={handleReset}
              className="text-lg font-semibold text-gray-100 cursor-pointer hover:text-[#9fd8ff] transition-colors select-none"
              title="Click para volver al inicio"
            >
              Buscar Datos del Empleado
            </h2>
          </div>
          <button onClick={onSkip} className="text-gray-500 hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center py-10 gap-4">
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
              <p className="text-gray-300 text-lg font-medium">Buscando...</p>
              <p className="text-gray-500 text-sm">Consultando. Puede tardar un máximo de 30 segundos.</p>
            </div>
          )}

          {/* Resultado consulta */}
          {!loading && result?.success && result?.data && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-400 bg-green-400/10 rounded-lg p-3">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Datos encontrados en {result.source.toUpperCase()}</span>
              </div>

              <div className="bg-[#252729] rounded-lg p-4 space-y-2 text-sm">
                <DataRow label="Cédula" value={result.data.ci} />
                <DataRow label="Primer Nombre" value={result.data.first_name} />
                <DataRow label="Segundo Nombre" value={result.data.second_name} />
                <DataRow label="Primer Apellido" value={result.data.last_name} />
                <DataRow label="Segundo Apellido" value={result.data.second_last_name} />
                <DataRow label="Fecha Nac." value={result.data.birthdate} />
                <DataRow label="Sexo" value={mapSex(result.data.sex)} />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={onSkip} className="flex-1 text-gray-300 font-medium py-2.5 px-4 flex items-center justify-center gap-2">
                  <SkipForward className="w-4 h-4" /> Llenar manualmente
                </button>
                <button onClick={handleAcceptData} className="flex-1 text-white font-medium py-2.5 px-4 flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Usar estos datos
                </button>
              </div>
            </div>
          )}

          {/* Error + opción SENIAT */}
          {!loading && result && !result.success && !showCaptcha && (
            <div className="space-y-4">
              <div className="flex items-start gap-2 text-amber-400 bg-amber-400/10 rounded-lg p-3">
                <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">No se encontraron datos en IVSS</p>
                  <p className="text-xs text-gray-400 mt-1">{errorMsg}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={handleGoBack} className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Volver
                </button>
                <button onClick={handleLoadCaptcha} disabled={captchaLoading}
                  className="flex-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 font-medium py-2.5 px-4 rounded-lg border border-amber-500/30 flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                  {captchaLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                  Intentar con SENIAT
                </button>
              </div>
              {captchaError && <p className="text-red-400 text-sm">{captchaError}</p>}
            </div>
          )}

          {/* Captcha SENIAT */}
          {!loading && showCaptcha && captchaImage && (
            <form className="space-y-4">
              <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 rounded-lg p-3">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">Verificación SENIAT</span>
              </div>
              <p className="text-sm text-gray-400">Ingrese el código que aparece en la imagen:</p>

              <div className="flex justify-center bg-white rounded-lg p-2">
                <img src={captchaImage} alt="Captcha SENIAT" className="max-h-16" />
              </div>

              <div>
                <input type="text" value={captchaCode} onChange={e => setCaptchaCode(e.target.value.toLowerCase())}
                  placeholder="Código de la imagen" autoFocus maxLength={10}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#252729] border border-[#ffffff21] text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500 text-center tracking-widest text-lg" />
              </div>

              {captchaError && <p className="text-red-400 text-sm">{captchaError}</p>}

              <div className="flex gap-3">
                <button type="button" onClick={() => { setShowCaptcha(false); setResult({ success: false, source: 'error', error: 'Búsqueda cancelada.' }); }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-2.5 px-4 rounded-lg">Volver</button>
                <button type="button" onClick={(e) => { handleCaptchaSubmit(e); }} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2">
                  <Search className="w-4 h-4" /> Verificar
                </button>
              </div>
            </form>
          )}

          {/* Error genérico (sin opción SENIAT) */}
          {!loading && result && !result.success && showCaptcha && !captchaImage && (
            <div className="space-y-4">
              <div className="flex items-start gap-2 text-red-400 bg-red-400/10 rounded-lg p-3">
                <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                <p className="text-sm">{captchaError || 'Error al cargar el captcha.'}</p>
              </div>
              <button onClick={handleGoBack} className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Volver
              </button>
            </div>
          )}

          {/* Formulario inicial */}
          {!loading && !result && !showCaptcha && (
            <form onSubmit={handleSearch} className="space-y-4">
              <p className="text-sm text-gray-400">
                Ingrese cédula y fecha de nacimiento para buscar en el IVSS.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Cédula <RequiredMark simbol="*" /></label>
                <div className="flex gap-2">
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="input-dark w-20 text-center"
                    title="Nacionalidad: V = Venezolano, E = Extranjero"
                  >
                    <option value="V">V</option>
                    <option value="E">E</option>
                  </select>
                  <input
                    type="text"
                    value={ci}
                    onChange={handleCiChange}
                    placeholder="Ej: 32123456"
                    autoFocus
                    className="input-dark flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Fecha Nacimiento <RequiredMark simbol="*" /></label>
                <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)} className="input-dark" />
              </div>
              {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onSkip} className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2">
                  <SkipForward className="w-4 h-4" /> Omitir
                </button>
                <button type="submit" className="flex-1 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2">
                  <Search className="w-4 h-4" /> Buscar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function DataRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-200 font-medium text-right ml-4">{value}</span>
    </div>
  );
}
