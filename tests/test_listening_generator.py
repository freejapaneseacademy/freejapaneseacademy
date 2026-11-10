"""Offline, engine-free tests for the reusable AivisSpeech listening job contract."""
import importlib.util
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts/tts/generate_lesson_audio.py"
spec = importlib.util.spec_from_file_location("fja_listening_generator", SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

def valid_job(scenario="dialogue", lesson="l0-m01-c02-l06"):
    voices = {}
    for role, (model, speaker, style, sha) in module.VOICE_IDS.items():
        voices[role] = {"name": "阿井田 茂" if role == "male" else "morioki",
                       "modelUuid": model, "speakerUuid": speaker, "style": style,
                       "sha256": sha, "speedScale": 0.95, "intonationScale": 0.85,
                       "tempoDynamicsScale": 0.8, "credit": role}
    turns = ([{"speaker": x, "text": t, "english": e} for x, t, e in [
        ("male", "こんにちは。", "Hello."), ("female", "こんにちは。", "Hello."),
        ("male", "温かいお茶をお願いします。", "Hot tea please."),
        ("female", "はい、どうぞ。", "Here you are.")]]
        if scenario in {"dialogue", "interview"} else
        [{"speaker": "female", "text": "今日はいい天気です。", "english": "Nice weather today."}])
    return {
        "schemaVersion": 3, "lessonId": lesson, "audioVersion": 1,
        "candidateOnly": True, "auditoryOnly": True,
        "licenseReview": {"modelTermsReviewed": True,
                          "redistributionCleared": True, "reviewedBy": "Academy content editor"},
        "voices": voices,
        "tracks": [
            {"id": id_, "title": title, "scenarioType": scenario,
             "objectiveId": lesson + "-o" + str(i),
             "turns": turns,
             "comprehensionPrompts": ["What did the speaker request?", "How did the other person respond?"]}
            for i, (id_, title) in enumerate([("a", "At a counter"), ("b", "At a station")], 1)
        ]
    }


class GeneratorContract(unittest.TestCase):
    def test_dialogue_and_each_narration_type(self):
        for scene in module.SCENARIOS:
            with self.subTest(scene=scene):
                job = valid_job(scene, "n1-m12-c04-l06")
                module.validate_job(job)
                wavs, manifest = module.output_paths(job, Path("/tmp/fja-output"))
                self.assertEqual(len(wavs), 2)
                self.assertEqual(manifest.name, "n1-m12-c04-l06-v1.json")
                self.assertTrue(all("n1-m12-c04-l06" in x.name for x in wavs))

    def test_disguised_literacy_question_rejected(self):
        for prompt in ["Which kanji is shown?", "Select the hiragana shape.", "What spelling was printed?"]:
            with self.subTest(prompt=prompt):
                job = valid_job()
                job["tracks"][0]["comprehensionPrompts"][0] = prompt
                with self.assertRaisesRegex(ValueError, "Reading/writing"):
                    module.validate_job(job)

    def test_unlicensed_or_wrong_voice_rejected(self):
        for change in ("rights", "speaker", "style", "candidate"):
            job = valid_job()
            if change == "rights":
                job["licenseReview"]["modelTermsReviewed"] = False
            if change == "speaker":
                job["voices"]["female"]["speakerUuid"] = "wrong"
            if change == "style":
                job["voices"]["male"]["style"] = "Normal"
            if change == "candidate":
                job["candidateOnly"] = False
            with self.assertRaises(ValueError):
                module.validate_job(job)

    def test_dialogue_requires_both_voices(self):
        job = valid_job()
        for turn in job["tracks"][0]["turns"]:
            turn["speaker"] = "female"
        with self.assertRaisesRegex(ValueError, "both actual speakers"):
            module.validate_job(job)

    def test_narration_requires_one_voice(self):
        job = valid_job("story")
        job["tracks"][0]["turns"].append({"speaker": "male", "text": "こんにちは。", "english": "Hello."})
        with self.assertRaisesRegex(ValueError, "one consistent voice"):
            module.validate_job(job)

    def test_fixed_two_tracks_no_overwrite(self):
        job = valid_job()
        job["tracks"].pop()
        with self.assertRaises(ValueError):
            module.validate_job(job)
        job = valid_job()
        with tempfile.TemporaryDirectory() as temp:
            wavs, manifest = module.output_paths(job, Path(temp))
            self.assertNotEqual(wavs[0], wavs[1])
            self.assertTrue(str(manifest).startswith(temp))


if __name__ == "__main__":
    unittest.main()
