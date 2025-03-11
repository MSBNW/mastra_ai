# Adding Voice to Agents

Mastra agents can be extended with voice capabilities – meaning they can **speak** responses (text-to-speech) and **listen** to user audio (speech-to-text). This is useful for building voice assistants or phone-based agents. Mastra integrates with third-party voice providers to achieve this.

## Using a Single Provider

The simplest way to give an agent voice is to use one provider for both TTS (text-to-speech) and ASR (automatic speech recognition). For example, you might use OpenAI's Whisper for transcription and a single TTS engine for output.

In Mastra, voice is configured when creating an Agent by specifying a `voice` property. For a single provider case:

```ts
import { Agent } from "@mastra/core/agent";
import { Voice } from "@mastra/core/voice";
import { openai } from "@ai-sdk/openai";

export const myVoiceAgent = new Agent({
  name: "Voice Agent",
  instructions: "You can speak your answers.",
  model: openai("gpt-4"),
  voice: Voice.fromProvider(openai.voice({ voiceId: "Joanna" }))
});
```

*(Pseudo-code example: actual provider usage may vary)*

Here, `Voice.fromProvider(...)` might wrap a TTS/ASR provider into a Mastra Voice interface. The agent would then use that for speaking and listening. The specifics depend on the provider integration (Mastra may provide helpers for supported voice APIs, such as AWS Polly or Google Cloud TTS).

Using a single provider is straightforward but may be limited in flexibility.

## Using Multiple Providers

For more flexibility, Mastra offers a `CompositeVoice` class to mix and match providers for input vs. output. For instance, you could use one service for speech synthesis and another for speech recognition.

Example setup:

```ts
import { Agent } from "@mastra/core/agent";
import { CompositeVoice } from "@mastra/core/voice";
import { ElevenLabsVoice } from "@mastra/voice-elevenlabs";
import { OpenAITranscription } from "@mastra/voice-openai"; 

const compositeVoice = new CompositeVoice({
  speech: new ElevenLabsVoice({ apiKey: process.env.ELEVENLABS_KEY }),
  transcription: new OpenAITranscription({ apiKey: process.env.OPENAI_API_KEY })
});

export const myVoiceAgent = new Agent({
  name: "Voice Agent",
  instructions: "You can speak and listen.",
  model: openai("gpt-4"),
  voice: compositeVoice
});
```

In this imaginary setup, ElevenLabs is used for generating spoken audio from text, and OpenAI's Whisper (via OpenAITranscription) is used for transcribing user audio to text.

## Working with Audio Streams

When an agent has voice enabled, you can call special methods to **speak** or **listen**. The `agent.speak(text)` method will return a readable stream of audio (the spoken form of the text), and `agent.listen(audioStream)` would convert an audio stream to text.

For example, to **save speech output** to a file:

```ts
import { createWriteStream } from 'fs';

const audioStream = await myVoiceAgent.speak("Hello, how are you?");
const writeStream = createWriteStream("output.wav");
audioStream.pipe(writeStream);
```

This will generate speech for the given text and pipe the audio data into a WAV file.

Similarly, for **transcribing audio input** from a file:

```ts
import { createReadStream } from 'fs';

const readStream = createReadStream("question.wav");
const text = await myVoiceAgent.listen(readStream);
console.log("Transcribed text:", text);
```

Here, an audio file (`question.wav`) is fed into the agent's listen function, which returns the recognized text.

## Saving Speech Output

If you want to programmatically handle the audio stream from `speak()`, as shown above, you can use Node's fs streams to save it or process it further. The audio format and encoding depend on the provider (could be WAV, MP3, etc., typically PCM stream for TTS). Always check provider documentation for how audio is returned.

## Transcribing Audio Input

The `listen()` method can take a stream of audio data (e.g., microphone input or a file stream) and returns a Promise for the transcribed text. Under the hood, this will use the configured transcription provider (like Whisper) to decode the audio.

## Voice Integration Providers

Mastra's voice integration relies on external services. Some providers and integrations include:
- **OpenAI Whisper** for transcription.
- **ElevenLabs** or **Azure Cognitive Services** for text-to-speech.
- **Google Cloud Speech** / **Text-to-Speech**.
- **AWS Polly** for TTS and **Transcribe** for STT.

These are not built into Mastra core, but Mastra provides wrapper classes or guidelines to use them (as seen with `CompositeVoice`). You'll need to install the corresponding integration packages (e.g., `@mastra/voice-elevenlabs`) and provide API keys.

## Usage Considerations

- **Latency**: Converting text to speech or vice versa takes time and might not be instant. Design your interactions knowing there may be a delay for speaking or listening.
- **Audio Formats**: Ensure the audio stream you provide to `listen()` matches what the transcription service expects (correct sample rate, encoding).
- **Threading**: Voice input can be part of a conversation thread. If you transcribe user speech and then call `agent.generate` with that text, the memory thread continues normally.
- **Error Handling**: If a voice service fails (e.g., network error, unclear audio), handle exceptions from `speak()` or `listen()` accordingly (wrap calls in try/catch).

By leveraging voice, your Mastra agents can go beyond text chatbots to become full voice assistants, which can be integrated into phone lines, voice apps, or hardware devices.
