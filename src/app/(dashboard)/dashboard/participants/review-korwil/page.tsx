'use client';
import {
  getParticipantById,
  getReviewById,
  ParticipantResponse
} from '@/actions/participant-action';
import PageContainer from '@/components/layout/page-container';
import ReviewForm from '@/features/review/components/form-review';
import { notFound, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const searchParams = useSearchParams();
  const participantId = searchParams.get('participantId');
  const [participant, setParticipant] = useState<any>(null);

  if (!participantId) notFound();

  const getParticipant = async () => {
    const data = await getReviewById(participantId);
    setParticipant(data);
  };

  useEffect(() => {
    getParticipant();
  }, []);
  return (
    <PageContainer>
      {participant && <ReviewForm data={participant} />}
    </PageContainer>
  );
};

export default Page;
