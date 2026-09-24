
const jsHeader = `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, terminal: false });
let lines = [];
rl.on('line', (line) => lines.push(line));
rl.on('close', () => { main(); });
`;

const cppHeader = `#include <bits/stdc++.h>
using namespace std;
`;

export const leetcodeQuestions = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    description:
      "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`. Assume each input has exactly one solution, and you may not use the same element twice.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] == 9" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "Exactly one valid answer exists."],
    ioNote:
      "Input: line 1 is the array (space-separated), line 2 is the target. Output: the two indices, space-separated, in the order found.",
    starterCode: {
      javascript: jsHeader + `
function twoSum(nums, target) {
  // TODO: return [i, j] such that nums[i] + nums[j] === target
  return [];
}

function main() {
  const nums = lines[0].trim().split(/\\s+/).map(Number);
  const target = parseInt(lines[1].trim(), 10);
  console.log(twoSum(nums, target).join(' '));
}
`,
      python: `import sys

def two_sum(nums, target):
    # TODO: return [i, j] such that nums[i] + nums[j] == target
    return []

def main():
    data = sys.stdin.read().split('\\n')
    nums = list(map(int, data[0].split()))
    target = int(data[1].strip())
    print(' '.join(map(str, two_sum(nums, target))))

if __name__ == '__main__':
    main()
`,
      cpp: cppHeader + `
vector<int> twoSum(vector<int>& nums, int target) {
    // TODO: return {i, j} such that nums[i] + nums[j] == target
    return {};
}

int main() {
    string line;
    getline(cin, line);
    stringstream ss(line);
    vector<int> nums;
    int x;
    while (ss >> x) nums.push_back(x);
    int target;
    cin >> target;

    vector<int> result = twoSum(nums, target);
    for (size_t i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i + 1 < result.size()) cout << " ";
    }
    cout << endl;
    return 0;
}
`,
    },
    testCases: [
      { input: "2 7 11 15\n9", expectedOutput: "0 1" },
      { input: "3 2 4\n6", expectedOutput: "1 2" },
      { input: "3 3\n6", expectedOutput: "0 1" },
    ],
  },

  {
    id: "reverse-integer",
    title: "Reverse Integer",
    difficulty: "Medium",
    tags: ["Math"],
    description:
      "Given a signed 32-bit integer `x`, return `x` with its digits reversed. If reversing causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], return 0.",
    examples: [
      { input: "x = 123", output: "321" },
      { input: "x = -123", output: "-321" },
      { input: "x = 120", output: "21" },
    ],
    constraints: ["-2^31 <= x <= 2^31 - 1"],
    ioNote: "Input: a single integer. Output: the reversed integer (or 0 on overflow).",
    starterCode: {
      javascript: jsHeader + `
function reverse(x) {
  // TODO: return x with digits reversed, or 0 if it overflows 32-bit range
  return 0;
}

function main() {
  const x = parseInt(lines[0].trim(), 10);
  console.log(reverse(x));
}
`,
      python: `import sys

def reverse(x):
    # TODO: return x with digits reversed, or 0 if it overflows 32-bit range
    return 0

def main():
    x = int(sys.stdin.readline().strip())
    print(reverse(x))

if __name__ == '__main__':
    main()
`,
      cpp: cppHeader + `
int reverseInt(long long x) {
    // TODO: return x with digits reversed, or 0 if it overflows 32-bit range
    return 0;
}

int main() {
    long long x;
    cin >> x;
    cout << reverseInt(x) << endl;
    return 0;
}
`,
    },
    testCases: [
      { input: "123", expectedOutput: "321" },
      { input: "-123", expectedOutput: "-321" },
      { input: "120", expectedOutput: "21" },
      { input: "1534236469", expectedOutput: "0" },
    ],
  },

  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["String", "Stack"],
    description:
      "Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid. Brackets must close in the correct order and every opening bracket must have a matching closing bracket of the same type.",
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
    ],
    constraints: ["1 <= s.length <= 10^4", "s consists only of brackets ()[]{}."],
    ioNote: 'Input: a single line, the string `s`. Output: "true" or "false".',
    starterCode: {
      javascript: jsHeader + `
function isValid(s) {
  // TODO: return true if brackets in s are balanced and properly nested
  return false;
}

function main() {
  console.log(isValid(lines[0]) ? 'true' : 'false');
}
`,
      python: `import sys

def is_valid(s):
    # TODO: return True if brackets in s are balanced and properly nested
    return False

def main():
    s = sys.stdin.readline().strip()
    print('true' if is_valid(s) else 'false')

if __name__ == '__main__':
    main()
`,
      cpp: cppHeader + `
bool isValid(string s) {
    // TODO: return true if brackets in s are balanced and properly nested
    return false;
}

int main() {
    string s;
    getline(cin, s);
    cout << (isValid(s) ? "true" : "false") << endl;
    return 0;
}
`,
    },
    testCases: [
      { input: "()", expectedOutput: "true" },
      { input: "()[]{}", expectedOutput: "true" },
      { input: "(]", expectedOutput: "false" },
      { input: "([)]", expectedOutput: "false" },
      { input: "{[]}", expectedOutput: "true" },
    ],
  },

  {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming"],
    description:
      "Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum, and return that sum.",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "[4,-1,2,1] has the largest sum = 6." },
      { input: "nums = [1]", output: "1" },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    ioNote: "Input: a single line, the array (space-separated). Output: the maximum subarray sum.",
    starterCode: {
      javascript: jsHeader + `
function maxSubArray(nums) {
  // TODO: return the largest sum of any contiguous subarray
  return 0;
}

function main() {
  const nums = lines[0].trim().split(/\\s+/).map(Number);
  console.log(maxSubArray(nums));
}
`,
      python: `import sys

def max_subarray(nums):
    # TODO: return the largest sum of any contiguous subarray
    return 0

def main():
    nums = list(map(int, sys.stdin.readline().split()))
    print(max_subarray(nums))

if __name__ == '__main__':
    main()
`,
      cpp: cppHeader + `
int maxSubArray(vector<int>& nums) {
    // TODO: return the largest sum of any contiguous subarray
    return 0;
}

int main() {
    string line;
    getline(cin, line);
    stringstream ss(line);
    vector<int> nums;
    int x;
    while (ss >> x) nums.push_back(x);
    cout << maxSubArray(nums) << endl;
    return 0;
}
`,
    },
    testCases: [
      { input: "-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6" },
      { input: "1", expectedOutput: "1" },
      { input: "5 4 -1 7 8", expectedOutput: "23" },
    ],
  },

  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    tags: ["Dynamic Programming", "Math"],
    description:
      "You are climbing a staircase that takes `n` steps to reach the top. Each time you can climb either 1 or 2 steps. In how many distinct ways can you climb to the top?",
    examples: [
      { input: "n = 2", output: "2", explanation: "1+1 or 2" },
      { input: "n = 3", output: "3", explanation: "1+1+1, 1+2, or 2+1" },
    ],
    constraints: ["1 <= n <= 45"],
    ioNote: "Input: a single integer `n`. Output: the number of distinct ways.",
    starterCode: {
      javascript: jsHeader + `
function climbStairs(n) {
  // TODO: return the number of distinct ways to climb n stairs (1 or 2 steps at a time)
  return 0;
}

function main() {
  const n = parseInt(lines[0].trim(), 10);
  console.log(climbStairs(n));
}
`,
      python: `import sys

def climb_stairs(n):
    # TODO: return the number of distinct ways to climb n stairs (1 or 2 steps at a time)
    return 0

def main():
    n = int(sys.stdin.readline().strip())
    print(climb_stairs(n))

if __name__ == '__main__':
    main()
`,
      cpp: cppHeader + `
int climbStairs(int n) {
    // TODO: return the number of distinct ways to climb n stairs (1 or 2 steps at a time)
    return 0;
}

int main() {
    int n;
    cin >> n;
    cout << climbStairs(n) << endl;
    return 0;
}
`,
    },
    testCases: [
      { input: "2", expectedOutput: "2" },
      { input: "3", expectedOutput: "3" },
      { input: "5", expectedOutput: "8" },
    ],
  },

  {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    description:
      "Given an integer array `nums`, return true if any value appears at least twice in the array, and false if every element is distinct.",
    examples: [
      { input: "nums = [1,2,3,1]", output: "true" },
      { input: "nums = [1,2,3,4]", output: "false" },
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    ioNote: 'Input: a single line, the array (space-separated). Output: "true" or "false".',
    starterCode: {
      javascript: jsHeader + `
function containsDuplicate(nums) {
  // TODO: return true if any value appears at least twice
  return false;
}

function main() {
  const nums = lines[0].trim().split(/\\s+/).map(Number);
  console.log(containsDuplicate(nums) ? 'true' : 'false');
}
`,
      python: `import sys

def contains_duplicate(nums):
    # TODO: return True if any value appears at least twice
    return False

def main():
    nums = list(map(int, sys.stdin.readline().split()))
    print('true' if contains_duplicate(nums) else 'false')

if __name__ == '__main__':
    main()
`,
      cpp: cppHeader + `
bool containsDuplicate(vector<int>& nums) {
    // TODO: return true if any value appears at least twice
    return false;
}

int main() {
    string line;
    getline(cin, line);
    stringstream ss(line);
    vector<int> nums;
    int x;
    while (ss >> x) nums.push_back(x);
    cout << (containsDuplicate(nums) ? "true" : "false") << endl;
    return 0;
}
`,
    },
    testCases: [
      { input: "1 2 3 1", expectedOutput: "true" },
      { input: "1 2 3 4", expectedOutput: "false" },
      { input: "1 1 1 3 3 4 3 2 4 2", expectedOutput: "true" },
    ],
  },

  {
    id: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    tags: ["Array", "Dynamic Programming"],
    description:
      "You are given an array `prices` where `prices[i]` is the price of a stock on day `i`. You want to maximize profit by choosing a single day to buy and a different later day to sell. Return the maximum profit achievable, or 0 if no profit is possible.",
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price 1), sell on day 5 (price 6)." },
      { input: "prices = [7,6,4,3,1]", output: "0", explanation: "Prices only fall, so no profit is possible." },
    ],
    constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
    ioNote: "Input: a single line, the price array (space-separated). Output: the maximum profit.",
    starterCode: {
      javascript: jsHeader + `
function maxProfit(prices) {
  // TODO: return the maximum profit from one buy + one later sell
  return 0;
}

function main() {
  const prices = lines[0].trim().split(/\\s+/).map(Number);
  console.log(maxProfit(prices));
}
`,
      python: `import sys

def max_profit(prices):
    # TODO: return the maximum profit from one buy + one later sell
    return 0

def main():
    prices = list(map(int, sys.stdin.readline().split()))
    print(max_profit(prices))

if __name__ == '__main__':
    main()
`,
      cpp: cppHeader + `
int maxProfit(vector<int>& prices) {
    // TODO: return the maximum profit from one buy + one later sell
    return 0;
}

int main() {
    string line;
    getline(cin, line);
    stringstream ss(line);
    vector<int> prices;
    int x;
    while (ss >> x) prices.push_back(x);
    cout << maxProfit(prices) << endl;
    return 0;
}
`,
    },
    testCases: [
      { input: "7 1 5 3 6 4", expectedOutput: "5" },
      { input: "7 6 4 3 1", expectedOutput: "0" },
    ],
  },

  {
    id: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "Easy",
    tags: ["String", "Hash Table"],
    description:
      "Given two strings `s` and `t`, return true if `t` is an anagram of `s`, and false otherwise.",
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: "true" },
      { input: 's = "rat", t = "car"', output: "false" },
    ],
    constraints: ["1 <= s.length, t.length <= 5 * 10^4"],
    ioNote: 'Input: line 1 is `s`, line 2 is `t`. Output: "true" or "false".',
    starterCode: {
      javascript: jsHeader + `
function isAnagram(s, t) {
  // TODO: return true if t is an anagram of s
  return false;
}

function main() {
  const s = lines[0].trim();
  const t = lines[1].trim();
  console.log(isAnagram(s, t) ? 'true' : 'false');
}
`,
      python: `import sys

def is_anagram(s, t):
    # TODO: return True if t is an anagram of s
    return False

def main():
    data = sys.stdin.read().split('\\n')
    s = data[0].strip()
    t = data[1].strip()
    print('true' if is_anagram(s, t) else 'false')

if __name__ == '__main__':
    main()
`,
      cpp: cppHeader + `
bool isAnagram(string s, string t) {
    // TODO: return true if t is an anagram of s
    return false;
}

int main() {
    string s, t;
    getline(cin, s);
    getline(cin, t);
    cout << (isAnagram(s, t) ? "true" : "false") << endl;
    return 0;
}
`,
    },
    testCases: [
      { input: "anagram\nnagaram", expectedOutput: "true" },
      { input: "rat\ncar", expectedOutput: "false" },
    ],
  },
];

export const languageMeta = {
  javascript: { label: "JavaScript", monacoId: "javascript" },
  python: { label: "Python", monacoId: "python" },
  cpp: { label: "C++", monacoId: "cpp" },
};

export function getQuestionById(id) {
  return leetcodeQuestions.find((q) => q.id === id);
}
