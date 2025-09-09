export default class OpenAI {
  constructor() {
    throw new Error(
      "Do not import 'openai' on the client. Use /api/generate instead."
    );
  }
}
