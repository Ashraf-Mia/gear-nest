import React from "react";

const EquipmentPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const search = await searchParams;
  console.log(search);
  return (
    <div>
      <h2>Equipment</h2>
    </div>
  );
};

export default EquipmentPage;
// ?job-type=full-time&location=remote&sort=recent
