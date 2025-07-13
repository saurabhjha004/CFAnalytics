import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function getUniqueSolvedProblems(submissions: any[]): number {
  const solvedProblems = new Set();
  
  submissions
    .filter(s => s.verdict === 'OK')
    .forEach(s => {
      const problemId = s.problem.contestId 
        ? `${s.problem.contestId}${s.problem.index}`
        : `${s.problem.problemsetName || 'problemset'}${s.problem.index}`;
      solvedProblems.add(problemId);
    });
  
  return solvedProblems.size;
}

export function getAverageAttempts(submissions: any[]): number {
  const uniqueProblems = new Set();
  const totalSubmissions = submissions.length;
  
  submissions
    .filter(s => s.verdict === 'OK')
    .forEach(s => {
      const problemId = s.problem.contestId 
        ? `${s.problem.contestId}${s.problem.index}`
        : `${s.problem.problemsetName || 'problemset'}${s.problem.index}`;
      uniqueProblems.add(problemId);
    });
  
  return uniqueProblems.size > 0 ? 
    parseFloat((totalSubmissions / uniqueProblems.size).toFixed(1)) : 0;
}
