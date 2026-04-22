import { WorkPage } from "@/components/work-page";
import { Building2 } from "lucide-react";

export default function RomanMosaicPage() {
  return (
    <WorkPage
      slug="roman-mosaic"
      image={{
        unitSrc: "/assets/roman_mosaic_unit.png",
        unitAlt: "Roman mosaic unit",
        workSrc: "/assets/roman_mosaic.jpg",
        workAlt: "Roman mosaic",
        workAspect: 3469 / 3803,
        unitCx: 0.5011,
        unitCy: 0.4974,
        unitFraction: 0.043,
      }}
      details={<>
        <p className="text-lg font-bold">{"Roman"}</p>
        <p className="italic">{"Mosaic floor panel"}</p>
        <p>{"2nd century CE"}</p>

        <div className="flex items-center gap-2 text-muted mt-3">
          <Building2 size={16} strokeWidth={1.5} />
          <p className="font-medium">{"The Metropolitan Museum of Art"}</p>
        </div>

        <hr className="my-5 border-muted/25" />

        <p>{"Stone, tile, and glass"}</p>
      </>}
    />
  );
}
