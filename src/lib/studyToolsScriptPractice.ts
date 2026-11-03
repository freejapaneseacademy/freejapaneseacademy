export const studyToolsScriptQuizId='l0-m01-c04-l04-script-v1';
export const studyToolsScriptQuestions=[
  {
    "id": "c04l04-q01",
    "prompt": "Which displayed kana is produced by common romaji input 'kya'?",
    "choices": [
      {
        "id": "a",
        "text": "きゃ"
      },
      {
        "id": "b",
        "text": "きや"
      },
      {
        "id": "c",
        "text": "かや"
      }
    ],
    "answerKey": {
      "choiceId": "a"
    },
    "explanation": "Small ゃ joins き in きゃ; full-size や produces a different sequence."
  },
  {
    "id": "c04l04-q02",
    "prompt": "Which is the full-size や?",
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
        "text": "ゅ"
      }
    ],
    "answerKey": {
      "choiceId": "a"
    },
    "explanation": "や is full size; ゃ is the small counterpart."
  },
  {
    "id": "c04l04-q03",
    "prompt": "Which is the small っ?",
    "choices": [
      {
        "id": "a",
        "text": "っ"
      },
      {
        "id": "b",
        "text": "つ"
      },
      {
        "id": "c",
        "text": "し"
      }
    ],
    "answerKey": {
      "choiceId": "a"
    },
    "explanation": "っ is the smaller version of つ, used here for a held consonant."
  },
  {
    "id": "c04l04-q04",
    "prompt": "Which spelling matches 'kitte' (stamp) in a typical romaji IME?",
    "choices": [
      {
        "id": "a",
        "text": "きって"
      },
      {
        "id": "b",
        "text": "きて"
      },
      {
        "id": "c",
        "text": "きや"
      }
    ],
    "answerKey": {
      "choiceId": "a"
    },
    "explanation": "The doubled t produces small っ: き・っ・て."
  },
  {
    "id": "c04l04-q05",
    "prompt": "Which spelling matches 'neko' in hiragana?",
    "choices": [
      {
        "id": "a",
        "text": "ねこ"
      },
      {
        "id": "b",
        "text": "にこ"
      },
      {
        "id": "c",
        "text": "のこ"
      }
    ],
    "answerKey": {
      "choiceId": "a"
    },
    "explanation": "ne-ko corresponds to ねこ."
  },
  {
    "id": "c04l04-q06",
    "prompt": "Which spelling matches 'nihongo' in hiragana?",
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
        "text": "にほんこ"
      }
    ],
    "answerKey": {
      "choiceId": "a"
    },
    "explanation": "The nasal ん and voiced ご are both needed in にほんご."
  },
  {
    "id": "c04l04-q07",
    "prompt": "What does furigana provide above 日本語?",
    "choices": [
      {
        "id": "a",
        "text": "A reading in kana"
      },
      {
        "id": "b",
        "text": "A mandatory English translation"
      },
      {
        "id": "c",
        "text": "A keyboard setting"
      }
    ],
    "answerKey": {
      "choiceId": "a"
    },
    "explanation": "Furigana shows the reading にほんご without replacing the main written word."
  },
  {
    "id": "c04l04-q08",
    "prompt": "After entering ねこ, must you select a kanji candidate?",
    "choices": [
      {
        "id": "a",
        "text": "No; hiragana can be appropriate"
      },
      {
        "id": "b",
        "text": "Yes; every word must use kanji"
      },
      {
        "id": "c",
        "text": "Yes; furigana requires it"
      }
    ],
    "answerKey": {
      "choiceId": "a"
    },
    "explanation": "The word can be left in hiragana; conversion is optional and context-dependent."
  },
  {
    "id": "c04l04-q09",
    "prompt": "Which string uses a small ゅ?",
    "choices": [
      {
        "id": "a",
        "text": "きゅ"
      },
      {
        "id": "b",
        "text": "きゆ"
      },
      {
        "id": "c",
        "text": "くゆ"
      }
    ],
    "answerKey": {
      "choiceId": "a"
    },
    "explanation": "きゅ uses small ゅ; きゆ uses full-size ゆ."
  },
  {
    "id": "c04l04-q10",
    "prompt": "How many morae are in きって?",
    "choices": [
      {
        "id": "a",
        "text": "Three"
      },
      {
        "id": "b",
        "text": "Two"
      },
      {
        "id": "c",
        "text": "Four"
      }
    ],
    "answerKey": {
      "choiceId": "a"
    },
    "explanation": "Count き・っ・て: small っ occupies a mora."
  },
  {
    "id": "c04l04-q11",
    "prompt": "Which kana reading is shown for 学校 in the lesson?",
    "choices": [
      {
        "id": "a",
        "text": "がっこう"
      },
      {
        "id": "b",
        "text": "がこう"
      },
      {
        "id": "c",
        "text": "かっこ"
      }
    ],
    "answerKey": {
      "choiceId": "a"
    },
    "explanation": "The model is がっこう, with small っ and final う."
  },
  {
    "id": "c04l04-q12",
    "prompt": "What should you check before accepting IME conversion?",
    "choices": [
      {
        "id": "a",
        "text": "That the candidate matches the intended word"
      },
      {
        "id": "b",
        "text": "That it contains the most kanji"
      },
      {
        "id": "c",
        "text": "That it adds furigana automatically"
      }
    ],
    "answerKey": {
      "choiceId": "a"
    },
    "explanation": "IME candidates can differ in meaning; choose the contextually correct form."
  }
] as const;
export function scoreStudyToolsScript(answers:Record<string,string>){return studyToolsScriptQuestions.filter(q=>answers[q.id]===q.answerKey.choiceId).length;}
