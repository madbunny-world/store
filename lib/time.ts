// Timezone display for the home page. Derive BOTH time and offset from Intl —
// never hardcode the offset. Eastern (NY/Detroit) flips GMT-5/-4 with DST; Seoul
// is GMT+9 year-round. The mock's "GMT-5" label is wrong; do not copy it.

export const ZONE = {
  eastern: "America/New_York", // NEW YORK, USA / DETROIT, USA — same zone
  seoul: "Asia/Seoul", // SEOUL, KR
} as const;

export type ZoneReadout = {
  hh: string;
  mm: string;
  /** e.g. "GMT-4", "GMT+9" — derived from Intl, not hardcoded. */
  offset: string;
};

export function zoneTime(date: Date, timeZone: string): ZoneReadout {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "shortOffset",
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  let hh = get("hour");
  if (hh === "24") hh = "00"; // some engines emit 24 at midnight with hour12:false

  return { hh, mm: get("minute"), offset: get("timeZoneName") };
}
