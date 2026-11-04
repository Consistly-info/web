/**
 * Sample data for the Social Challenges showcase. It is illustrative only: the
 * feature is planned, and these people and sessions are not real.
 *
 * Each string is one week, Monday to Sunday, where 1 is a completed session.
 */
const YOU =
  "1010101 1100110 0110100 1011010 1101010 1010010 0101001 1100110 1010110";
const MIA =
  "0110010 1001010 1010011 0100110 1010010 1100101 1011010 0110001 0101001";

const flags = (weeks: string) =>
  weeks
    .replaceAll(" ", "")
    .split("")
    .map((c) => c === "1");

const you = flags(YOU);
const mia = flags(MIA);

export const DURATION = 90;
export const ELAPSED = you.length;
const START = Date.UTC(2026, 7, 31); // A Monday, so each row is one weekday
const DAY_MS = 86_400_000;

export type DayState = "you" | "mia" | "both" | "none" | "upcoming";

export interface ChallengeDay {
  index: number;
  date: string;
  label: string;
  state: DayState;
  who: string;
}

function stateOf(index: number): DayState {
  if (index >= ELAPSED) return "upcoming";
  if (you[index] && mia[index]) return "both";
  if (you[index]) return "you";
  if (mia[index]) return "mia";
  return "none";
}

const WHO: Record<DayState, string> = {
  both: "You and Mia",
  you: "You",
  mia: "Mia",
  none: "No cooking",
  upcoming: "Upcoming",
};

export const CHALLENGE_DAYS: ChallengeDay[] = Array.from(
  { length: DURATION },
  (_, index) => {
    const date = new Date(START + index * DAY_MS);
    const state = stateOf(index);
    return {
      index,
      state,
      date: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
      who: WHO[state],
    };
  },
);

const elapsed = CHALLENGE_DAYS.slice(0, ELAPSED);
let streak = 0;
for (const day of [...elapsed].reverse()) {
  if (day.state === "none") break;
  streak += 1;
}

export const CHALLENGE_STATS = {
  completion: Math.round((ELAPSED / DURATION) * 100),
  daysCompleted: elapsed.filter((d) => d.state !== "none").length,
  daysTogether: elapsed.filter((d) => d.state === "both").length,
  streak,
  remaining: DURATION - ELAPSED,
};

/** Sessions over the last five weeks, measured against 4 sessions a week. */
const RECENT_DAYS = 35;
const recent = (list: boolean[]) =>
  list.slice(-RECENT_DAYS).filter(Boolean).length;

export const LEADERBOARD = [
  { person: "you", name: "You", sessions: recent(you) },
  { person: "mia", name: "Mia", sessions: recent(mia) },
].map((row) => ({
  ...row,
  person: row.person as Person,
  goal: 20,
  rate: Math.round((row.sessions / 20) * 100),
}));

export type Person = "you" | "mia" | "sam";
