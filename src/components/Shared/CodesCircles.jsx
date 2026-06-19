import SpanText from "./SpanText";

function CodesCircles({ codes = [] }) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-2 mt-2"> Códigos existentes:
      {codes.length === 0 ? (
        <SpanText text="Sin códigos registrados" />
      ) : (
        codes.map((code, index) => (
        <div
          key={`${code}-${index}`}
          className="
            min-w-[50px]
            h-10
            px-4
            rounded-full
            flex
            items-center
            justify-center
            text-white
            text-sm
            font-semibold
            bg-field
            shadow-sm
          "
        >
          {code}
        </div>
      ))
      )}
      
    </div>
  );
}

export default CodesCircles;