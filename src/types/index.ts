
export interface GitHubProfile {
  username: string;
  name: string;
  avatar: string;
  bio: string;
  publicRepos: number;
  followers: number;
  topLanguages: string[];
  daysSinceLastCommit: number | null;
  commitsThisYear: number;
}

export interface CompatibilityResult {
  score: number;
  roast: string;
  verdict: string;
  profile1: GitHubProfile;
  profile2: GitHubProfile;
  sharedLanguages: string[];
}
