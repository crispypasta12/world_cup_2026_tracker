// Maps both FIFA codes (GER, NED) and ISO alpha-3 codes (DEU, NLD) to ISO alpha-2
// since football-data.org uses both depending on the endpoint.
const CODE_TO_ISO: Record<string, string> = {
  // A
  AFG: "af", AFR: "za", ALB: "al", ALG: "dz", AND: "ad",
  ANG: "ao", ANT: "cw", ARG: "ar", ARM: "am", AUS: "au",
  AUT: "at", AZE: "az",
  // B
  BAH: "bs", BAN: "bd", BEL: "be", BFA: "bf", BDI: "bi",
  BIH: "ba", BLR: "by", BLZ: "bz", BOL: "bo", BOT: "bw",
  BRA: "br", BUL: "bg",
  // C
  CAM: "kh", CAN: "ca", CHE: "ch", CHI: "cl", CHL: "cl",
  CHN: "cn", CGO: "cg", CIV: "ci", COD: "cd", COL: "co",
  COM: "km", CPV: "cv", CRC: "cr", CRI: "cr", CRO: "hr",
  CUB: "cu", CUW: "cw", CYP: "cy", CZE: "cz",
  // D
  DEN: "dk", DEU: "de", DNK: "dk",
  // E
  ECU: "ec", EGY: "eg", ENG: "gb-eng", ESP: "es", ETH: "et",
  // F
  FIJ: "fj", FIN: "fi", FJI: "fj", FRA: "fr",
  // G
  GAB: "ga", GAM: "gm", GBR: "gb", GEO: "ge", GER: "de",
  GHA: "gh", GIN: "gn", GNB: "gw", GRC: "gr", GRE: "gr",
  GUA: "gt", GTM: "gt", GUI: "gn",
  // H
  HAI: "ht", HND: "hn", HON: "hn", HRV: "hr", HTI: "ht",
  HUN: "hu",
  // I
  IDN: "id", IND: "in", IRL: "ie", IRN: "ir", IRQ: "iq",
  ISL: "is", ISR: "il", ITA: "it",
  // J
  JAM: "jm", JOR: "jo", JPN: "jp",
  // K
  KAZ: "kz", KEN: "ke", KOR: "kr", KSA: "sa", KUW: "kw",
  KWT: "kw",
  // L
  LBN: "lb", LBY: "ly", LIB: "lb", LIE: "li", LUX: "lu",
  // M
  MAD: "mg", MAR: "ma", MDA: "md", MDG: "mg", MEX: "mx",
  MLI: "ml", MNE: "me", MNG: "mn", MOZ: "mz", MRT: "mr",
  MTN: "mr", MWI: "mw", MYS: "my",
  // N
  NAM: "na", NED: "nl", NGA: "ng", NIR: "gb-nir", NLD: "nl",
  NOR: "no", NZL: "nz",
  // O
  OMA: "om", OMN: "om",
  // P
  PAN: "pa", PAR: "py", PER: "pe", PHI: "ph", PHL: "ph",
  POL: "pl", POR: "pt", PRK: "kp", PRY: "py", PUR: "pr",
  // Q
  QAT: "qa",
  // R
  ROU: "ro", RSA: "za", RUS: "ru", RWA: "rw",
  // S
  SAL: "sv", SAU: "sa", SCO: "gb-sct", SDN: "sd", SEN: "sn",
  SLE: "sl", SLV: "sv", SRB: "rs", STP: "st", SUI: "ch",
  SVK: "sk", SVN: "si", SWE: "se", SYR: "sy",
  // T
  TAH: "pf", TAN: "tz", THA: "th", TRI: "tt", TTO: "tt",
  TUN: "tn", TUR: "tr", TZA: "tz",
  // U
  UGA: "ug", UKR: "ua", URU: "uy", URY: "uy", USA: "us",
  UZB: "uz",
  // V
  VEN: "ve", VIE: "vn", VNM: "vn",
  // W
  WAL: "gb-wls",
  // Y-Z
  YEM: "ye", ZAF: "za", ZAM: "zm", ZMB: "zm", ZIM: "zw",
  ZWE: "zw",
};

export function fifaToIso(code: string): string | null {
  return CODE_TO_ISO[code.toUpperCase()] ?? null;
}
