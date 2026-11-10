import bank from '../../content/exercises/n5-m04-c01-l06-v1.json';
import ReusableListeningPractice, {type AudioQuestion, type AudioTrack} from './ReusableListeningPractice';
const lessonId='n5-m04-c01-l06';
const tracks:AudioTrack[]=[
 {id:'a',assetId:'audio-n5-m04-c01-l06-a',label:'Ordering lunch at the café',url:'/audio/fja-n5-m04-c01-l06-a-v1.wav',durationSeconds:16.34,transcript:[
 '女性： いらっしゃいませ。ご注文は何ですか。',
 '男性： カレーをお願いします。飲み物はお茶をください。',
 '女性： はい。カレーとお茶ですね。サラダも食べますか。',
 '男性： いいえ、サラダは食べません。ありがとうございます。'].join('\n'),english:[
 'Woman: Welcome. What would you like to order?',
 'Man: Curry, please. For a drink, tea, please.',
 'Woman: Certainly. Curry and tea, right? Would you like salad too?',
 'Man: No, I won\'t have salad. Thank you.'].join('\n')},
 {id:'b',assetId:'audio-n5-m04-c01-l06-b',label:'Two friends choose a snack',url:'/audio/fja-n5-m04-c01-l06-b-v1.wav',durationSeconds:14.5,transcript:[
 '男性： この店のケーキが好きですか。',
 '女性： はい、好きです。でも、今日はアイスクリームを食べます。',
 '男性： ぼくはケーキを食べます。飲み物はコーヒーにします。',
 '女性： わたしは水を飲みます。'].join('\n'),english:[
 'Man: Do you like this shop\'s cake?',
 'Woman: Yes, I do. But today I\'ll eat ice cream.',
 'Man: I\'ll eat cake. I\'ll choose coffee for my drink.',
 'Woman: I\'ll drink water.'].join('\n')}
];
export function gradeCafeListening(answers:Record<string,string>){return bank.items.filter(q=>answers[q.id]===q.answerKey.choiceId).length;}
export const cafeListeningQuestions=bank.items.map(q=>({...q,trackId:'audio-'+lessonId+'-'+q.trackId})) as AudioQuestion[];
export default function CafeListeningPractice(){return <ReusableListeningPractice lessonId={lessonId} level="n5" version={1} tracks={tracks} questions={cafeListeningQuestions}/>;}
