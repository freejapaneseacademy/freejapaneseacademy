import bank from '../content/exercises/l0-m01-c01-l06.json';
import media from '../content/audio/l0-m01-c01-l06.json';

export type ListeningChoice = { id: string; text: string; rationale: string };
export type ListeningQuestion = {
  id: string; version: number; objectiveIds: string[]; knowledgeItemIds: string[];
  trackId: string; prompt: string; choices: ListeningChoice[]; answerKey: { choiceId: string };
  explanation: string; evidence: string; type: 'single-choice'; status: 'published';
  level: 'l0'; skills: string[];
};
export const listeningLessonId = 'l0-m01-c01-l06';
export const listeningQuizId = listeningLessonId + '-check-v2';
export const listeningQuestions = (bank as unknown as { items: ListeningQuestion[] }).items;
export const listeningTracks = media.assets.map((item, i) => ({
  id: i === 0 ? 'a' : 'b', assetId: item.id,
  label: i === 0 ? 'Track A — A short exchange' : 'Track B — An everyday conversation',
  url: item.mediaPath, durationSeconds: item.durationSeconds,
  transcript: item.transcript, english: item.english
}));
export function scoreListeningQuestions(answers: Record<string, string>) {
  return listeningQuestions.reduce((n, q) => n + Number(answers[q.id] === q.answerKey.choiceId), 0);
}
export function validateListeningQuestions() {
  const ids = new Set<string>();
  const tracks = new Set(listeningTracks.map(t => t.assetId));
  if(listeningTracks.length !== 2 || listeningQuestions.length !== 8) throw new Error('L06 needs two recordings and eight original questions.');
  for(const track of listeningTracks) {
    if(!/^\/audio\/[a-z0-9-]+\.wav$/.test(track.url) || !track.transcript || track.durationSeconds < 3) throw new Error('Missing real media metadata.');
  }
  for(const q of listeningQuestions) {
    const sourceTrack=listeningTracks.find(x=>x.assetId===q.trackId);
    if(!sourceTrack || !sourceTrack.transcript.includes(q.evidence)) throw new Error('Unheard answer evidence: '+q.id);
    if(/hiragana|katakana|kanji|romaji|script|written|printed/i.test(q.prompt)) throw new Error('Reading-only question in listening exercise: '+q.id);
    if(ids.has(q.id)) throw new Error('Duplicate question ID.');
    ids.add(q.id);
    const c=q.choices.map(x=>x.id);
    if(!q.id.startsWith('ex-l0-m01-c01-l06-') || !tracks.has(q.trackId) ||
      !q.objectiveIds.length || !q.knowledgeItemIds.length || !q.skills.length ||
      q.type!=='single-choice' || q.status!=='published' || q.version!==2 ||
      !q.prompt.trim() || !q.explanation.trim() || !q.evidence.trim() ||
      c.length!==3 || new Set(c).size!==3 || !c.includes(q.answerKey.choiceId) ||
      q.choices.some(x=>!x.text.trim() || !x.rationale.trim())) throw new Error('Malformed L06 question: '+q.id);
  }
  return true;
}
