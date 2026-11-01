export type QuizQuestion = {
  id: string;
  prompt: string;
  options: { id: string; text: string }[];
  answer: string;
  explanation: string;
};
export const demoQuestions: QuizQuestion[] = [
  { id: 'demo-vowel-a', prompt: 'Which hiragana represents the sound “a”?', options: [{ id: 'a', text: 'あ' }, { id: 'i', text: 'い' }, { id: 'u', text: 'う' }], answer: 'a', explanation: 'あ is the hiragana for the vowel sound “a”.' },
  { id: 'demo-vowel-i', prompt: 'What sound does い represent?', options: [{ id: 'a', text: 'a' }, { id: 'i', text: 'i' }, { id: 'e', text: 'e' }], answer: 'i', explanation: 'い is pronounced like “ee” in “see”.' },
  { id: 'demo-vowel-o', prompt: 'Which character corresponds to the vowel “o”?', options: [{ id: 'o', text: 'お' }, { id: 'u', text: 'う' }, { id: 'e', text: 'え' }], answer: 'o', explanation: 'お represents the Japanese “o” sound.' }
];
export function scoreQuiz(questions: QuizQuestion[], answers: Record<string, string>) {
  return questions.filter((question) => answers[question.id] === question.answer).length;
}
