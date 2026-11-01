export type ScriptChoice = { id: string; text: string; rationale: string };
export type ScriptQuestion = {
  id: string;
  version: 1;
  objectiveIds: string[];
  knowledgeItemIds: string[];
  prompt: string;
  example?: string;
  choices: ScriptChoice[];
  answerKey: string;
  type: 'single-choice';
  status: 'draft';
  level: 'l0';
  skills: string[];
  explanation: string;
};

export const firstLessonId = 'l0-m01-c01-l01';
export const firstLessonQuizId = `${firstLessonId}-check-v1`;
type DraftScriptQuestion = Omit<ScriptQuestion, 'type' | 'status' | 'level' | 'skills'>;
const draftedQuestions: DraftScriptQuestion[] = [
  {
    id: `${firstLessonId}-q01`, version: 1, objectiveIds: ['l0-m01-c01-l01-o1'], knowledgeItemIds: ['script-hiragana'],
    prompt: 'Which writing system is used in this example?', example: 'さくら',
    choices: [
      { id: 'hiragana', text: 'Hiragana', rationale: 'Yes. The curved kana さ・く・ら form the word さくら.' },
      { id: 'katakana', text: 'Katakana', rationale: 'Katakana has different, often angular character shapes.' },
      { id: 'kanji', text: 'Kanji', rationale: 'Kanji are character forms such as 山 and 日.' },
    ], answerKey: 'hiragana', explanation: 'さくら is written in hiragana. Both hiragana and katakana represent Japanese sound units, but they use different character shapes.'
  },
  {
    id: `${firstLessonId}-q02`, version: 1, objectiveIds: ['l0-m01-c01-l01-o1'], knowledgeItemIds: ['script-katakana'],
    prompt: 'Which writing system is used in this example?', example: 'コーヒー',
    choices: [
      { id: 'hiragana', text: 'Hiragana', rationale: 'This word uses angular katakana, not rounded hiragana.' },
      { id: 'katakana', text: 'Katakana', rationale: 'Yes. コーヒー is a borrowed word written in katakana.' },
      { id: 'kanji', text: 'Kanji', rationale: 'Kanji are different characters used for many word roots and meanings.' },
    ], answerKey: 'katakana', explanation: 'コーヒー (coffee) is a common loanword written in katakana. The long-vowel mark ー is also visible.'
  },
  {
    id: `${firstLessonId}-q03`, version: 1, objectiveIds: ['l0-m01-c01-l01-o1'], knowledgeItemIds: ['script-kanji'],
    prompt: 'Which writing system is used in this example?', example: '山',
    choices: [
      { id: 'kanji', text: 'Kanji', rationale: 'Yes. 山 is a kanji that can mean mountain.' },
      { id: 'romaji', text: 'Romaji', rationale: 'Romaji would show a word with Latin letters, like yama.' },
      { id: 'katakana', text: 'Katakana', rationale: 'This is the kanji 山, not a katakana character.' },
    ], answerKey: 'kanji', explanation: '山 is kanji, read やま in this example. Kanji can have multiple readings in other words.'
  },
  {
    id: `${firstLessonId}-q04`, version: 1, objectiveIds: ['l0-m01-c01-l01-o1'], knowledgeItemIds: ['script-romaji'],
    prompt: 'What do we call Japanese represented in Latin letters?', example: 'sakura',
    choices: [
      { id: 'romaji', text: 'Romaji', rationale: 'Correct. Romaji uses Latin letters to represent Japanese sounds.' },
      { id: 'hiragana', text: 'Hiragana', rationale: 'Hiragana would be さくら, using Japanese kana.' },
      { id: 'furigana', text: 'Furigana', rationale: 'Furigana are reading hints, usually small kana above or beside kanji.' },
    ], answerKey: 'romaji', explanation: '“sakura” uses Latin letters, so it is romaji; the word can be written さくら in hiragana.'
  },
  {
    id: `${firstLessonId}-q05`, version: 1, objectiveIds: ['l0-m01-c01-l01-o2'], knowledgeItemIds: ['script-katakana'],
    prompt: 'Which statement about katakana is most accurate?',
    choices: [
      { id: 'a', text: 'It is commonly used for loanwords and sometimes for emphasis.', rationale: 'Correct. Katakana has several uses, including loanwords and emphasis.' },
      { id: 'b', text: 'It is a separate spoken language from Japanese.', rationale: 'Both kana scripts are used to write Japanese.' },
      { id: 'c', text: 'It always shows the English spelling of a word.', rationale: 'Borrowed words adapt to Japanese sounds and writing conventions.' },
    ], answerKey: 'a', explanation: 'Katakana often writes loanwords, but also occurs with names, sounds, emphasis, and other functions.'
  },
  {
    id: `${firstLessonId}-q06`, version: 1, objectiveIds: ['l0-m01-c01-l01-o3'], knowledgeItemIds: ['script-mixed-writing'],
    prompt: 'Can a single normal Japanese sentence combine hiragana, katakana, and kanji?',
    choices: [
      { id: 'yes', text: 'Yes, these scripts often appear together.', rationale: 'Correct. Japanese normally uses multiple scripts together where appropriate.' },
      { id: 'no', text: 'No, writers must choose only one script per sentence.', rationale: 'The lesson shows that script mixing is normal.' },
      { id: 'foreign', text: 'Only when translating an English sentence.', rationale: 'This is ordinary Japanese orthography, not just translation.' },
    ], answerKey: 'yes', explanation: 'A sentence such as 私はコーヒーを飲みます。 mixes kanji, katakana and hiragana naturally.'
  },
  {
    id: `${firstLessonId}-q07`, version: 1, objectiveIds: ['l0-m01-c01-l01-o4'], knowledgeItemIds: ['grammar-sov-preview'],
    prompt: 'Where does a verb often appear in a basic Japanese sentence?',
    choices: [
      { id: 'end', text: 'Near the end of the sentence.', rationale: 'Right. This is a helpful initial observation, not an absolute grammar rule.' },
      { id: 'middle', text: 'Always between the subject and object, as in English.', rationale: 'English and Japanese often have different basic word orders.' },
      { id: 'first', text: 'Always as the first word.', rationale: 'This is not a normal rule of Japanese sentence structure.' },
    ], answerKey: 'end', explanation: 'Japanese frequently places the verb at the end, as in わたしはおちゃをのみます。 Word order has exceptions and context matters.'
  },
  {
    id: `${firstLessonId}-q08`, version: 1, objectiveIds: ['l0-m01-c01-l01-o2'], knowledgeItemIds: ['script-furigana'],
    prompt: 'What is furigana?',
    choices: [
      { id: 'readings', text: 'Small reading hints near kanji.', rationale: 'Correct. Furigana help readers pronounce written kanji words.' },
      { id: 'alphabet', text: 'A fourth full Japanese writing system.', rationale: 'Furigana are reading aids, usually written using kana.' },
      { id: 'latin', text: 'The Latin-letter spelling of Japanese.', rationale: 'That is romaji.' },
    ], answerKey: 'readings', explanation: 'Furigana use small kana to show readings; they are not a separate primary Japanese writing system.'
  },
];
export const scriptQuestions: ScriptQuestion[] = draftedQuestions.map((question) => ({
  ...question, type: 'single-choice', status: 'draft', level: 'l0', skills: ['script-recognition']
}));

export function scoreScriptQuestions(questions: ScriptQuestion[], answers: Record<string,string>) {
  return questions.reduce((n,q) => n + Number(answers[q.id] === q.answerKey), 0);
}
export function validateScriptQuestions(questions: ScriptQuestion[]) {
  const ids = new Set<string>();
  for(const question of questions){
    if(ids.has(question.id)) throw new Error(`Duplicate question ID: ${question.id}`);
    ids.add(question.id);
    if(question.version !== 1 || !question.prompt || !question.objectiveIds.length || !question.knowledgeItemIds.length) throw new Error('Question is missing required metadata');
    const choiceIds = new Set(question.choices.map(c=>c.id));
    if(question.choices.length < 2 || choiceIds.size!==question.choices.length || !choiceIds.has(question.answerKey) || !question.explanation) throw new Error(`Invalid question ${question.id}`);
    if(question.choices.some(c => !c.text || !c.rationale)) throw new Error('Every choice needs feedback');
  }
  return true;
}
