export const scriptPracticeQuizId = 'l0-m01-c03-l04-script-v1';
export type ScriptQuestion = {id:string;prompt:string;answer:string;explanation:string;hint:string};
export const scriptQuestions: readonly ScriptQuestion[] = [
{id:'l04-q01',prompt:'Type the word for grandmother (not aunt).',answer:'おばあさん',hint:'The long a adds one あ.',explanation:'おばあさん (grandmother) has five morae: お・ば・あ・さ・ん. おばさん means aunt.'},
{id:'l04-q02',prompt:'Type the word for aunt (not grandmother).',answer:'おばさん',hint:'Do not insert the extra あ.',explanation:'おばさん (aunt) is お・ば・さ・ん, four morae.'},
{id:'l04-q03',prompt:'Type the word for a writer.',answer:'さっか',hint:'Use the small っ before か.',explanation:'さっか (writer) has さ・っ・か; さか means slope.'},
{id:'l04-q04',prompt:'Type the word for a slope.',answer:'さか',hint:'No small っ is needed.',explanation:'さか (slope) is two morae; さっか means writer.'},
{id:'l04-q05',prompt:'Type the word for a postage stamp.',answer:'きって',hint:'There is a small っ before て.',explanation:'きって (stamp) is き・っ・て; きて is the te-form of come.'},
{id:'l04-q06',prompt:'Type the word for a book.',answer:'ほん',hint:'The last kana is ん.',explanation:'ほん (book) is ほ・ん; ん counts as its own mora.'},
{id:'l04-q07',prompt:'Type the word for a stroll or walk.',answer:'さんぽ',hint:'The nasal mora is written ん.',explanation:'さんぽ (stroll) is さ・ん・ぽ; do not replace ん with む.'},
{id:'l04-q08',prompt:'Type high school in hiragana.',answer:'こうこう',hint:'The long o vowels are written with う.',explanation:'こうこう (high school) is こ・う・こ・う, four morae.'},
{id:'l04-q09',prompt:'Type coffee in katakana.',answer:'コーヒー',hint:'Use the long-vowel bar twice.',explanation:'コーヒー is コ・ー・ヒ・ー, four morae; ー extends the preceding vowel.'},
{id:'l04-q10',prompt:'Type the full-size kana tsu.',answer:'つ',hint:'It is larger than the small consonant marker.',explanation:'つ is a full-size kana; っ is smaller and marks consonant timing.'},
{id:'l04-q11',prompt:'Type the small consonant marker used in さっか.',answer:'っ',hint:'Use the small version of tsu.',explanation:'っ counts as a mora and is distinct from full-size つ.'},
{id:'l04-q12',prompt:'Type the nasal mora in ほん.',answer:'ん',hint:'It is one kana.',explanation:'ん is a standalone mora even though its pronunciation depends on neighboring sounds.'}
];
export function normalizeScriptAnswer(value:string){return value.trim().normalize('NFC');}
export function gradeScriptAnswers(answers:Record<string,string>){return scriptQuestions.reduce((n,q)=>n+(normalizeScriptAnswer(answers[q.id]??'')===q.answer?1:0),0);}
