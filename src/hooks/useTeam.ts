import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';
import { TeamMember } from '../lib/supabase';

export interface TeamResponse {
  success: boolean;
  data: TeamMember[];
  message?: string;
  error?: string;
}

export const useTeam = (activeOnly: boolean = true) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.getTeamMembers(activeOnly);
      
      if (response.data) {
        setTeamMembers(response.data as TeamMember[]);
      } else {
        console.error('Failed to fetch team members');
        setTeamMembers(getFallbackTeamMembers());
      }
    } catch (err) {
      console.error('Error fetching team members:', err);
      setError('Failed to fetch team members');
      setTeamMembers(getFallbackTeamMembers());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [activeOnly]);

  return {
    teamMembers,
    isLoading,
    error,
    refetch: fetchTeamMembers
  };
};

// Fallback team members when API is not available
const getFallbackTeamMembers = (): TeamMember[] => [
  {
    id: '1',
    name: 'Sufyan',
    role: 'Founder & Lead Developer',
    bio: 'Full-stack developer with 8+ years experience in building scalable applications.',
    image: '/images/team/backup/sufyan.jpg',
    image_url: '/images/team/backup/sufyan.jpg',
    linkedin_url: 'https://linkedin.com/in/sufyan',
    github_url: 'https://github.com/sufyan',
    email: 'sufyan@havocsolutions.com',
    phone: '',
    social_links: {
      linkedin: 'https://linkedin.com/in/sufyan',
      github: 'https://github.com/sufyan'
    },
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Ateeq',
    role: 'Co-founder & CTO',
    bio: 'Tech leader specializing in system architecture and emerging technologies.',
    image: '/images/team/backup/ateeq.jpg',
    image_url: '/images/team/backup/ateeq.jpg',
    linkedin_url: 'https://linkedin.com/in/ateeq',
    github_url: 'https://github.com/ateeq',
    email: 'ateeq@havocsolutions.com',
    phone: '',
    social_links: {
      linkedin: 'https://linkedin.com/in/ateeq',
      github: 'https://github.com/ateeq'
    },
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Team Member 1',
    role: 'Senior Developer',
    bio: 'Experienced professional contributing to innovative solutions and client success.',
    image: '/images/team/backup/member1.jpg',
    image_url: '/images/team/backup/member1.jpg',
    linkedin_url: 'https://linkedin.com/in/member1',
    github_url: '',
    email: 'member1@havocsolutions.com',
    phone: '',
    social_links: {
      linkedin: 'https://linkedin.com/in/member1'
    },
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Team Member 2',
    role: 'UI/UX Designer',
    bio: 'Experienced professional contributing to innovative solutions and client success.',
    image: '/images/team/backup/member2.jpg',
    image_url: '/images/team/backup/member2.jpg',
    linkedin_url: 'https://linkedin.com/in/member2',
    github_url: '',
    email: 'member2@havocsolutions.com',
    phone: '',
    social_links: {
      linkedin: 'https://linkedin.com/in/member2'
    },
    is_active: true,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Team Member 3',
    role: 'QA Engineer',
    bio: 'Experienced professional contributing to innovative solutions and client success.',
    image: '/images/team/backup/member3.jpg',
    image_url: '/images/team/backup/member3.jpg',
    linkedin_url: 'https://linkedin.com/in/member3',
    github_url: '',
    email: 'member3@havocsolutions.com',
    phone: '',
    social_links: {
      linkedin: 'https://linkedin.com/in/member3'
    },
    is_active: true,
    display_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
