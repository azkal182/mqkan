import React from 'react';
import { getRegions } from '@/actions/region-action';
import { RegionCombobox } from '@/components/region-combobox';
import { getParticipants } from '@/actions/participant-action';

const Page = async () => {
  const items = await getRegions();
  const participants = await getParticipants({});
  console.log(JSON.stringify(participants, null, 2));

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
