
export const mockUserData = {
  handle: "tourist",
  rating: 3822,
  maxRating: 3822,
  rank: "legendary grandmaster",
  submissions: [
    {
      id: 1,
      contestId: 1700,
      creationTimeSeconds: 1690000000,
      problem: {
        name: "Problem A",
        rating: 800,
        tags: ["implementation", "math"]
      },
      verdict: "OK",
      programmingLanguage: "C++17"
    },
    {
      id: 2,
      contestId: 1700,
      creationTimeSeconds: 1690001000,
      problem: {
        name: "Problem B",
        rating: 1200,
        tags: ["greedy", "sortings"]
      },
      verdict: "WRONG_ANSWER",
      programmingLanguage: "C++17"
    },
    {
      id: 3,
      contestId: 1700,
      creationTimeSeconds: 1690002000,
      problem: {
        name: "Problem B",
        rating: 1200,
        tags: ["greedy", "sortings"]
      },
      verdict: "OK",
      programmingLanguage: "C++17"
    },
    {
      id: 4,
      contestId: 1701,
      creationTimeSeconds: 1690100000,
      problem: {
        name: "Problem C",
        rating: 1600,
        tags: ["dp", "graphs"]
      },
      verdict: "OK",
      programmingLanguage: "C++17"
    }
  ],
  contests: [
    {
      contestId: 1700,
      contestName: "Codeforces Round #808",
      handle: "tourist",
      rank: 1,
      ratingUpdateTimeSeconds: 1690010000,
      oldRating: 3800,
      newRating: 3822
    },
    {
      contestId: 1701,
      contestName: "Codeforces Round #809",
      handle: "tourist",
      rank: 2,
      ratingUpdateTimeSeconds: 1690110000,
      oldRating: 3822,
      newRating: 3815
    }
  ]
};
