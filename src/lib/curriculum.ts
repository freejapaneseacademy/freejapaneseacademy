export const levels = [
  { id: 'n5', label: 'N5', name: 'The first steps', japanese: 'はじめの一歩', rank: '01', stage: 'Beginner', tone: 'sage',
    description: 'Begin with Japanese sounds, writing systems, essential words, and simple conversations.',
    topics: ['Hiragana & katakana', 'Everyday introductions', 'Essential sentence patterns'],
    pathway: ['Japanese Foundations', 'Building Simple Sentences', 'Everyday Japanese'] },
  { id: 'n4', label: 'N4', name: 'Build your foundation', japanese: '基礎を深める', rank: '02', stage: 'Elementary', tone: 'sky',
    description: 'Strengthen your core grammar and express yourself in familiar situations.',
    topics: ['Verb forms & particles', 'Daily situations', 'Reading short passages'],
    pathway: ['Verb Forms & Connections', 'Daily Life Conversations', 'Reading in Context'] },
  { id: 'n3', label: 'N3', name: 'Find your rhythm', japanese: '自分のペースで', rank: '03', stage: 'Intermediate', tone: 'sand',
    description: 'Move toward natural conversation and understand longer texts with confidence.',
    topics: ['Intermediate grammar', 'Connected speech', 'Reading for meaning'],
    pathway: ['Intermediate Expression', 'Context & Nuance', 'Extended Comprehension'] },
  { id: 'n2', label: 'N2', name: 'Go beyond the basics', japanese: 'もっとその先へ', rank: '04', stage: 'Upper intermediate', tone: 'peach',
    description: 'Tackle formal expression, complex reading, and more nuanced language.',
    topics: ['Advanced syntax', 'Formal communication', 'Long-form reading'],
    pathway: ['Complex Grammar', 'Formal & Written Japanese', 'In-depth Reading'] },
  { id: 'n1', label: 'N1', name: 'Explore the full depth', japanese: '言葉の奥へ', rank: '05', stage: 'Advanced', tone: 'lilac',
    description: 'Develop a deeper grasp of abstract ideas, precision, and advanced nuance.',
    topics: ['Subtle distinctions', 'Academic & abstract texts', 'Advanced listening'],
    pathway: ['Precise Expression', 'Abstract Language', 'Advanced Comprehension'] },
] as const;
export type LevelId = typeof levels[number]['id'];
export const levelById = (id: string) => levels.find((level) => level.id === id);
