const MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/;

// Read at runtime, not inlined at build: one image serves both the develop and the production server
export function getAnalyticsMeasurementId(): string | null {
  const id = process.env.GA_MEASUREMENT_ID?.trim();
  return id && MEASUREMENT_ID_PATTERN.test(id) ? id : null;
}
