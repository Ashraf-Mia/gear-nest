import { Suspense } from "react";

type EquipmentPageProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

// Reading searchParams needs a Suspense boundary when Cache Components is on.
async function EquipmentContent({ searchParams }: EquipmentPageProps) {
  const search = await searchParams;
  console.log(search);

  return (
    <div>
      <h2>Equipment</h2>
    </div>
  );
}

const EquipmentPage = (props: EquipmentPageProps) => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <EquipmentContent searchParams={props.searchParams} />
    </Suspense>
  );
};

export default EquipmentPage;
// ?job-type=full-time&location=remote&sort=recent
