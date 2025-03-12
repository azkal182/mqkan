import React from 'react';
import { getRegions } from '@/actions/region-action';
import { RegionCombobox } from '@/components/region-combobox';

const Page = async () => {
  const items = await getRegions();

  // const handleSelectedIdChange = (id: string) => {
  //   // Handle selected ID changes here
  //   console.log('Selected ID:', id);
  // };
  return (
    <div>
      <RegionCombobox
        options={items}
        // onSelectedIdChange={handleSelectedIdChange}
      />
    </div>
  );
};

export default Page;
