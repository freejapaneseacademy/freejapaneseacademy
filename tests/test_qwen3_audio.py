import json
from pathlib import Path
import tempfile
import unittest
import wave
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts" / "tts"))
from qwen3_generate import validate_job, verify_wav


class AudioWorkflowTests(unittest.TestCase):
    def setUp(self):
        self.job=json.loads((Path(__file__).resolve().parents[1] / "scripts" / "tts" / "l06_pilot.json").read_text())

    def test_pilot_is_review_only_and_japanese(self):
        validate_job(self.job)
        self.assertTrue(self.job["candidateOnly"])
        self.assertEqual(len(self.job["tracks"]),2)

    def test_unapproved_or_broken_jobs_fail_closed(self):
        for field,value in [("candidateOnly",False),("voice","ryan"),("language","en")]:
            bad={**self.job,field:value}
            with self.assertRaises(ValueError):
                validate_job(bad)

    def test_waveform_validation_rejects_silence(self):
        with tempfile.TemporaryDirectory() as d:
            wav=Path(d)/"silence.wav"
            with wave.open(str(wav),"wb") as w:
                w.setnchannels(1);w.setsampwidth(2);w.setframerate(24000)
                w.writeframes(b"\x00\x00" * 48000)
            with self.assertRaises(ValueError):
                verify_wav(wav)


if __name__=="__main__":
    unittest.main()
