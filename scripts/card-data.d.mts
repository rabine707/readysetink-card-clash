export function textKey(value: unknown): string;
export function collectorLanguage(collectorNumber: unknown, reportedLanguage: unknown): string;
export function buildLorcanaJsonIndex(payload: { cards?: Record<string, unknown>[] }): Map<string, Record<string, unknown>>;
export function findLorcanaJsonCard(card: Record<string, any>, index: Map<string, Record<string, any>>): Record<string, any> | null;
export function normalizeCard(card: Record<string, any>, lorcanaJsonIndex: Map<string, Record<string, any>>): Record<string, any> | null;
