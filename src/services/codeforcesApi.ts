interface CodeforcesUser {
  handle: string;
  email?: string;
  vkId?: string;
  openId?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  city?: string;
  organization?: string;
  contribution: number;
  rank: string;
  rating: number;
  maxRank: string;
  maxRating: number;
  lastOnlineTimeSeconds: number;
  registrationTimeSeconds: number;
  friendOfCount: number;
  avatar: string;
  titlePhoto: string;
}

interface CodeforcesSubmission {
  id: number;
  contestId?: number;
  creationTimeSeconds: number;
  relativeTimeSeconds: number;
  problem: {
    contestId?: number;
    problemsetName?: string;
    index: string;
    name: string;
    type: string;
    points?: number;
    rating?: number;
    tags: string[];
  };
  author: {
    contestId?: number;
    members: Array<{
      handle: string;
      name?: string;
    }>;
    participantType: string;
    ghost: boolean;
    room?: number;
    startTimeSeconds?: number;
  };
  programmingLanguage: string;
  verdict?: string;
  testset: string;
  passedTestCount: number;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
}

interface CodeforcesContest {
  id: number;
  contestId: number;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

export const codeforcesApi = {
  async getUserInfo(handle: string): Promise<CodeforcesUser> {
    const response = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(data.comment || 'Failed to fetch user info');
    }
    
    return data.result[0];
  },

  async getUserSubmissions(handle: string): Promise<CodeforcesSubmission[]> {
    // FIX APPLIED: The 'count' is now set to a very large number to fetch all submissions.
    const response = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=100000`);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(data.comment || 'Failed to fetch submissions');
    }
    
    return data.result;
  },

  async getUserRating(handle: string): Promise<CodeforcesContest[]> {
    const response = await fetch(`https://codeforces.com/api/user.rating?handle=${handle}`);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(data.comment || 'Failed to fetch rating history');
    }
    
    return data.result;
  }
};

export const getRankColor = (rank: string): string => {
  switch (rank) {
    case 'newbie': return 'text-gray-600';
    case 'pupil': return 'text-green-600';
    case 'specialist': return 'text-cyan-600';
    case 'expert': return 'text-blue-600';
    case 'candidate master': return 'text-purple-600';
    case 'master': return 'text-orange-600';
    case 'international master': return 'text-orange-600';
    case 'grandmaster': return 'text-red-600';
    case 'international grandmaster': return 'text-red-600';
    case 'legendary grandmaster': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

export const getProblemRatingColor = (rating?: number): string => {
  if (!rating) return 'text-gray-600';
  
  if (rating < 1200) return 'text-gray-600';
  if (rating < 1400) return 'text-green-600';
  if (rating < 1600) return 'text-cyan-600';
  if (rating < 1900) return 'text-blue-600';
  if (rating < 2100) return 'text-purple-600';
  if (rating < 2400) return 'text-orange-600';
  return 'text-red-600';
};
