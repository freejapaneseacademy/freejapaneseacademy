export const studyToolsGrammarQuizId = 'l0-m01-c04-l03-grammar-v1';
export const studyToolsGrammarQuestions = [
  {
    "id": "c04l03-q01",
    "prompt": "Aya says にほんごで かきたいです。 Who wants to write?",
    "choices": [
      {
        "id": "a",
        "text": "Aya herself",
        "rationale": "Correct: たいです expresses Aya’s wish, not an instruction to Ken."
      },
      {
        "id": "b",
        "text": "Ken is ordered to write",
        "rationale": "Not quite; compare the sentence function explained below."
      },
      {
        "id": "c",
        "text": "The computer speaks",
        "rationale": "Not quite; compare the sentence function explained below."
      }
    ],
    "answerKey": {
      "choiceId": "a"
    },
    "explanation": "たいです expresses Aya’s wish, not an instruction to Ken."
  },
  {
    "id": "c04l03-q02",
    "prompt": "Which phrase directly asks Ken to write?",
    "choices": [
      {
        "id": "a",
        "text": "かきたいです。",
        "rationale": "Not quite; compare the sentence function explained below."
      },
      {
        "id": "b",
        "text": "かいて ください。",
        "rationale": "Correct: The te-form + ください requests an action by the listener."
      },
      {
        "id": "c",
        "text": "かきます。",
        "rationale": "Not quite; compare the sentence function explained below."
      }
    ],
    "answerKey": {
      "choiceId": "b"
    },
    "explanation": "The te-form + ください requests an action by the listener."
  },
  {
    "id": "c04l03-q03",
    "prompt": "In にほんごで かきます, what does で indicate?",
    "choices": [
      {
        "id": "a",
        "text": "The language used",
        "rationale": "Correct: にほんごで means 'in Japanese'; で marks the language or means."
      },
      {
        "id": "b",
        "text": "The person addressed",
        "rationale": "Not quite; compare the sentence function explained below."
      },
      {
        "id": "c",
        "text": "The word’s reading",
        "rationale": "Not quite; compare the sentence function explained below."
      }
    ],
    "answerKey": {
      "choiceId": "a"
    },
    "explanation": "にほんごで means 'in Japanese'; で marks the language or means."
  },
  {
    "id": "c04l03-q04",
    "prompt": "Aya sees unfamiliar kanji. Which request is precise?",
    "choices": [
      {
        "id": "a",
        "text": "へんかんできますか。",
        "rationale": "Not quite; compare the sentence function explained below."
      },
      {
        "id": "b",
        "text": "ゆっくり おねがいします。",
        "rationale": "Not quite; compare the sentence function explained below."
      },
      {
        "id": "c",
        "text": "よみかたを おしえて ください。",
        "rationale": "Correct: よみかたを specifies the reading she needs."
      }
    ],
    "answerKey": {
      "choiceId": "c"
    },
    "explanation": "よみかたを specifies the reading she needs."
  },
  {
    "id": "c04l03-q05",
    "prompt": "What does ふりがなを つけて ください ask?",
    "choices": [
      {
        "id": "a",
        "text": "Add reading kana to written text",
        "rationale": "Correct: Furigana annotate the reading; they do not replace the word."
      },
      {
        "id": "b",
        "text": "Convert all kana to kanji",
        "rationale": "Not quite; compare the sentence function explained below."
      },
      {
        "id": "c",
        "text": "Translate into English",
        "rationale": "Not quite; compare the sentence function explained below."
      }
    ],
    "answerKey": {
      "choiceId": "a"
    },
    "explanation": "Furigana annotate the reading; they do not replace the word."
  },
  {
    "id": "c04l03-q06",
    "prompt": "Which action is へんかん?",
    "choices": [
      {
        "id": "a",
        "text": "Showing English subtitles",
        "rationale": "Not quite; compare the sentence function explained below."
      },
      {
        "id": "b",
        "text": "Choosing a kanji conversion candidate",
        "rationale": "Correct: へんかん refers to conversion during input."
      },
      {
        "id": "c",
        "text": "Slowing speech",
        "rationale": "Not quite; compare the sentence function explained below."
      }
    ],
    "answerKey": {
      "choiceId": "b"
    },
    "explanation": "へんかん refers to conversion during input."
  },
  {
    "id": "c04l03-q07",
    "prompt": "Aya typed ねこ. Must she convert it to kanji?",
    "choices": [
      {
        "id": "a",
        "text": "Yes, Japanese words require kanji",
        "rationale": "Not quite; compare the sentence function explained below."
      },
      {
        "id": "b",
        "text": "Yes, furigana is mandatory",
        "rationale": "Not quite; compare the sentence function explained below."
      },
      {
        "id": "c",
        "text": "No, hiragana can be appropriate",
        "rationale": "Correct: ねこ is a legitimate hiragana spelling; conversion is not obligatory."
      }
    ],
    "answerKey": {
      "choiceId": "c"
    },
    "explanation": "ねこ is a legitimate hiragana spelling; conversion is not obligatory."
  },
  {
    "id": "c04l03-q08",
    "prompt": "What is the role of を in よみかたを おしえて ください?",
    "choices": [
      {
        "id": "a",
        "text": "Marks the information requested",
        "rationale": "Correct: を marks よみかた as the object of おしえて."
      },
      {
        "id": "b",
        "text": "Marks the input language",
        "rationale": "Not quite; compare the sentence function explained below."
      },
      {
        "id": "c",
        "text": "Means please",
        "rationale": "Not quite; compare the sentence function explained below."
      }
    ],
    "answerKey": {
      "choiceId": "a"
    },
    "explanation": "を marks よみかた as the object of おしえて."
  },
  {
    "id": "c04l03-q09",
    "prompt": "What is the function of にしてください in にほんごの にゅうりょくに してください?",
    "choices": [
      {
        "id": "a",
        "text": "Asks for a change to Japanese input",
        "rationale": "Correct: N + にしてください requests a change to a specified state."
      },
      {
        "id": "b",
        "text": "Reports an existing setting",
        "rationale": "Not quite; compare the sentence function explained below."
      },
      {
        "id": "c",
        "text": "Names a kanji",
        "rationale": "Not quite; compare the sentence function explained below."
      }
    ],
    "answerKey": {
      "choiceId": "a"
    },
    "explanation": "N + にしてください requests a change to a specified state."
  },
  {
    "id": "c04l03-q10",
    "prompt": "Why can おしえて ください alone be ambiguous?",
    "choices": [
      {
        "id": "a",
        "text": "It is always impolite",
        "rationale": "Not quite; compare the sentence function explained below."
      },
      {
        "id": "b",
        "text": "It does not specify what information is wanted",
        "rationale": "Correct: A polite request may still lack the object or topic."
      },
      {
        "id": "c",
        "text": "It means to type",
        "rationale": "Not quite; compare the sentence function explained below."
      }
    ],
    "answerKey": {
      "choiceId": "b"
    },
    "explanation": "A polite request may still lack the object or topic."
  },
  {
    "id": "c04l03-q11",
    "prompt": "To ask for a word’s meaning, which phrase fits?",
    "choices": [
      {
        "id": "a",
        "text": "よみかたを おしえて ください。",
        "rationale": "Not quite; compare the sentence function explained below."
      },
      {
        "id": "b",
        "text": "へんかんして ください。",
        "rationale": "Not quite; compare the sentence function explained below."
      },
      {
        "id": "c",
        "text": "いみを おしえて ください。",
        "rationale": "Correct: いみ is meaning, whereas よみかた is reading."
      }
    ],
    "answerKey": {
      "choiceId": "c"
    },
    "explanation": "いみ is meaning, whereas よみかた is reading."
  },
  {
    "id": "c04l03-q12",
    "prompt": "Aya asks へんかんできますか。 What is she asking?",
    "choices": [
      {
        "id": "a",
        "text": "Whether conversion is possible",
        "rationale": "Correct: できますか asks about possibility, not whether conversion is always best."
      },
      {
        "id": "b",
        "text": "Whether the reading is English",
        "rationale": "Not quite; compare the sentence function explained below."
      },
      {
        "id": "c",
        "text": "Whether Ken can speak slowly",
        "rationale": "Not quite; compare the sentence function explained below."
      }
    ],
    "answerKey": {
      "choiceId": "a"
    },
    "explanation": "できますか asks about possibility, not whether conversion is always best."
  }
] as const;
export function scoreStudyToolsGrammar(answers:Record<string,string>):number {return studyToolsGrammarQuestions.filter(q=>answers[q.id]===q.answerKey.choiceId).length;}
