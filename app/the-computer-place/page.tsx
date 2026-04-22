import { WorkPage } from "@/components/work-page";

export default function TheComputerPlacePage() {
  return (
    <WorkPage
      slug="the-computer-place"
      unitImage="/assets/the_computer_place_unit.png"
      unitAlt="The computer place unit"
      workImage="/assets/the_computer_place.jpg"
      workAlt="The computer place"
      workAspect={1}
      unitScale={4.5}
      unitX={98}
      unitY={73}
    />
  );
}
