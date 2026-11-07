export const lessonId = 'l0-m03-c04-l08';
export const models = [
  { id:'a', title:'At the library desk', src:'/audio/fja-l0-m03-c04-l06-a-v1.wav', turns:[
    {speaker:'Librarian', japanese:'こんにちは。ほんをさがしていますか。', english:'Hello. Are you looking for a book?'},
    {speaker:'Visitor', japanese:'はい。ねこのほんはありますか。', english:'Yes. Do you have a book about cats?'},
    {speaker:'Librarian', japanese:'はい。あのたなにあります。', english:'Yes. It is on that shelf.'},
    {speaker:'Visitor', japanese:'ありがとうございます。', english:'Thank you.'}
  ]},
  { id:'b', title:'A book to take home', src:'/audio/fja-l0-m03-c04-l06-b-v1.wav', turns:[
    {speaker:'Visitor', japanese:'このほんをかりてもいいですか。', english:'May I borrow this book?'},
    {speaker:'Librarian', japanese:'はい。なまえをかいてください。', english:'Yes. Please write your name.'},
    {speaker:'Visitor', japanese:'ここにかきますか。', english:'Shall I write it here?'},
    {speaker:'Librarian', japanese:'はい。ここにかいてください。', english:'Yes. Please write it here.'},
    {speaker:'Visitor', japanese:'わかりました。', english:'Understood.'}
  ]}
] as const;
export const questions = [
  {id:'ex-l0-m03-c04-l08-001',prompt:'What does the librarian ask first in Track A?',options:['Are you looking for a book?','Did you borrow a book?','Do you want tea?'],correctIndex:0,rationale:'ほんをさがしていますか asks whether the visitor is looking for a book.'},
  {id:'ex-l0-m03-c04-l08-002',prompt:'Which sentence asks whether a cat book is available?',options:['はい。あのたなにあります。','ねこのほんはありますか。','ありがとうございます。'],correctIndex:1,rationale:'ねこのほんはありますか is a question; か marks its question function.'},
  {id:'ex-l0-m03-c04-l08-003',prompt:'Where does the librarian say the book is?',options:['On that shelf','On the floor','Outside the building'],correctIndex:0,rationale:'あのたなにあります means it is on that shelf.'},
  {id:'ex-l0-m03-c04-l08-004',prompt:'What is the visitor asking in Track B?',options:['May I borrow this book?','Where is the station?','Is this a blue book?'],correctIndex:0,rationale:'このほんをかりてもいいですか asks permission to borrow the book.'},
  {id:'ex-l0-m03-c04-l08-005',prompt:'What does the librarian ask the visitor to do?',options:['Write a name','Buy a ticket','Return tomorrow'],correctIndex:0,rationale:'なまえをかいてください is a polite request to write a name.'},
  {id:'ex-l0-m03-c04-l08-006',prompt:'What does the optional voice self-review establish?',options:['Certified speaking proficiency','Personal observations, not a grade','Independent native-speaker approval'],correctIndex:1,rationale:'Self-review is a learner reflection, not a qualified pronunciation assessment.'}
] as const;
export function scoreKnowledge(answers:Record<string,number>){return questions.filter(q=>answers[q.id]===q.correctIndex).length;}
