// Real UK postcode -> delivery-day reference data, updated from the
// business's official "FINAL NEW ROUTES Operations 2026" route sheet
// (same source used for the website's customer-facing delivery
// checker — see js/delivery-checker-data.js on the storefront).
//
// The route sheet actually defines four route TYPES per area (fixed
// single day, everyday, 2-day lead time from a dispatch day, and
// "depends on orders"), but this app's schedule model is simpler
// (just which weekdays a postcode is served on), so the 2-day/
// depends-on-orders routes have been converted here: their dispatch
// day has been shifted forward to the actual expected delivery
// day(s) — e.g. a Monday dispatch becomes Tuesday+Wednesday — with
// Sunday always excluded. Where an area shows up under more than one
// route type (several do, in the original sheet) its served days are
// the union of all of them; staff should still confirm an exact date
// with the customer for anything marked "depends on orders" in that
// source sheet, same as the website does.
//
// Not yet included here, pending confirmation from the delivery
// team (same as flagged on the website checker): CT (Canterbury) was
// shaded differently from the rest of Kent in the source scan; SO,
// PO, GU appeared with no clear parent area on the sheet. Add them
// once confirmed, from Delivery Checker -> Manage Schedule.

export const DELIVERY_SCHEDULE_SEED: { postcodePrefix: string; areaName: string; days: string[] }[] = [
  { postcodePrefix: "AL", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "B", areaName: "Birmingham", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "BA", areaName: "Plymouth / South West", days: ["Tuesday"] },
  { postcodePrefix: "BB", areaName: "Manchester", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "BD", areaName: "Leeds", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "BH", areaName: "Plymouth / South West", days: ["Tuesday"] },
  { postcodePrefix: "BL", areaName: "Manchester", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "BN", areaName: "Kent", days: ["Tuesday", "Wednesday", "Friday", "Saturday"] },
  { postcodePrefix: "BR", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "BS", areaName: "Wales", days: ["Monday", "Wednesday", "Thursday", "Saturday"] },
  { postcodePrefix: "CA", areaName: "Scotland", days: ["Monday", "Tuesday"] },
  { postcodePrefix: "CB", areaName: "Peterborough", days: ["Monday", "Wednesday", "Thursday", "Saturday"] },
  { postcodePrefix: "CF", areaName: "Wales", days: ["Monday", "Wednesday", "Thursday", "Saturday"] },
  { postcodePrefix: "CH", areaName: "Manchester", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "CM", areaName: "Nottingham", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "CO", areaName: "Norwich", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "CR", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "CV", areaName: "Birmingham", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "CW", areaName: "Stoke-on-Trent", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "DA", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "DE", areaName: "Nottingham", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "DG", areaName: "Scotland", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "DH", areaName: "Newcastle", days: ["Monday", "Wednesday", "Thursday", "Saturday"] },
  { postcodePrefix: "DL", areaName: "Newcastle", days: ["Monday", "Wednesday", "Thursday", "Saturday"] },
  { postcodePrefix: "DN", areaName: "Manchester", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "DT", areaName: "Plymouth / South West", days: ["Tuesday"] },
  { postcodePrefix: "E", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "EC", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "EH", areaName: "Scotland", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "EN", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "EX", areaName: "Plymouth / South West", days: ["Tuesday"] },
  { postcodePrefix: "FK", areaName: "Scotland", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "FY", areaName: "Manchester", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "G", areaName: "Scotland", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "GL", areaName: "Wales", days: ["Monday", "Wednesday", "Thursday", "Saturday"] },
  { postcodePrefix: "HA", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "HD", areaName: "Leeds", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "HG", areaName: "Newcastle", days: ["Monday", "Wednesday", "Thursday", "Saturday"] },
  { postcodePrefix: "HP", areaName: "Oxford", days: ["Monday", "Wednesday", "Thursday", "Saturday"] },
  { postcodePrefix: "HR", areaName: "Wales", days: ["Monday", "Wednesday", "Thursday", "Saturday"] },
  { postcodePrefix: "HU", areaName: "Hull", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "HX", areaName: "Leeds", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "IG", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "IP", areaName: "Norwich", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "KA", areaName: "Scotland", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "KT", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "L", areaName: "Manchester", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "LE", areaName: "Nottingham", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "LN", areaName: "Hull", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "LS", areaName: "Leeds", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "LU", areaName: "Birmingham", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "M", areaName: "Manchester", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "ME", areaName: "Kent", days: ["Tuesday", "Wednesday", "Friday", "Saturday"] },
  { postcodePrefix: "MK", areaName: "Birmingham", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "ML", areaName: "Scotland", days: ["Monday", "Tuesday", "Thursday", "Friday"] },
  { postcodePrefix: "N", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "NE", areaName: "Newcastle", days: ["Monday", "Wednesday", "Thursday", "Saturday"] },
  { postcodePrefix: "NG", areaName: "Nottingham", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "NN", areaName: "Birmingham", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "NP", areaName: "Wales", days: ["Monday", "Wednesday", "Thursday", "Saturday"] },
  { postcodePrefix: "NR", areaName: "Norwich", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "NW", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "OL", areaName: "Manchester", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "OX", areaName: "Oxford", days: ["Monday", "Wednesday", "Thursday", "Saturday"] },
  { postcodePrefix: "PE", areaName: "Peterborough", days: ["Monday", "Wednesday", "Thursday", "Saturday"] },
  { postcodePrefix: "PL", areaName: "Plymouth / South West", days: ["Tuesday"] },
  { postcodePrefix: "PR", areaName: "Manchester", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "RG", areaName: "Oxford", days: ["Monday", "Wednesday", "Thursday", "Saturday"] },
  { postcodePrefix: "RH", areaName: "Kent", days: ["Tuesday", "Wednesday", "Friday", "Saturday"] },
  { postcodePrefix: "RM", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "S", areaName: "Manchester", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "SA", areaName: "Wales", days: ["Monday", "Wednesday", "Thursday", "Saturday"] },
  { postcodePrefix: "SE", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "SG", areaName: "Birmingham", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "SK", areaName: "Manchester", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "SL", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "SM", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "SN", areaName: "Oxford", days: ["Monday", "Wednesday", "Thursday", "Saturday"] },
  { postcodePrefix: "SP", areaName: "Plymouth / South West", days: ["Tuesday"] },
  { postcodePrefix: "SR", areaName: "Newcastle", days: ["Monday", "Wednesday", "Thursday", "Saturday"] },
  { postcodePrefix: "SS", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "ST", areaName: "Stoke-on-Trent", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "SW", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "SY", areaName: "Telford", days: ["Monday", "Tuesday", "Wednesday", "Thursday"] },
  { postcodePrefix: "TA", areaName: "Plymouth / South West", days: ["Tuesday"] },
  { postcodePrefix: "TF", areaName: "Telford", days: ["Monday", "Tuesday", "Wednesday", "Thursday"] },
  { postcodePrefix: "TN", areaName: "Kent", days: ["Tuesday", "Wednesday", "Friday", "Saturday"] },
  { postcodePrefix: "TQ", areaName: "Plymouth / South West", days: ["Tuesday"] },
  { postcodePrefix: "TR", areaName: "Plymouth / South West", days: ["Tuesday"] },
  { postcodePrefix: "TS", areaName: "Newcastle", days: ["Monday", "Wednesday", "Thursday", "Saturday"] },
  { postcodePrefix: "TW", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "UB", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "W", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "WC", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "WD", areaName: "London Local", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "WF", areaName: "Leeds", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "WR", areaName: "Wales", days: ["Monday", "Wednesday", "Thursday", "Saturday"] },
  { postcodePrefix: "WS", areaName: "Birmingham", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "WV", areaName: "Birmingham", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  { postcodePrefix: "YO", areaName: "Hull", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
];
