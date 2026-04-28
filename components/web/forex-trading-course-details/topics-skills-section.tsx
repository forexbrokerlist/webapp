import React from 'react';
const RoundIcon = '/assets/images/round.svg';

interface TopicsSkillsSectionProps {
  broker: any;
  sectionTitle?: string;
}

export default function TopicsSkillsSection({
  broker,
  sectionTitle = "Topics & Skills Covered"
}: TopicsSkillsSectionProps) {
  // Combine topics_covered and skill_level for the chips
  const topics = broker.topics_covered || [];
  
  // Combine all skills and topics, removing duplicates
  const allSkills = [...new Set([...topics])];

  if (allSkills.length === 0) {
    return null;
  }

  return (
    <div className='p-4 rounded-xl border border-border-light300 bg-[#f0f1ec4d]'>
      <div className='flex items-center gap-2 pb-3'>
        <img src={RoundIcon} alt="RoundIcon" className='block' />
        <span className='block text-base font-medium text-black'>
          {sectionTitle}
        </span>
      </div>
      <div className='w-full h-[1px] bg-[linear-gradient(170deg,rgba(168,221,21,0.80)_0%,rgba(251,251,250,0.80)_60%)]'></div>
      <div className='pt-4'>
        <div className='flex flex-wrap gap-2'>
          {allSkills.map((skill: string, idx: number) => (
            <span
              key={idx}
              className='text-[12px] font-semibold px-3 py-1 rounded-full bg-[#A8DD15] text-black leading-tight'
            >
              {typeof skill === 'string' ? skill.charAt(0).toUpperCase() + skill.slice(1) : skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
