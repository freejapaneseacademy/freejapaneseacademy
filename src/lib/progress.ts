import Dexie, { type Table } from 'dexie';

export const PROGRESS_SCHEMA_VERSION = 1;
export type CompletedLesson = { id: string; level: string; completedAt: string };
export type QuizAttempt = { id?: number; quizId: string; level: string; correct: number; total: number; at: string };
export type Bookmark = { id: string; addedAt: string };
export type StudyPreference = { key: string; value: string };
export type ProgressBackup = {
  schemaVersion: 1;
  exportedAt: string;
  lessons: CompletedLesson[];
  attempts: QuizAttempt[];
  bookmarks: Bookmark[];
  preferences: StudyPreference[];
};
class AcademyDB extends Dexie {
  lessons!: Table<CompletedLesson, string>;
  attempts!: Table<QuizAttempt, number>;
  bookmarks!: Table<Bookmark, string>;
  preferences!: Table<StudyPreference, string>;
  constructor() {
    super('freejapaneseacademy-progress');
    this.version(1).stores({ lessons: '&id,level,completedAt', attempts: '++id,quizId,level,at', bookmarks: '&id,addedAt', preferences: '&key' });
  }
}
let db: AcademyDB | undefined;
function storage() {
  if (typeof window === 'undefined' || !('indexedDB' in window)) throw new Error('Browser storage is unavailable. Try a regular browser window.');
  return (db ??= new AcademyDB());
}
export function notifyProgressChanged() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('fja-progress-changed'));
}
export async function completeLesson(id: string, level: string) {
  await storage().lessons.put({ id, level, completedAt: new Date().toISOString() });
  notifyProgressChanged();
}
export async function recordAttempt(quizId: string, level: string, correct: number, total: number) {
  if (total <= 0 || correct < 0 || correct > total) throw new Error('Invalid quiz result');
  await storage().attempts.add({ quizId, level, correct, total, at: new Date().toISOString() });
  notifyProgressChanged();
}
export async function toggleBookmark(id: string) {
  const database = storage();
  const existing = await database.bookmarks.get(id);
  if (existing) await database.bookmarks.delete(id);
  else await database.bookmarks.put({ id, addedAt: new Date().toISOString() });
  notifyProgressChanged();
  return !existing;
}
export async function getSnapshot() {
  const database = storage();
  const [lessons, attempts, bookmarks, preferences] = await Promise.all([
    database.lessons.toArray(), database.attempts.toArray(), database.bookmarks.toArray(), database.preferences.toArray()
  ]);
  return { lessons, attempts, bookmarks, preferences };
}
export async function exportProgress(): Promise<ProgressBackup> {
  return { schemaVersion: PROGRESS_SCHEMA_VERSION, exportedAt: new Date().toISOString(), ...(await getSnapshot()) };
}
const isObject = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const str = (value: unknown, max = 200) => typeof value === 'string' && value.length > 0 && value.length <= max;
export function validateBackup(value: unknown): ProgressBackup {
  if (!isObject(value) || value.schemaVersion !== PROGRESS_SCHEMA_VERSION ||
      !Array.isArray(value.lessons) || !Array.isArray(value.attempts) || !Array.isArray(value.bookmarks) || !Array.isArray(value.preferences)) {
    throw new Error('This file is not a supported FreeJapaneseAcademy progress backup.');
  }
  if (Object.values(value).some((v) => Array.isArray(v) && v.length > 25000)) throw new Error('The backup contains too many records.');
  if (!value.lessons.every((x: unknown) => isObject(x) && str(x.id) && str(x.level, 10) && str(x.completedAt, 40)) ||
      !value.attempts.every((x: unknown) => isObject(x) && str(x.quizId) && str(x.level, 10) && str(x.at, 40) && Number.isInteger(x.correct) && Number.isInteger(x.total) && Number(x.correct) >= 0 && Number(x.total) > 0 && Number(x.correct) <= Number(x.total)) ||
      !value.bookmarks.every((x: unknown) => isObject(x) && str(x.id) && str(x.addedAt, 40)) ||
      !value.preferences.every((x: unknown) => isObject(x) && str(x.key, 100) && typeof x.value === 'string' && x.value.length <= 300)) {
    throw new Error('The backup contains malformed records.');
  }
  return value as unknown as ProgressBackup;
}
export async function importProgress(fileContent: string) {
  if (fileContent.length > 2_000_000) throw new Error('Backup is too large (maximum 2 MB).');
  let parsed: unknown;
  try { parsed = JSON.parse(fileContent); } catch { throw new Error('The selected file is not valid JSON.'); }
  const value = validateBackup(parsed);
  const database = storage();
  await database.transaction('rw', database.lessons, database.attempts, database.bookmarks, database.preferences, async () => {
    await Promise.all([database.lessons.clear(), database.attempts.clear(), database.bookmarks.clear(), database.preferences.clear()]);
    await database.lessons.bulkPut(value.lessons);
    await database.attempts.bulkPut(value.attempts.map(({ id: _id, ...attempt }) => attempt));
    await database.bookmarks.bulkPut(value.bookmarks);
    await database.preferences.bulkPut(value.preferences);
  });
  notifyProgressChanged();
}
export async function clearProgress() {
  const database = storage();
  await database.transaction('rw', database.lessons, database.attempts, database.bookmarks, database.preferences, async () => {
    await Promise.all([database.lessons.clear(), database.attempts.clear(), database.bookmarks.clear(), database.preferences.clear()]);
  });
  notifyProgressChanged();
}
