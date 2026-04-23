import { WorkPage } from "@/components/work-page";
import { Building2 } from "lucide-react";

export default function StillAfterCindyShermanPage() {
  return (
    <WorkPage
      image={{
        unitSrc: "/assets/still_after_cindy_sherman_unit.png",
        unitAlt: "Still, after Cindy Sherman unit",
        workSrc: "/assets/still_after_cindy_sherman.jpg",
        workAlt: "Still, after Cindy Sherman",
        workAspect: 2000 / 1484,
        unitCx: 0.487,
        unitCy: 0.46,
        unitFraction: 0.04,
      }}
      details={<>
        <p className="text-lg font-bold">{"Vik Muniz"}</p>
        <p className="italic">{"Still, after Cindy Sherman (from Pictures of Ink)"}</p>
        <p>{"2000"}</p>

        <div className="flex items-center gap-2 text-muted mt-3">
          <Building2 size={16} strokeWidth={1.5} />
          <p className="font-medium">{"The Museum of Modern Art"}</p>
        </div>

        <hr className="my-5 border-muted/25" />

        <p>{"Silver dye bleach print"}</p>
      </>}
    />
  );
}
