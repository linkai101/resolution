import { WorkPage } from "@/components/work-page";
import { Building2 } from "lucide-react";

export default function EveningHonfleurPage() {
  return (
    <WorkPage
      image={{
        unitSrc: "/assets/evening_honfleur_unit.png",
        unitAlt: "Evening, Honfleur unit",
        workSrc: "/assets/evening_honfleur.jpg",
        workAlt: "Evening, Honfleur",
        workAspect: 2000 / 1696,
        unitCx: 0.525,
        unitCy: 0.4996,
        unitFraction: 0.003,
      }}
      details={<>
        <p className="text-lg font-bold">{"Georges-Pierre Seurat"}</p>
        <p className="italic">{"Evening, Honfleur"}</p>
        <p>{"1886"}</p>

        <div className="flex items-center gap-2 text-muted mt-3">
          <Building2 size={16} strokeWidth={1.5} />
          <p className="font-medium">{"The Museum of Modern Art"}</p>
        </div>

        <hr className="my-5 border-muted/25" />

        <p>{"Oil on canvas, with painted wood frame"}</p>
      </>}
    />
  );
}
