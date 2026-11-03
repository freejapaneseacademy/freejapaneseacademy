import bank from '../content/exercises/l0-m01-c02-l08.json';
import media from '../content/audio/l0-m01-c02-l06-v1.json';

export const vowelSpeakingLessonId = 'l0-m01-c02-l08';
export const vowelSpeakingQuizId = vowelSpeakingLessonId + '-check-v1';
export const vowelSpeakingQuestions = bank.items;
export const vowelSpeakingMedia = media.assets;
export const vowelSpeakingRubric = [
  {id:'vowels',title:'Steady vowel qualities',tip:'I tried the five a/i/u/e/o sounds without turning them into English letter names or adding a glide.'},
  {id:'length',title:'Meaningful vowel length',tip:'I made the second vowel mora noticeable in いいえ and おばあさん compared with いえ and おばさん.'},
  {id:'rhythm',title:'Mora rhythm',tip:'I gave ん its own timing unit, and did not replace a long vowel with an awkward full silence.'},
  {id:'correction',title:'Understandable correction',tip:'My response communicated shop (not house) or grandmother (not aunt) in the intended spoken situation.'},
  {id:'pacing',title:'Honest comparison',tip:'I replayed the recorded line and noted something specific to practise again, without assuming an automatic pronunciation grade.'}
] as const;

export function scoreVowelSpeakingPreparation(answers: Record<string,string>) {
  return vowelSpeakingQuestions.reduce((total, question) =>
    total + Number(answers[question.id] === question.answerKey.choiceId), 0);
}
export function validateVowelSpeakingPreparation() {
  if (bank.lessonId !== vowelSpeakingLessonId || bank.version !== 1 ||
      vowelSpeakingQuestions.length !== 5 || vowelSpeakingMedia.length !== 2)
    throw new Error('Vowel speaking IDs, questions or real recorded models missing.');
  if (vowelSpeakingMedia.some(a => !bank.modelAssetIds.includes(a.id) ||
      !/^\/audio\/fja-l0-m01-c02-l06-[ab]-v1\.wav$/.test(a.mediaPath) ||
      a.durationSeconds < 8 || !a.transcript || a.turns.length < 4))
    throw new Error('Speaking model WAV metadata is inconsistent or absent.');
  const qids = new Set<string>();
  for (const q of vowelSpeakingQuestions) {
    if (!/^ex-l0-m01-c02-l08-00[1-5]$/.test(q.id) || qids.has(q.id) ||
        q.level !== 'l0' || q.version !== 1 || q.status !== 'published' ||
        q.type !== 'single-choice' || !q.prompt.trim() || !q.explanation.trim() ||
        q.choices.length !== 3 || q.choices.some(c => c.text.length < 5 || c.rationale.length < 12) ||
        !q.choices.some(c => c.id === q.answerKey.choiceId))
      throw new Error('Invalid speaking preparation question: ' + q.id);
    qids.add(q.id);
  }
  for (const asset of vowelSpeakingMedia) {
    let last = 0;
    for (const turn of asset.turns) {
      if (turn.startSeconds < last - 0.015 || turn.endSeconds <= turn.startSeconds ||
          turn.endSeconds > asset.durationSeconds + 0.02 ||
          !asset.transcript.includes(turn.japanese) || !turn.english)
        throw new Error('Turn cue not supported by model audio and transcript.');
      last = turn.endSeconds;
    }
  }
  return true;
}
