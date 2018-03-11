'use strict';

class GoogleTemplate {
  constructor() {
    this.template = {
      conversationToken: {},
      expectUserResponse: false,
      expectedInputs: []
    };
  }

  /**
   * Ask a question to the user and expect a response
   * @param {Array<Object>} items the question items to ask to the user.
   *  {
   *     "speech": "the spoken text",
   *     "displayText": "the text displayed on the screen"
   *  }
   * @param {Array<Object>} noInputs Prompt used to ask user when there is no input from user.
   *  {
   *     "speech": "the spoken text",
   *     "displayText": "the text displayed on the screen"
   *  }
   */
  ask(items, noInputs) {
    this.template.expectedInputs.push({
      inputPrompt: this._buildInputPrompt(false, items, []),
      possibleIntents: [{
        intent: "actions.intent.TEXT"
      }]
    });
    return this;
  }

  /**
   * Ask a question to the user and expect a response. the information provided should respect the SSML format.
   * @param {Array<Object>} items the question items to ask to the user.
   *  {
   *     "speech": "the spoken text",
   *     "displayText": "the text displayed on the screen"
   *  }
   * @param {Array<Object>} noInputs Prompt used to ask user when there is no input from user.
   *  {
   *     "speech": "the spoken text",
   *     "displayText": "the text displayed on the screen"
   *  }
   */
  askSsml(items, noInputs) {
    this.template.expectedInputs.push({
      inputPrompt: this._buildInputPrompt(true, items, []),
      possibleIntents: [{
        intent: "actions.intent.TEXT"
      }]
    });
    return this;
  }

  /**
   * Indicates whether the app is expecting a user response. 
   * This is true when the conversation is ongoing, false when the conversation is done.
   * 
   * By default the generated response set this flag to false.
   */
  expectUserResponse() {
    this.template.expectUserResponse = true;
    return this;
  }

  /**
   * Allow retrieve the built response
   */
  get() {
    return this.template;
  }

  /**
   * Build the InputPrompt response to send to the user.
   * 
   * @see https://developers.google.com/actions/reference/rest/Shared.Types/AppResponse#InputPrompt
   * @param {Boolean} isSsml flag indicating if the prompt is SSML
   * @param {Any} prompt the prompt message for the user
   * @param {Array<Any>} noInputs Prompt used to ask user when there is no input from user.
   */
  _buildInputPrompt(isSsml, prompts, noInputs) {
    return {
      richInitialPrompt: {
        items: prompts.reduce((answer, prompt) => {
          answer.push({
            simpleResponse: {
              textToSpeech: !isSsml ? prompt.speech : undefined,
              ssml: isSsml ? prompt.speech : undefined,
              displayText: prompt.displayText
            }
          });
          return answer;
        }, [])
      },
      noInputPrompts: noInputs.reduce((answer, prompt) => {
        answer.push({
          textToSpeech: !isSsml ? prompt.speech : undefined,
          ssml: isSsml ? prompt.speech : undefined,
          displayText: prompt.displayText
        });
        return answer;
      }, [])
    };
  }

}

module.exports = GoogleTemplate;