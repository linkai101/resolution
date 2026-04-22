import { WorkPage } from "@/components/work-page";

export default function EveningHonfleurPage() {
  return (
    <WorkPage
      slug="evening-honfleur"
      unitImage="/assets/evening_honfleur_unit.png"
      unitAlt="Evening, Honfleur unit"
      workImage="/assets/evening_honfleur.jpg"
      workAlt="Evening, Honfleur"
      workAspect={2000 / 1696}
      unitScale={50}
      unitX={-750}
      unitY={10}
    />
  );
}
