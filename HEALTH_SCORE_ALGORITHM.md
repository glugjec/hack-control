# Team Health Score Algorithm Specification

> **Hackathon Git Sentinel Telemetry System**  
> *Dynamic, real-time evaluation of repository health and team commit velocity.*

---

## 📌 Overview

The **Team Health Score** is a real-time numerical indicator ($0\% - 100\%$) calculated dynamically from live GitHub API telemetry data. It evaluates four core pillars of hackathon performance: commit throughput, work recency, refactoring hygiene, and repository stability.

The final score is clamped between $40\%$ and $100\%$:

$$\text{Health Score} = \text{Clamp}\Big(40,\, 100,\, \text{Round}\big(\mathbf{P}_{\text{velocity}} + \mathbf{P}_{\text{recency}} + \mathbf{P}_{\text{hygiene}} + \mathbf{P}_{\text{stability}}\big)\Big)$$

---

## 🧮 Score Decomposition & Weights

| Metric Component | Max Points | Weight | Description |
| :--- | :---: | :---: | :--- |
| **1. Commit Velocity** | **35 pts** | **35%** | Measures total commit throughput during the event. |
| **2. Commit Recency** | **30 pts** | **30%** | Evaluates elapsed time since the team's latest commit. |
| **3. Code Refactor Hygiene** | **20 pts** | **20%** | Assesses code maintenance (ratio of lines deleted vs added). |
| **4. Build Stability** | **15 pts** | **15%** | Evaluates bugfix & rollback ratios vs feature commits. |
| **TOTAL SCORE RANGE** | **100 pts** | **100%** | Clamped Range: $[40\% - 100\%]$ |

---

## 📐 Detailed Formula Specifications

### 1. Commit Velocity ($\mathbf{P}_{\text{velocity}}$ — Max 35 Pts)
Measures commit momentum. Teams reaching 8 or more commits earn full credit:

$$\mathbf{P}_{\text{velocity}} = \min\left(35, \; \frac{N_{\text{commits}}}{8} \times 35\right)$$

*Example:* 4 total commits yields $\frac{4}{8} \times 35 = 17.5$ points.

---

### 2. Commit Recency ($\mathbf{P}_{\text{recency}}$ — Max 30 Pts)
Evaluates how actively the team is currently pushing changes ($\Delta t$ = hours since latest commit):

$$\mathbf{P}_{\text{recency}} = \begin{cases} 
30 \text{ pts} & \text{if } \Delta t \le 2 \text{ hours} \quad \text{(Active / Fresh)} \\
25 \text{ pts} & \text{if } 2 \text{ hrs} < \Delta t \le 12 \text{ hours} \\
20 \text{ pts} & \text{if } 12 \text{ hrs} < \Delta t \le 24 \text{ hours} \\
15 \text{ pts} & \text{if } \Delta t > 24 \text{ hours or no commit history}
\end{cases}$$

---

### 3. Code Refactor Hygiene ($\mathbf{P}_{\text{hygiene}}$ — Max 20 Pts)
Measures whether the team prunes and cleans legacy code rather than just stacking lines. The deletion ratio $R_{\text{del}}$ is defined as:

$$R_{\text{del}} = \frac{\text{Lines Deleted}}{\text{Lines Added}}$$

$$\mathbf{P}_{\text{hygiene}} = \begin{cases} 
20 \text{ pts} & \text{if } 0.05 \le R_{\text{del}} \le 0.50 \quad \text{(Optimal refactoring balance)} \\
16 \text{ pts} & \text{otherwise (Baseline score)}
\end{cases}$$

---

### 4. Build Stability ($\mathbf{P}_{\text{stability}}$ — Max 15 Pts)
Monitors repository health by calculating the ratio of fix/error commits $R_{\text{error}}$:

$$R_{\text{error}} = \frac{N_{\text{fixes}}}{N_{\text{commits}}}$$

$$\mathbf{P}_{\text{stability}} = \max\left(5, \; 15 - \text{Round}(R_{\text{error}} \times 15)\right)$$

*Example:* If $30\%$ of commits are emergency fixes, stability points are $15 - (0.30 \times 15) = 11$ points.

---

## 🎨 UI Color Classification

| Score Range | Status Level | Visual Indicator |
| :--- | :--- | :--- |
| **$86\% - 100\%$** | `EXCELLENT` | Emerald (`#4edea3`) — High activity & optimal hygiene |
| **$71\% - 85\%$** | `HEALTHY` | Cyan (`#4cd7f6`) — Steady development pace |
| **$40\% - 70\%$** | `NEEDS ATTENTION` | Coral (`#ffb4ab`) — Idle > 12 hours or elevated fix ratio |

---

## 💻 Source Code Implementation Reference

Located in `src/services/githubService.js`:

```javascript
export function calculateTeamHealthScore(team, teamCommits = []) {
  if (!team) return 85;
  const commits = teamCommits.length > 0 ? teamCommits : (team.teamCommits || []);
  const totalCommits = Math.max(team.totalCommits || 0, commits.length);

  if (totalCommits === 0) return 80;

  // 1. Velocity (35 pts max)
  const velocityPts = Math.min(35, (totalCommits / 8) * 35);

  // 2. Recency (30 pts max)
  let recencyPts = 15;
  if (commits.length > 0) {
    const latestRawTime = commits[0].rawTime || new Date().getTime();
    const hoursSinceLastCommit = (new Date().getTime() - latestRawTime) / (1000 * 60 * 60);
    if (hoursSinceLastCommit <= 2) recencyPts = 30;
    else if (hoursSinceLastCommit <= 12) recencyPts = 25;
    else if (hoursSinceLastCommit <= 24) recencyPts = 20;
    else recencyPts = 15;
  } else {
    recencyPts = 25;
  }

  // 3. Refactor Hygiene (20 pts max)
  let hygienePts = 16;
  const linesAdded = team.linesAdded || commits.reduce((acc, c) => acc + (c.linesAdded || 0), 0);
  const linesDeleted = team.linesDeleted || commits.reduce((acc, c) => acc + (c.linesDeleted || 0), 0);
  if (linesAdded > 0) {
    const delRatio = linesDeleted / linesAdded;
    if (delRatio >= 0.05 && delRatio <= 0.5) hygienePts = 20;
  }

  // 4. Build Stability (15 pts max)
  const fixCommits = commits.filter(c => c.type === 'fix' || c.type === 'error').length;
  const errorRatio = commits.length > 0 ? fixCommits / commits.length : 0;
  const stabilityPts = Math.max(5, 15 - Math.round(errorRatio * 15));

  // Final Clamped Score (40% - 100%)
  const totalScore = Math.round(velocityPts + recencyPts + hygienePts + stabilityPts);
  return Math.min(100, Math.max(40, totalScore));
}
```
