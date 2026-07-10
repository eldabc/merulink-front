import { useState } from 'react';
import { Search, X, CheckCircle, AlertTriangle, Loader2, SkipForward } from 'lucide-react';
import { scrapeEmployeeData } from '../../services/scraperService';

export default function EmployeeScraperModal({ isOpen, onDataFound, onSkip }) {
  const [ci, setCi] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!ci.trim() || !birthdate.trim()) {
      setErrorMsg('Complete ambos campos.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const [y, m, d] = birthdate.split('-');
      const formattedDate = `${d}/${m}/${y}`;
      const response = await scrapeEmployeeData(ci.trim(), formattedDate);
      setResult(response);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Error de conexión.';
      setErrorMsg(msg);
      setResult({ success: false, data: null, source: 'error', error: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptData = () => {
    if (result?.success && result?.data) {
      onDataFound(result.data);
    }
  };

  const mapSex = (s) => {
    if (!s) return null;
    const x = s.toUpperCase();
    if (x === 'FEMENINO' || x === 'F') return 'Femenino';
    if (x === 'MASCULINO' || x === 'M') return 'Masculino';
    return s;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1e1e2e] border border-[#ffffff21] rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#ffffff15]">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-gray-100">Buscar Datos del Empleado</h2>
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
              <p className="text-gray-500 text-sm">Consultando IVSS. Puede tardar un máximo de 30 segundos.</p>
            </div>
          )}

          {/* Éxito */}
          {!loading && result?.success && result?.data && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-400 bg-green-400/10 rounded-lg p-3">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Datos encontrados en {result.source.toUpperCase()}</span>
              </div>

              <div className="bg-[#2a2a3a] rounded-lg p-4 space-y-2 text-sm">
                <DataRow label="Cédula" value={result.data.ci} />
                <DataRow label="Primer Nombre" value={result.data.first_name} />
                <DataRow label="Segundo Nombre" value={result.data.second_name} />
                <DataRow label="Primer Apellido" value={result.data.last_name} />
                <DataRow label="Segundo Apellido" value={result.data.second_last_name} />
                <DataRow label="Fecha Nac." value={result.data.birthdate} />
                <DataRow label="Sexo" value={mapSex(result.data.sex)} />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={onSkip} className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2">
                  <SkipForward className="w-4 h-4" /> Llenar manualmente
                </button>
                <button onClick={handleAcceptData} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Usar estos datos
                </button>
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && result && !result.success && (
            <div className="space-y-4">
              <div className="flex items-start gap-2 text-amber-400 bg-amber-400/10 rounded-lg p-3">
                <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">No se encontraron datos</p>
                  <p className="text-xs text-gray-400 mt-1">{result.error || errorMsg}</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Complete los datos del empleado manualmente.</p>
              <button onClick={onSkip} className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2">
                <SkipForward className="w-4 h-4" /> Continuar con formulario manual
              </button>
            </div>
          )}

          {/* Formulario inicial */}
          {!loading && !result && (
            <form onSubmit={handleSearch} className="space-y-4">
              <p className="text-sm text-gray-400">
                Ingrese cédula y fecha de nacimiento para buscar en el IVSS.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Cédula <span className="text-red-400">*</span></label>
                <input type="text" value={ci} onChange={e => setCi(e.target.value)}
                  placeholder="Ej: 21380780" autoFocus
                  className="w-full px-3 py-2.5 rounded-lg bg-[#2a2a3a] border border-[#ffffff21] text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Fecha Nacimiento <span className="text-red-400">*</span></label>
                <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#2a2a3a] border border-[#ffffff21] text-gray-200 focus:outline-none focus:border-blue-500" />
              </div>
              {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onSkip} className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2">
                  <SkipForward className="w-4 h-4" /> Omitir
                </button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2">
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
