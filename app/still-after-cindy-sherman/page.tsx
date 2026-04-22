import { WorkPage } from "@/components/work-page";

export default function StillAfterCindyShermanPage() {
  return (
    <WorkPage
      slug="still-after-cindy-sherman"
      unitImage="/assets/still_after_cindy_sherman_unit.png"
      unitAlt="Still, after Cindy Sherman unit"
      workImage="/assets/still_after_cindy_sherman.jpg"
      workAlt="Still, after Cindy Sherman"
      workAspect={2000 / 1484}
      unitScale={5.5}
      unitX={44}
      unitY={98}
    />
  );
}
