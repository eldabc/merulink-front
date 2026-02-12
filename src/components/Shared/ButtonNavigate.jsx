function ButtonNavigate({ url, navigate, flagDisabled}) {
  return (
    <button
      disabled={flagDisabled}
      onClick={() => navigate(url)}
      className={`mb-6 px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${flagDisabled ? 'disabled:opacity-60 disabled:cursor-not-allowed' : ''}`}
    >
      ← Nuevo Registro
    </button>
  );
}

export default ButtonNavigate;