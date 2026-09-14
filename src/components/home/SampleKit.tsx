import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { company } from "@/data/company";

export function SampleKit() {
  return (
    <section className="py-20">
      <Container className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <h2>Check the grade before you commit</h2>
          <p className="mt-4 text-muted">Request samples of any product. We dispatch by {company.sampleCouriers.join(" or ")} and confirm the spec sheet with the parcel.</p>
          <div className="mt-6"><Button href="/contact?inquiry=sample" variant="secondary">Request a sample</Button></div>
        </div>
        <div className="rounded-tile border border-line bg-white p-8">
          <p className="m-0 font-semibold">What a sample request includes</p>
          <ul className="mt-3 mb-0 list-disc pl-5 text-muted">
            <li>Product and grade you want to check</li>
            <li>Destination and courier account, if you have one</li>
            <li>Intended order quantity and trade term</li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
