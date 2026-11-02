import bank from '../content/exercises/l0-m01-c01-l08.json';
import media from '../content/audio/l0-m01-c01-l08-speaking-legacy.json';

export const speakingLessonId = 'l0-m01-c01-l08';
export const speakingQuizId = speakingLessonId + '-check-v1';
export const speakingQuestions = bank.items;
export const speakingTracks = media.assets.map((asset, index) => ({
  id: index === 0 ? 'a' : 'b',
  label: index === 0 ? 'Model A — hiragana and katakana' : 'Model B — kanji and romaji',
  assetId: asset.id,
  url: asset.mediaPath,
  transcript: asset.transcript,
  durationSeconds: asset.durationSeconds
}));
export const speakingCues = [
  { id: 'a-1', track: 'a', japanese: 'みなさん、こんにちは。', english: 'Hello, everyone.', tip: 'Use a friendly, even greeting; do not stress every syllable as in English.' },
  { id: 'a-2', track: 'a', japanese: 'はじめは、ひらがなです。', english: 'First is hiragana.', tip: 'Pause briefly after はじめは; keep the four kana in ひらがな distinct.' },
  { id: 'a-3', track: 'a', japanese: '「あ」は、ひらがなです。', english: 'The character あ is hiragana.', tip: 'Say the vowel あ as one steady Japanese a; the topic particle は is pronounced wa.' },
  { id: 'a-4', track: 'a', japanese: 'つぎは、カタカナです。', english: 'Next is katakana.', tip: 'Use つぎは to introduce the second script. The は particle is pronounced wa.' },
  { id: 'a-5', track: 'a', japanese: '「ア」は、カタカナです。', english: 'The character ア is katakana.', tip: 'Compare ア with あ: same vowel sound, different written character.' },
  { id: 'b-1', track: 'b', japanese: 'つぎは、かんじです。', english: 'Next is kanji.', tip: 'Listen for the transition つぎは and pronounce the final じ with a voiced sound.' },
  { id: 'b-2', track: 'b', japanese: '「山」は、かんじです。「やま」と よみます。', english: '山 is kanji. It is read yama.', tip: 'Say やま as the reading; do not substitute the English meaning mountain.' },
  { id: 'b-3', track: 'b', japanese: 'ローマじは、アルファベットで にほんごを かく ほうほうです。', english: 'Romaji is a way to write Japanese with alphabet letters.', tip: 'Break the long explanation into phrases after は and で. This is a beginner-friendly mixed spelling of ローマ字.' }
] as const;
export const speakingRubric = [
  { id: 'script', label: 'Accurate script names', help: 'I distinguished ひらがな, カタカナ, かんじ and ローマじ without swapping their roles.' },
  { id: 'vowels', label: 'Vowel clarity', help: 'I tried the same a vowel for あ and ア, rather than two English letter names.' },
  { id: 'sequence', label: 'Understandable pacing', help: 'I paused at phrase boundaries and used はじめは / つぎは to show order.' },
  { id: 'meaning', label: 'Reading versus meaning', help: 'I said やま is how 山 is read, not its English translation.' },
  { id: 'confidence', label: 'Honest self-review', help: 'I identified one sound or phrase to practise again, without claiming an automatic pronunciation grade.' }
] as const;
export function scoreSpeakingPreparation(answers: Record<string,string>) {
  return speakingQuestions.reduce((n,q)=>n+Number(answers[q.id]===q.answerKey.choiceId),0);
}
export function validateSpeakingPreparation() {
  if(speakingTracks.length!==2 || speakingQuestions.length!==5) throw new Error('Missing speaking models or preparation checks.');
  const assetIds=new Set(speakingTracks.map(x=>x.assetId));
  if(bank.modelAssetIds.some(x=>!assetIds.has(x))) throw new Error('Model references do not resolve.');
  for(const track of speakingTracks) {
    if(!/^\/audio\/[a-z0-9-]+\.wav$/.test(track.url) || !track.transcript || track.durationSeconds<5) throw new Error('Model audio is missing.');
  }
  for(const cue of speakingCues) {
    const transcript=speakingTracks.find(x=>x.id===cue.track)?.transcript ?? '';
    if(!transcript.includes(cue.japanese)) throw new Error('Speaking cue is not an exact recorded phrase: '+cue.id);
  }
  const ids=new Set<string>();
  for(const q of speakingQuestions) {
    if(ids.has(q.id) || !/^ex-l0-m01-c01-l08-\d{3}$/.test(q.id)) throw new Error('Duplicate or malformed question ID.');
    ids.add(q.id);
    if(q.version!==1 || q.status!=='published' || q.type!=='single-choice' || q.level!=='l0' ||
       !q.prompt.trim() || !q.explanation.trim() || !q.objectiveIds.length || !q.knowledgeItemIds.length ||
       !q.skills.length || q.choices.length!==3 || new Set(q.choices.map(c=>c.id)).size!==3 ||
       !q.choices.some(c=>c.id===q.answerKey.choiceId) || q.choices.some(c=>!c.text.trim()||!c.rationale.trim())) {
      throw new Error('Invalid preparation question '+q.id);
    }
  }
  return true;
}
