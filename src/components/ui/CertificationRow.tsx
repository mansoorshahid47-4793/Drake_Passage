import Link from "next/link";
import type { CompanyCertification } from "@/lib/types";

export function CertificationRow({ certification }: { certification: CompanyCertification }) {
  return (
    <div className="grid gap-2 border-b border-line py-4 md:grid-cols-[1fr_2fr_auto] md:items-center">
      <h2 className="text-[1.25rem]">{certification.name}</h2>
      <p className="text-muted m-0">{certification.covers}</p>
      <p className="m-0 text-[15px]">
        Available on request ·{" "}
        <Link href={`/contact?inquiry=certificate&name=${encodeURIComponent(certification.name)}`} className="underline">
          Request a copy
        </Link>
      </p>
    </div>
  );
}
