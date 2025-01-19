const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

class AIService {
  static async generateSummary(content) {
    try {
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Summarize the following content:\n\n${content}\n\nSummary:`,
        max_tokens: 150,
        temperature: 0.5,
      });
      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('Error generating summary:', error);
      throw new Error('Failed to generate summary');
    }
  }

  static async generateLearningPath(topic, difficulty) {
    try {
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Create a detailed learning path for ${topic} at ${difficulty} level. Include specific steps and resources.\n\nLearning Path:`,
        max_tokens: 500,
        temperature: 0.7,
      });
      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('Error generating learning path:', error);
      throw new Error('Failed to generate learning path');
    }
  }

  static async answerQuestion(question, context) {
    try {
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Context: ${context}\n\nQuestion: ${question}\n\nAnswer:`,
        max_tokens: 200,
        temperature: 0.6,
      });
      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('Error answering question:', error);
      throw new Error('Failed to answer question');
    }
  }

  static async suggestRelatedTopics(topic) {
    try {
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Suggest 5 related topics to "${topic}" that would be interesting for someone learning about this subject.\n\nRelated Topics:`,
        max_tokens: 100,
        temperature: 0.8,
      });
      return response.data.choices[0].text.trim().split('\n');
    } catch (error) {
      console.error('Error suggesting related topics:', error);
      throw new Error('Failed to suggest related topics');
    }
  }

  static async validateContent(content) {
    try {
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Analyze the following content for accuracy and potential misinformation:\n\n${content}\n\nAnalysis:`,
        max_tokens: 200,
        temperature: 0.3,
      });
      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('Error validating content:', error);
      throw new Error('Failed to validate content');
    }
  }
}

module.exports = AIService;
