const FIFA_TO_ISO: Record<string, string> = {
  AFG: "af", ALB: "al", ALG: "dz", AND: "ad", ANG: "ao",
  ARG: "ar", ARM: "am", AUS: "au", AUT: "at", AZE: "az",
  BAH: "bs", BAN: "bd", BEL: "be", BLR: "by", BLZ: "bz",
  BOL: "bo", BIH: "ba", BOT: "bw", BRA: "br", BUL: "bg",
  BFA: "bf", BDI: "bi", CAM: "kh", CAN: "ca", CPV: "cv",
  CHI: "cl", CHN: "cn", COL: "co", COM: "km", CGO: "cg",
  COD: "cd", CRC: "cr", CIV: "ci", CRO: "hr", CUB: "cu",
  CZE: "cz", DEN: "dk", ECU: "ec", EGY: "eg", ENG: "gb-eng",
  ESP: "es", ETH: "et", FIN: "fi", FIJ: "fj", FRA: "fr",
  GAB: "ga", GAM: "gm", GEO: "ge", GER: "de", GHA: "gh",
  GRE: "gr", GUA: "gt", GUI: "gn", GNB: "gw", HON: "hn",
  HUN: "hu", ISL: "is", IND: "in", IDN: "id", IRN: "ir",
  IRQ: "iq", IRL: "ie", ISR: "il", ITA: "it", JAM: "jm",
  JPN: "jp", JOR: "jo", KAZ: "kz", KEN: "ke", KOR: "kr",
  KSA: "sa", KUW: "kw", LIB: "lb", LBY: "ly", LIE: "li",
  LUX: "lu", MAD: "mg", MAR: "ma", MEX: "mx", MDA: "md",
  MNG: "mn", MOZ: "mz", MLI: "ml", MTN: "mr", NAM: "na",
  NED: "nl", NGA: "ng", NIR: "gb-nir", NOR: "no", NZL: "nz",
  OMA: "om", PAN: "pa", PAR: "py", PER: "pe", PHI: "ph",
  POL: "pl", POR: "pt", PRK: "kp", PUR: "pr", QAT: "qa",
  ROU: "ro", RSA: "za", RUS: "ru", RWA: "rw", SAL: "sv",
  SCO: "gb-sct", SEN: "sn", SLE: "sl", SVK: "sk", SVN: "si",
  SRB: "rs", SUI: "ch", SWE: "se", SYR: "sy", TAH: "pf",
  TAN: "tz", THA: "th", TRI: "tt", TUN: "tn", TUR: "tr",
  UGA: "ug", UKR: "ua", URU: "uy", USA: "us", UZB: "uz",
  VEN: "ve", VIE: "vn", WAL: "gb-wls", YEM: "ye",
  ZAM: "zm", ZIM: "zw",
};

export function fifaToIso(fifaCode: string): string | null {
  return FIFA_TO_ISO[fifaCode.toUpperCase()] ?? null;
}
