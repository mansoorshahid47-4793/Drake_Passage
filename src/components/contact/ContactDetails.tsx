import { company } from "@/data/company";
import { Button } from "@/components/ui/Button";
import { whatsAppUrl } from "@/lib/whatsapp";

export function ContactDetails() {
  return (
    <div className="rounded-tile bg-navy p-8 text-salt">
      <h2 className="text-salt">Talk to the export desk</h2>
      <p className="mt-2 text-salt/85">Pricing, samples, packing, documents or shipping.</p>
      <dl className="mt-6 space-y-4">
        <div><dt className="text-salt/70 text-[15px]">Phone / WhatsApp</dt><dd className="m-0 font-semibold"><a href={`tel:+${company.phoneE164}`} className="text-salt no-underline">{company.phoneDisplay}</a></dd></div>
        <div><dt className="text-salt/70 text-[15px]">Email</dt><dd className="m-0 font-semibold"><a href={`mailto:${company.email}`} className="text-salt no-underline">{company.email}</a></dd></div>
        <div><dt className="text-salt/70 text-[15px]">Office</dt><dd className="m-0 font-semibold">{company.office}</dd></div>
        <div><dt className="text-salt/70 text-[15px]">Hours</dt><dd className="m-0 font-semibold">{company.hours}</dd></div>
      </dl>
      <div className="mt-8"><Button href={whatsAppUrl()} external variant="whatsapp">Chat on WhatsApp</Button></div>
    </div>
  );
}
