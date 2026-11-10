/**
 * The Foundations course index is a VIEW of the canonical inventory.
 * Do not append manual lesson cards to the Astro page.
 */
export interface FoundationInventoryItem {
  id: string;
  level?: string;
  moduleId?: string;
  chapterId?: string;
  slot?: string;
  url?: string;
  status?: string;
  noindex?: boolean;
}
export interface FoundationLessonMetadata {
  lessonId?: string;
  title: string;
  description: string;
  minutes: number;
  module: string;
  chapter: string;
  publicationStatus: string;
}
export interface CatalogLesson {
  id: string;
  href: string;
  slot: string;
  label: string;
  title: string;
  description: string;
  minutes: number;
  isCheckpoint: boolean;
  moduleNumber: number;
  chapterNumber: number;
  sortNumber: number;
}
export interface CatalogChapter {
  id: string;
  number: number;
  title: string;
  lessons: CatalogLesson[];
}
export interface CatalogModule {
  id: string;
  number: number;
  title: string;
  chapters: CatalogChapter[];
  total: number;
}

/** Throws if an inventory item cannot be rendered as a real published lesson. */
export function buildFoundationsCatalog(
  inventory: readonly FoundationInventoryItem[],
  metadata: readonly FoundationLessonMetadata[]
): CatalogModule[] {
  const byId = new Map(metadata.filter(x => x.lessonId).map(x => [x.lessonId, x]));
  const seen = new Set<string>();
  const sorted: CatalogLesson[] = [];
  const moduleNames = new Map<number, string>();
  const chapterNames = new Map<string, string>();

  for (const item of inventory) {
    if (item.level !== 'l0' || item.status !== 'published') continue;
    if (seen.has(item.id)) throw new Error('Duplicate Foundations inventory ID: ' + item.id);
    seen.add(item.id);
    const match = /^l0-m(\d{2})-c(\d{2})-(l(\d{2})|chk)$/.exec(item.id);
    if (!match) throw new Error('Invalid published Foundations lesson ID: ' + item.id);
    const moduleNumber = Number(match[1]);
    const chapterNumber = Number(match[2]);
    const isCheckpoint = match[3] === 'chk';
    const lessonNumber = isCheckpoint ? 99 : Number(match[4]);
    const expectedUrl = '/learn/start/module-' + match[1] + '/chapter-' + match[2] +
      '/' + (isCheckpoint ? 'checkpoint/' : 'lesson-' + match[4] + '/');
    if (item.url !== expectedUrl || item.noindex === true) {
      throw new Error('Incorrect published route or noindex flag for ' + item.id);
    }
    const info = byId.get(item.id);
    if (!info || info.publicationStatus !== 'published' || !info.title?.trim() ||
        !info.description?.trim() || !Number.isFinite(info.minutes) || info.minutes <= 0) {
      throw new Error('Missing valid published content metadata for ' + item.id);
    }
    moduleNames.set(moduleNumber, moduleNames.get(moduleNumber) || info.module);
    const chapterKey = match[1] + '-' + match[2];
    chapterNames.set(chapterKey, chapterNames.get(chapterKey) || info.chapter);
    sorted.push({
      id: item.id, href: expectedUrl, slot: item.slot || match[3].toUpperCase(),
      label: isCheckpoint ? 'Chapter checkpoint' : 'Lesson ' + String(lessonNumber).padStart(2, '0'),
      title: info.title, description: info.description, minutes: info.minutes,
      isCheckpoint, moduleNumber, chapterNumber, sortNumber: lessonNumber
    });
  }

  sorted.sort((a,b) => a.moduleNumber - b.moduleNumber ||
    a.chapterNumber - b.chapterNumber || a.sortNumber - b.sortNumber);
  const modules: CatalogModule[] = [];
  for (const lesson of sorted) {
    let mod = modules.find(x => x.number === lesson.moduleNumber);
    if (!mod) {
      mod = { id: 'module-' + String(lesson.moduleNumber).padStart(2,'0'),
        number: lesson.moduleNumber,
        title: moduleNames.get(lesson.moduleNumber) || 'Japanese Foundations',
        chapters: [], total: 0 };
      modules.push(mod);
    }
    let chapter = mod.chapters.find(x => x.number === lesson.chapterNumber);
    if (!chapter) {
      chapter = { id: mod.id + '-chapter-' + String(lesson.chapterNumber).padStart(2, '0'),
        number: lesson.chapterNumber,
        title: chapterNames.get(String(lesson.moduleNumber).padStart(2,'0') + '-' +
          String(lesson.chapterNumber).padStart(2,'0')) || 'Japanese reading and practice',
        lessons: [] };
      mod.chapters.push(chapter);
    }
    chapter.lessons.push(lesson);
    mod.total++;
  }
  return modules;
}
