import type { ProductSpec } from "@/lib/types";

export function SpecTable({ specs, caption }: { specs: ProductSpec[]; caption?: string }) {
  if (specs.length === 0) {
    return <p className="text-muted">Grades, sizes and packing are confirmed per enquiry. Ask for the current spec sheet.</p>;
  }
  return (
    <table className="w-full border-t border-line text-left">
      {caption && <caption className="sr-only">{caption}</caption>}
      <tbody>
        {specs.map((s) => (
          <tr key={s.label} className="border-b border-line">
            <th scope="row" className="py-3 pr-4 font-semibold align-top w-1/3">{s.label}</th>
            <td className="py-3">{s.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
