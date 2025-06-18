“Lexi” – A playful AI-native language playground

• Domain: vocabulary, translation, quick grammar drills

• Core UX: a 4×4 grid of “word pads” you tap to expand – each pad streams in definitions, synonyms, example sentences, mini-quiz cards, all driven by Mastra tool calls

• Tool calls (via XML prompts in Mastra):

<tool_call id="defineTerm" name="defineTerm">…</tool_call>

<tool_call id="makeQuiz" name="generateQuiz">…</tool_call>

<tool_call id="giveHint" name="hintGenerator">…</tool_call>

• Generative UI modules: FlashcardComponent, InlineFillBlank, QuizModal, SynonymCloud – all returned as structured JSON from Gemini 2.5 Flash–powered chat agent over OpenRouter, then rendered with Framer Motion transitions and radial Tailwind palettes

• Aesthetic: pocket-operator minimalism – chunky monospace text, neon-accented outlines, tactile button-like pads, subtle “bleep bloop” UI micro-animations