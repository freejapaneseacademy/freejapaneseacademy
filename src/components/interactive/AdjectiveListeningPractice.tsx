import bank from '../../content/exercises/n5-m04-c03-l06-v1.json';
import ReusableListeningPractice, {type AudioQuestion, type AudioTrack} from './ReusableListeningPractice';
const lessonId='n5-m04-c03-l06';
export const adjectiveListeningQuestions=bank.items.map(q=>({...q,trackId:'audio-'+lessonId+'-'+q.trackId})) as AudioQuestion[];
export function gradeAdjectiveListening(answers:Record<string,string>){return bank.items.filter(q=>answers[q.id]===q.answerKey.choiceId).length;}
const tracks:AudioTrack[]=[
{id:'a',assetId:'audio-n5-m04-c03-l06-a',label:'Two cafés compared',url:'/audio/fja-n5-m04-c03-l06-a-v1.wav',durationSeconds:22,transcript:'女性：このカフェは静かですね。\n男性：はい。でも、駅の前のカフェはにぎやかです。\n女性：ここのコーヒーはおいしいですか。\n男性：はい、おいしいです。でも、ケーキはあまりおいしくないです。',english:"Woman: This café is quiet, isn't it?\nMan: Yes. But the café in front of the station is lively.\nWoman: Is the coffee here tasty?\nMan: Yes, it is. But the cake isn't very tasty."},
{id:'b',assetId:'audio-n5-m04-c03-l06-b',label:'Choosing between two bags',url:'/audio/fja-n5-m04-c03-l06-b-v1.wav',durationSeconds:25,transcript:'男性：この赤いかばんは大きいですね。\n女性：はい。でも、少し高いです。\n男性：あの青いかばんはどうですか。\n女性：青いかばんは大きくないです。でも、安くて便利です。\n男性：じゃあ、青いかばんにします。',english:"Man: This red bag is big, isn't it?\nWoman: Yes. But it's a little expensive.\nMan: How about that blue bag?\nWoman: The blue bag isn't big. But it's inexpensive and convenient.\nMan: Then I'll take the blue bag."}
];
export default function AdjectiveListeningPractice(){return <ReusableListeningPractice lessonId={lessonId} level="n5" version={1} tracks={tracks} questions={adjectiveListeningQuestions}/>;}
