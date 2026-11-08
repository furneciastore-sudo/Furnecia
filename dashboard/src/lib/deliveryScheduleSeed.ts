// Real UK postcode -> delivery-day reference data, updated from the
// business's "Final_extended_routes_2026-2027" route sheet (same
// source used for the website's customer-facing delivery checker —
// see js/delivery-checker-data.js on the storefront).
//
// This sheet rotated every area's dispatch day forward by one from
// the previous sheet (Hull Mon->Tue, Norwich Tue->Wed, Birmingham
// Wed->Thu, Kent Thu->Fri, Newcastle Fri->Sat), and added Manchester
// as its own Monday route. The previous sheet's Saturday-anchored
// dispatch days (Nottingham, Birmingham-depends, Telford, Scotland,
// Wales, Oxford, Peterborough, Newcastle) could not be confidently
// matched to a new slot in the scan, since Saturday has no following
// working day to roll into — they were left unchanged as a
// conservative choice. Confirm with the delivery team whether those
// actually moved.
//
// The route sheet defines four route TYPES per area (fixed single
// day, everyday, 2-day lead time from a dispatch day, "depends on
// orders"), but this app's schedule model is simpler (just which
// weekdays a postcode is served on), so 2-day/depends-on-orders
// routes have been converted here: dispatch day shifted to the
// actual expected delivery day(s), Sunday always excluded. Where an
// area shows up under more than one route type, its served days are
// the union of all of them; staff should still confirm an exact date
// for anything marked "depends on orders" on the source sheet.
//
// Not yet included here, pending confirmation from the delivery
// team (same as flagged on the website checker): CT (Canterbury),
// SO, PO, GU (unclear parent group in the previous sheet); NR
// (Norwich), SP, DT, BA, TA (Plymouth group) were shaded "depends on
// orders" in this updated sheet unlike the rest of their groups —
// removed from their areas pending confirmation. Add any of these
// once confirmed, from Delivery Checker -> Manage Schedule.

export const DELIVERY_SCHEDULE_SEED: { postcodePrefix: string; areaName: string; days: string[] }[] = [
  { postcodePrefix: "AL", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "B", areaName: "Birmingham", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "BB", areaName: "Manchester", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "BD", areaName: "Leeds", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "BH", areaName: "Plymouth / South West", days: ["Wednesday"] },
  { postcodePrefix: "BL", areaName: "Manchester", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "BN", areaName: "Kent", days: ["Monday", "Wednesday", "Thursday", "Saturday"] },
  { postcodePrefix: "BR", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "BS", areaName: "Wales", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "CB", areaName: "Peterborough", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "CF", areaName: "Wales", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "CH", areaName: "Manchester", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "CM", areaName: "Nottingham", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "CO", areaName: "Norwich", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "CR", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "CV", areaName: "Birmingham", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "CW", areaName: "Stoke-on-Trent", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "DA", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "DE", areaName: "Nottingham", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "DG", areaName: "Scotland", days: ["Monday", "Tuesday", "Friday", "Saturday"] },
  { postcodePrefix: "DH", areaName: "Newcastle", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "DL", areaName: "Newcastle", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "DN", areaName: "Manchester", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "E", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "EC", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "EH", areaName: "Scotland", days: ["Monday", "Tuesday", "Friday", "Saturday"] },
  { postcodePrefix: "EN", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "EX", areaName: "Plymouth / South West", days: ["Wednesday"] },
  { postcodePrefix: "FK", areaName: "Scotland", days: ["Monday", "Tuesday", "Friday", "Saturday"] },
  { postcodePrefix: "FY", areaName: "Manchester", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "G", areaName: "Scotland", days: ["Monday", "Tuesday", "Friday", "Saturday"] },
  { postcodePrefix: "GL", areaName: "Wales", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "HA", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "HD", areaName: "Leeds", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "HG", areaName: "Newcastle", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "HP", areaName: "Oxford", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "HR", areaName: "Wales", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "HU", areaName: "Hull", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "HX", areaName: "Leeds", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "IG", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "IP", areaName: "Norwich", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "KA", areaName: "Scotland", days: ["Monday", "Tuesday", "Friday", "Saturday"] },
  { postcodePrefix: "KT", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "L", areaName: "Manchester", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "LE", areaName: "Nottingham", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "LN", areaName: "Hull", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "LS", areaName: "Leeds", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "LU", areaName: "Birmingham", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "M", areaName: "Manchester", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "ME", areaName: "Kent", days: ["Monday", "Wednesday", "Thursday", "Saturday"] },
  { postcodePrefix: "MK", areaName: "Birmingham", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "ML", areaName: "Scotland", days: ["Monday", "Tuesday", "Friday", "Saturday"] },
  { postcodePrefix: "N", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "NE", areaName: "Newcastle", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "NG", areaName: "Nottingham", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "NN", areaName: "Birmingham", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "NP", areaName: "Wales", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "NW", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "OL", areaName: "Manchester", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "OX", areaName: "Oxford", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "PE", areaName: "Peterborough", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "PL", areaName: "Plymouth / South West", days: ["Wednesday"] },
  { postcodePrefix: "PR", areaName: "Manchester", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "RG", areaName: "Oxford", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "RH", areaName: "Kent", days: ["Monday", "Wednesday", "Thursday", "Saturday"] },
  { postcodePrefix: "RM", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "S", areaName: "Manchester", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "SA", areaName: "Wales", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "SE", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "SG", areaName: "Birmingham", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "SK", areaName: "Manchester", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "SL", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "SM", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "SN", areaName: "Oxford", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "SR", areaName: "Newcastle", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "SS", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "ST", areaName: "Stoke-on-Trent", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "SW", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "SY", areaName: "Telford", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "TF", areaName: "Telford", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "TN", areaName: "Kent", days: ["Monday", "Wednesday", "Thursday", "Saturday"] },
  { postcodePrefix: "TQ", areaName: "Plymouth / South West", days: ["Wednesday"] },
  { postcodePrefix: "TR", areaName: "Plymouth / South West", days: ["Wednesday"] },
  { postcodePrefix: "TS", areaName: "Newcastle", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "TW", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "UB", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "W", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "WC", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "WD", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "WF", areaName: "Leeds", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "WR", areaName: "Wales", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "WS", areaName: "Birmingham", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "WV", areaName: "Birmingham", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "YO", areaName: "Hull", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
];
