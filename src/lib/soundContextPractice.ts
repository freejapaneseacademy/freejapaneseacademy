import bank from '../content/exercises/l0-m01-c02-l01.json';

export const soundContextLessonId = 'l0-m01-c02-l01';
export const soundContextQuizId = 'l0-m01-c02-l01-check-v1';

export type SoundContextQuestion = {
  id: string;
  version: number;
  objectiveIds: string[];
  knowledgeItemIds: string[];
  prompt: string;
  example?: string;
  choices: { id: string; text: string; rationale: string }[];
  answerKey: { choiceId: string };
  explanation: string;
  type: 'single-choice';
  status: 'published';
  level: 'l0';
  skills: string[];
};

export const soundContextQuestions: SoundContextQuestion[] = bank.items.map(item => ({
  ...item, type: 'single-choice', status: 'published', level: 'l0'
}));

export function scoreSoundContext(answers: Record<string, string>, questions: SoundContextQuestion[] = soundContextQuestions) {
  return questions.reduce((total, question) => total + Number(answers[question.id] === question.answerKey.choiceId), 0);
}

export function validateSoundContext(questions: SoundContextQuestion[] = soundContextQuestions) {
  if (!questions.length) throw new Error('No sound-system questions');
  const ids = new Set<string>();
  for (const q of questions) {
    if (ids.has(q.id) || q.version !== 1 || q.type !== 'single-choice' ||
        !q.prompt || !q.explanation || !q.objectiveIds.length || !q.knowledgeItemIds.length) {
      throw new Error('Invalid question metadata: ' + q.id);
    }
    ids.add(q.id);
    const choices = new Set(q.choices.map(c => c.id));
    if (q.choices.length < 2 || choices.size !== q.choices.length ||
        !choices.has(q.answerKey.choiceId) || q.choices.some(c => !c.text || !c.rationale)) {
      throw new Error('Invalid answer choices: ' + q.id);
    }
  }
  return true;
}
