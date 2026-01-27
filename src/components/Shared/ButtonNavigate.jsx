function ButtonNavigate({ url, navigate, flagDisabled = false}) {
  return (
    <button
      disabled={flagDisabled}
      onClick={() => navigate(url)}
      className="mb-6 px-4 py-2 rounded-lg hover:bg-gray-400 font-semibold transition flex items-center gap-2"
    >
      ← Nuevo Registro
    </button>
  );
}

export default ButtonNavigate;