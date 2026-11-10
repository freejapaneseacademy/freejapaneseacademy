export type CaptionQuestion = {id:string; prompt:string; answer:string; choices:readonly string[]; evidence:string; explanation:string};
export const readingQuizId='l0-m01-c03-l05-reading-v1';
export const captionQuestions: readonly CaptionQuestion[] = [
{id:'c03r01',prompt:'Which card labels a grandmother?',answer:'A',choices:['A','B','C','D'],evidence:'A — おばあさん',explanation:'Card A prints おばあさん (grandmother); B has おばさん (aunt). The extra あ changes the word.'},
{id:'c03r02',prompt:'Which card labels an aunt?',answer:'B',choices:['A','B','G','H'],evidence:'B — おばさん',explanation:'B prints おばさん. A includes the extra あ and labels a grandmother.'},
{id:'c03r03',prompt:'Which card says a writer writes a book?',answer:'C',choices:['C','D','E','H'],evidence:'C — さっか は ほん を かきます',explanation:'The full caption explicitly links さっか (writer) and ほん (book). D has さか (slope).'},
{id:'c03r04',prompt:'Which card describes a slope?',answer:'D',choices:['A','C','D','F'],evidence:'D — この さか は ながい です',explanation:'Card D says the slope is long. さか lacks the small っ in さっか (writer).'},
{id:'c03r05',prompt:'Where is the stamp described as being here?',answer:'E',choices:['E','F','G','H'],evidence:'E — きって は ここ に あります',explanation:'E states that the stamp is here. F asks someone to come here; ここ alone is insufficient evidence.'},
{id:'c03r06',prompt:'Which card contains a polite request to come here?',answer:'F',choices:['C','D','E','F'],evidence:'F — ここ に きて ください',explanation:'きて ください is a polite request. E contains きって, a postage stamp.'},
{id:'c03r07',prompt:'Which card refers to a high-school teacher?',answer:'G',choices:['A','D','G','H'],evidence:'G — こうこう の せんせい です',explanation:'こうこう is high school; せんせい is teacher. The other cards do not state this.'},
{id:'c03r08',prompt:'Which card says someone reads a book after a walk?',answer:'H',choices:['B','C','G','H'],evidence:'H — さんぽ の あとで ほん を よみます',explanation:'さんぽ の あとで means after a walk; ほん を よみます means reads a book.'},
{id:'c03r09',prompt:'Which caption contains a long vowel marked by an extra あ in the family word?',answer:'A',choices:['A','B','E','F'],evidence:'A — おばあさん',explanation:'The sequence ばあ occupies two morae; B has only ば.'},
{id:'c03r10',prompt:'Which caption includes small っ in the word for writer?',answer:'C',choices:['C','D','G','H'],evidence:'C — さっか',explanation:'The writer さっか is さ・っ・か. The slope さか has no small っ.'},
{id:'c03r11',prompt:'Which caption includes the conventional long-o spelling こ・う・こ・う?',answer:'G',choices:['A','E','G','H'],evidence:'G — こうこう',explanation:'The high-school word uses う after each こ. The spelling is not こおこお.'},
{id:'c03r12',prompt:'Which caption contains both さんぽ and ほん, each with a nasal ん?',answer:'H',choices:['B','C','G','H'],evidence:'H — さんぽ の あとで ほん を よみます',explanation:'さんぽ has さ・ん・ぽ (3 morae), and ほん has ほ・ん (2). C has ほん but not さんぽ.'}
];
export function gradeCaptionAnswers(answers:Record<string,string>):number{return captionQuestions.reduce((sum,q)=>sum+(answers[q.id]===q.answer?1:0),0)}
