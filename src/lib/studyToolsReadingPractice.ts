export const studyToolsReadingQuizId='l0-m01-c04-l05-reading-v1';
export const studyToolsReadingQuestions=[
  {
    "id": "c04l05-q01",
    "prompt": "What does the guide tell you to select first?",
    "choices": [
      {
        "id": "a",
        "text": "Japanese input"
      },
      {
        "id": "b",
        "text": "English translation"
      },
      {
        "id": "c",
        "text": "A kanji candidate"
      }
    ],
    "answerKey": {
      "choiceId": "a"
    },
    "evidenceStep": "①",
    "evidence": "まず、日本語の入力をえらびます。",
    "explanation": "First select Japanese input; まず marks the first action."
  },
  {
    "id": "c04l05-q02",
    "prompt": "Which letters does step ② explicitly enter?",
    "choices": [
      {
        "id": "a",
        "text": "neko"
      },
      {
        "id": "b",
        "text": "kya"
      },
      {
        "id": "c",
        "text": "nihongo"
      }
    ],
    "answerKey": {
      "choiceId": "a"
    },
    "evidenceStep": "②",
    "evidence": "ローマ字で `neko` と入力すると",
    "explanation": "The romaji string is printed in step ②."
  },
  {
    "id": "c04l05-q03",
    "prompt": "What appears after entering neko?",
    "choices": [
      {
        "id": "a",
        "text": "猫"
      },
      {
        "id": "b",
        "text": "ねこ"
      },
      {
        "id": "c",
        "text": "きゃ"
      }
    ],
    "answerKey": {
      "choiceId": "b"
    },
    "evidenceStep": "②",
    "evidence": "「ねこ」と出ます。",
    "explanation": "The guide names the visible kana result, not a required kanji conversion."
  },
  {
    "id": "c04l05-q04",
    "prompt": "Does the guide require converting ねこ to kanji?",
    "choices": [
      {
        "id": "a",
        "text": "Yes, always"
      },
      {
        "id": "b",
        "text": "Only on phones"
      },
      {
        "id": "c",
        "text": "No, it can stay hiragana"
      }
    ],
    "answerKey": {
      "choiceId": "c"
    },
    "evidenceStep": "③",
    "evidence": "ひらがなのままでもいいです。",
    "explanation": "The phrase ままでもいいです permits keeping the hiragana."
  },
  {
    "id": "c04l05-q05",
    "prompt": "What should you inspect when you want kanji?",
    "choices": [
      {
        "id": "a",
        "text": "A conversion candidate"
      },
      {
        "id": "b",
        "text": "A microphone"
      },
      {
        "id": "c",
        "text": "An English translation"
      }
    ],
    "answerKey": {
      "choiceId": "a"
    },
    "evidenceStep": "④",
    "evidence": "漢字にしたいときは、変換の候補を見て",
    "explanation": "候補 means candidate; the guide instructs you to look at it."
  },
  {
    "id": "c04l05-q06",
    "prompt": "What must you check about a candidate?",
    "choices": [
      {
        "id": "a",
        "text": "Its font size"
      },
      {
        "id": "b",
        "text": "Its meaning"
      },
      {
        "id": "c",
        "text": "Its audio speed"
      }
    ],
    "answerKey": {
      "choiceId": "b"
    },
    "evidenceStep": "④",
    "evidence": "意味を確認します。",
    "explanation": "意味 means meaning; 確認します means check."
  },
  {
    "id": "c04l05-q07",
    "prompt": "Which reading is explicitly given for 日本語?",
    "choices": [
      {
        "id": "a",
        "text": "にほんご"
      },
      {
        "id": "b",
        "text": "にほご"
      },
      {
        "id": "c",
        "text": "にっぽんご"
      }
    ],
    "answerKey": {
      "choiceId": "a"
    },
    "evidenceStep": "⑤",
    "evidence": "読み方は「にほんご」です。",
    "explanation": "Step ⑤ prints the exact reading にほんご."
  },
  {
    "id": "c04l05-q08",
    "prompt": "What is the purpose of furigana in this guide?",
    "choices": [
      {
        "id": "a",
        "text": "Translate to English"
      },
      {
        "id": "b",
        "text": "Select a keyboard"
      },
      {
        "id": "c",
        "text": "Show a reading"
      }
    ],
    "answerKey": {
      "choiceId": "c"
    },
    "evidenceStep": "⑤",
    "evidence": "ふりがなは読み方を示します。",
    "explanation": "示します means shows; the object is 読み方, a reading."
  },
  {
    "id": "c04l05-q09",
    "prompt": "Which character is identified as small?",
    "choices": [
      {
        "id": "a",
        "text": "や"
      },
      {
        "id": "b",
        "text": "ゃ"
      },
      {
        "id": "c",
        "text": "ね"
      }
    ],
    "answerKey": {
      "choiceId": "b"
    },
    "evidenceStep": "⑥",
    "evidence": "小さい「ゃ」と大きい「や」",
    "explanation": "Small ゃ contrasts with full-size や."
  },
  {
    "id": "c04l05-q10",
    "prompt": "Which pair does the guide say differs?",
    "choices": [
      {
        "id": "a",
        "text": "きゃ and きや"
      },
      {
        "id": "b",
        "text": "ねこ and ねこ"
      },
      {
        "id": "c",
        "text": "にほんご and にほんご"
      }
    ],
    "answerKey": {
      "choiceId": "a"
    },
    "evidenceStep": "⑥",
    "evidence": "「きゃ」と「きや」はちがいます。",
    "explanation": "The contrast is printed explicitly in step ⑥."
  },
  {
    "id": "c04l05-q11",
    "prompt": "What can a learner ask when stuck?",
    "choices": [
      {
        "id": "a",
        "text": "Please tell me the reading"
      },
      {
        "id": "b",
        "text": "Please turn off the computer"
      },
      {
        "id": "c",
        "text": "Please select the first candidate"
      }
    ],
    "answerKey": {
      "choiceId": "a"
    },
    "evidenceStep": "⑦",
    "evidence": "よみかたを おしえて ください",
    "explanation": "The phrase asks politely for the reading."
  },
  {
    "id": "c04l05-q12",
    "prompt": "Which step describes conversion rather than input or furigana?",
    "choices": [
      {
        "id": "a",
        "text": "②"
      },
      {
        "id": "b",
        "text": "④"
      },
      {
        "id": "c",
        "text": "⑤"
      }
    ],
    "answerKey": {
      "choiceId": "b"
    },
    "evidenceStep": "④",
    "evidence": "漢字にしたいときは、変換の候補を見て",
    "explanation": "Step ④ is specifically about selecting and checking kanji candidates."
  }
] as const;
export function scoreStudyToolsReading(answers:Record<string,string>){return studyToolsReadingQuestions.filter(q=>answers[q.id]===q.answerKey.choiceId).length;}
