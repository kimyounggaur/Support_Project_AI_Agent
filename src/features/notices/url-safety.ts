import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

type LookupFn = (hostname: string) => Promise<string[]>;

const DEFAULT_LOOKUP: LookupFn = async (hostname) => {
  const results = await lookup(hostname, { all: true, verbatim: true });
  return results.map((result) => result.address);
};

export async function isSafeNoticeImportUrl(
  rawUrl: string,
  lookupFn: LookupFn = DEFAULT_LOOKUP,
) {
  let parsed: URL;

  try {
    parsed = new URL(rawUrl);
  } catch {
    return false;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return false;
  }

  const addresses = await lookupFn(parsed.hostname);

  if (addresses.length === 0) {
    return false;
  }

  return addresses.every(isPublicIpAddress);
}

function isPublicIpAddress(address: string) {
  const family = isIP(address);

  if (family === 4) {
    return isPublicIPv4(address);
  }

  if (family === 6) {
    return isPublicIPv6(address);
  }

  return false;
}

function isPublicIPv4(address: string) {
  const parts = address.split(".").map(Number);
  const [a, b] = parts;

  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
    return false;
  }

  if (a === 10 || a === 127 || a === 0) {
    return false;
  }

  if (a === 172 && b >= 16 && b <= 31) {
    return false;
  }

  if (a === 192 && b === 168) {
    return false;
  }

  if (a === 169 && b === 254) {
    return false;
  }

  return true;
}

function isPublicIPv6(address: string) {
  const normalized = address.toLowerCase();

  if (
    normalized === "::1" ||
    normalized === "::" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe80:")
  ) {
    return false;
  }

  return true;
}
