import { WorkPage } from "@/components/work-page";

export default function MartaFingerprintPage() {
  return (
    <WorkPage
      slug="marta-fingerprint"
      unitImage="/assets/marta_fingerprint_unit.png"
      unitAlt="Marta/Fingerprint unit"
      workImage="/assets/marta_fingerprint.jpg"
      workAlt="Marta/Fingerprint"
      workAspect={1518 / 2000}
      unitScale={20}
      unitX={-335}
      unitY={20}
    />
  );
}
