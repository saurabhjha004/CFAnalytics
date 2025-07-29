import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// Import the submission type definition from your API file
import type { CodeforcesSubmission } from "../services/codeforcesApi";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// FIX APPLIED: Using the specific 'CodeforcesSubmission' type instead of 'any'
export function getUniqueSolvedProblems(submissions: CodeforcesSubmission[]): number {
  const solvedProblems = new Set<string>();
  
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

// FIX APPLIED: Replaced the flawed logic with a correct implementation
export function getAverageAttempts(submissions: CodeforcesSubmission[]): number {
  // 1. Group all submissions by their unique problem ID
  const submissionsByProblem = new Map<string, CodeforcesSubmission[]>();
  submissions.forEach(sub => {
    const problemId = sub.problem.contestId
      ? `${sub.problem.contestId}${sub.problem.index}`
      : `${sub.problem.problemsetName || 'problemset'}${sub.problem.index}`;

    if (!submissionsByProblem.has(problemId)) {
      submissionsByProblem.set(problemId, []);
    }
    submissionsByProblem.get(problemId)!.push(sub);
  });

  let totalAttemptsForSolvedProblems = 0;
  let solvedProblemsCount = 0;

  // 2. Iterate through the grouped submissions
  for (const [_problemId, problemSubmissions] of submissionsByProblem.entries()) {
    // 3. Check if any submission for this problem has an 'OK' verdict
    const isSolved = problemSubmissions.some(sub => sub.verdict === 'OK');

    if (isSolved) {
      solvedProblemsCount++;
      totalAttemptsForSolvedProblems += problemSubmissions.length;
    }
  }

  // 4. Calculate the average, avoiding division by zero
  if (solvedProblemsCount === 0) {
    return 0;
  }
  
  const average = totalAttemptsForSolvedProblems / solvedProblemsCount;
  return parseFloat(average.toFixed(1));
}
