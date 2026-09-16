import { Container } from "@/components/ui/Container";
import { company } from "@/data/company";

export function TermsBand() {
  return (
    <section className="bg-navy py-16 text-salt">
      <Container className="grid gap-10 md:grid-cols-3">
        <div><h2 className="text-salt">Terms at a glance</h2></div>
        <dl className="m-0 grid gap-6 md:col-span-2 md:grid-cols-2">
          <div><dt className="font-semibold">Trade terms</dt><dd className="m-0 text-salt/85">{company.tradeTerms.join(" or ")}, quoted per destination port.</dd></div>
          <div><dt className="font-semibold">Payment</dt><dd className="m-0 text-salt/85">New buyers: {company.paymentTerms.newBuyers}. Repeat buyers: {company.paymentTerms.repeatBuyers}.</dd></div>
          <div><dt className="font-semibold">Samples</dt><dd className="m-0 text-salt/85">Dispatched by {company.sampleCouriers.join(" or ")}.</dd></div>
          <div><dt className="font-semibold">Documents</dt><dd className="m-0 text-salt/85">ISO 9001, Halal, certificate of origin, certificate of analysis (COA), SGS inspection and phytosanitary certificate on request.</dd></div>
        </dl>
      </Container>
    </section>
  );
}
