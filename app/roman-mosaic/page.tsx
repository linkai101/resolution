import { WorkPage } from "@/components/work-page";

export default function RomanMosaicPage() {
  return (
    <WorkPage
      slug="roman-mosaic"
      unitImage="/assets/roman_mosaic_unit.png"
      unitAlt="Roman mosaic unit"
      workImage="/assets/roman_mosaic.jpg"
      workAlt="Roman mosaic"
      workAspect={3469 / 3803}
      unitScale={6}
      unitX={-4}
      unitY={10}
    />
  );
}
