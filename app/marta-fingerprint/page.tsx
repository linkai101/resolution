import { WorkPage } from "@/components/work-page";
import { Building2 } from "lucide-react";

export default function MartaFingerprintPage() {
  return (
    <WorkPage
      image={{
        unitSrc: "/assets/marta_fingerprint_unit.png",
        unitAlt: "Marta/Fingerprint unit",
        workSrc: "/assets/marta_fingerprint.jpg",
        workAlt: "Marta/Fingerprint",
        workAspect: 1518 / 2000,
        unitCx: 0.5365,
        unitCy: 0.4985,
        unitFraction: 0.013,
      }}
      details={<>
        <p className="text-lg font-bold">{"Chuck Close"}</p>
        <p className="italic">{"Marta/Fingerprint"}</p>
        <p>{"1986"}</p>

        <div className="flex items-center gap-2 text-muted mt-3">
          <Building2 size={16} strokeWidth={1.5} />
          <p className="font-medium">{"The Museum of Modern Art"}</p>
        </div>

        <hr className="my-5 border-muted/25" />

        <p>{"Transfer etching"}</p>
      </>}
    />
  );
}
