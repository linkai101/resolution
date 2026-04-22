import { WorkPage } from "@/components/work-page";
import { Building2 } from "lucide-react";

export default function TheComputerPlacePage() {
  return (
    <WorkPage
      slug="the-computer-place"
      image={{
        unitSrc: "/assets/the_computer_place_unit.png",
        unitAlt: "The computer place unit",
        workSrc: "/assets/the_computer_place.jpg",
        workAlt: "The computer place",
        workAspect: 1,
        unitScale: 4.5,
        unitX: 98,
        unitY: 73,
      }}
      details={<>
        <p className="text-lg font-bold">{"Anna Bella Geiger"}</p>
        <p className="italic">{"The computer place (self portrait)"}</p>
        <p>{"1969"}</p>

        <div className="flex items-center gap-2 text-muted mt-3">
          <Building2 size={16} strokeWidth={1.5} />
          <p className="font-medium">{"New Museum"}</p>
        </div>

        <hr className="my-5 border-muted/25" />

        <p>{"Digital print on paper. Computerized image from 1969."}</p>
      </>}
    />
  );
}
