export const initialLeaderboard = [
  { name: "Marcus Aurelius", handle: "@coder_marcus", streak: 42, level: 3, xp: 2150, weekly: 450, avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80" },
  { name: "Elena Rostova", handle: "@elena_design", streak: 35, level: 2, xp: 1850, weekly: 390, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80" },
  { name: "Samuel Vance", handle: "@cyber_sam", streak: 29, level: 2, xp: 1220, weekly: 280, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" },
  { name: "Lisa Wong", handle: "@lisa_code", streak: 12, level: 1, xp: 620, weekly: 150, avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80" },
  { name: "Alex Rivera", handle: "@alex_dev", streak: 18, level: 1, xp: 550, weekly: 110, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80" },
  { name: "You (Console Lord)", handle: "@console_lord", streak: 28, level: 1, xp: 350, weekly: 90, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80" },
  { name: "Nikolai Petrov", handle: "@nik_rust", streak: 3, level: 1, xp: 180, weekly: 40, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80" }
];

export const buddyProfiles = [
  { name: "Alex Rivera", handle: "@alex_dev", GitHub: "@alexrivera", streak: "18 days", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80" },
  { name: "Lisa Wong", handle: "@lisa_code", GitHub: "@lisawongcode", streak: "12 days", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80" },
  { name: "Samuel Vance", handle: "@cyber_sam", GitHub: "@samvance", streak: "29 days", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" }
];

export const codeSnippets = {
  python: `class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        from collections import deque
        q = deque() # store indices
        res = []
        for i, x in enumerate(nums):
            while q and nums[q[-1]] <= x:
                q.pop()
            q.append(i)
            # remove first element if it's out of window
            if q[0] == i - k:
                q.popleft()
            if i >= k - 1:
                res.append(nums[q[0]])
        return res`,
  javascript: `class Solution {
    maxSlidingWindow(nums, k) {
        const q = []; // double ended queue
        const res = [];
        for (let i = 0; i < nums.length; i++) {
            // Remove numbers smaller than current
            while (q.length && nums[q[q.length - 1]] <= nums[i]) {
                q.pop();
            }
            q.push(i);
            // Remove elements out of window range
            if (q[0] === i - k) {
                q.shift();
            }
            // Append current window maximum
            if (i >= k - 1) {
                res.push(nums[q[0]]);
            }
        }
        return res;
    }
}`,
  cpp: `class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        deque<int> dq;
        vector<int> ans;
        for (int i = 0; i < nums.size(); ++i) {
            while (!dq.empty() && nums[dq.back()] <= nums[i]) {
                dq.pop_back();
            }
            dq.push_back(i);
            if (dq.front() == i - k) {
                dq.pop_front();
            }
            if (i >= k - 1) {
                ans.push_back(dq.front());
            }
        }
        return ans;
    }
};`
};

export const cycleSteps = [
  {
    num: "STEP 01 / 05",
    title: "Structured Learning Module",
    description: "Begin the day by diving deep into algorithmic concepts and system architecture blueprints. Daily modules are structured in written and interactive formats, detailing memory efficiency and computing costs.",
    metric: "Time block: 09:00 - 13:00 UTC | Output: Conceptual notes & syntax diagrams"
  },
  {
    num: "STEP 02 / 05",
    title: "Algorithmic Problem Solving",
    description: "Access the LeetCode daily sandbox. Implement efficient solutions, bypass cubic time complexities, and review constraints. Your solutions are pushed into standard compilers for performance evaluation.",
    metric: "Time block: 13:00 - 16:00 UTC | Output: 1-3 Solved Code Snippets"
  },
  {
    num: "STEP 03 / 05",
    title: "Project Architecture Build",
    description: "Build code segments for the weekly project. Construct schemas, establish APIs, debug containers, and document system components. Code must follow strict linting constraints.",
    metric: "Time block: 16:00 - 20:00 UTC | Output: Pushed Project Repos"
  },
  {
    num: "STEP 04 / 05",
    title: "Commit and Submit PoW",
    description: "Push changes to your GitHub branch. The Velocity bot checks compilation, tests constraints, and reads commit syntax. Update check-in sheets and review matches with your paired buddy.",
    metric: "Time block: 20:00 - 21:00 UTC | Output: Validated PRs & check-in log"
  },
  {
    num: "STEP 05 / 05",
    title: "Reflect and Peer Review",
    description: "Review your buddy's code submissions, suggest optimizations, and schedule programming sessions. Update notes on design patterns before rest.",
    metric: "Time block: 21:00 - 22:30 UTC | Output: Code review comments & schedules"
  }
];


export const BACKEND_URL = "https://g-crack-iota.vercel.app/";

