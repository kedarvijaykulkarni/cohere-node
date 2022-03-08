import { expect } from 'chai';
import cohere = require('../index');
require('dotenv').config({ path: '.env.test' });
const KEY: string = process.env.API_KEY || '';

describe('The classify endpoint', () => {
  let response: any;
  cohere.init(KEY);

  it('Should should have a statusCode of 200', async () => {
    response = await cohere.classify('large', {
      examples: [{ text: 'apple', label: 'food' }],
      inputs: ['green'],
    });
    expect(response).to.have.property('statusCode');
    expect(response.statusCode).to.equal(200);
  });
  it('Should contain a body property that contains a classifications property', async () => {
    response = await cohere.classify('large', {
      examples: [{ text: 'apple', label: 'food' }],
      inputs: ['green'],
    });
    expect(response).to.have.property('body');
    expect(response.body.results).to.be.an('array');
  });
  it('Should contain prediciton for food and color', async () => {
    response = await cohere.classify('large', {
      examples: [
        { text: 'apple', label: 'food' },
        { text: 'purple', label: 'color' },
        { text: 'pizza', label: 'food' },
        { text: 'yellow', label: 'color' },
      ],
      inputs: ['green', 'hamburger', 'pasta'],
    });
    expect(response.body.results[0].prediction).to.equal('color'); // green
    expect(response.body.results[1].prediction).to.equal('food'); // hamburger
    expect(response.body.results[2].prediction).to.equal('food'); // pasta
  });

  it('Should contain confidences', async () => {
    response = await cohere.classify('large', {
      examples: [
        { text: 'apple', label: 'food' },
        { text: 'purple', label: 'color' },
        { text: 'orange', label: 'food' },
        { text: 'yellow', label: 'color' },
      ],
      inputs: ['green'],
    });
    expect(response.body.results[0].confidences).to.be.an('array');
    expect(response.body.results[0].confidences[0]).to.have.property('option');
    expect(response.body.results[0].confidences[0]).to.have.property(
      'confidence'
    );
  });

  it('Should classify for all params', async () => {
    response = await cohere.classify('large', {
      taskDescription: 'Classify these words as either a color or a food.',
      examples: [
        { text: 'apple', label: 'food' },
        { text: 'purple', label: 'color' },
        { text: 'pizza', label: 'food' },
        { text: 'yellow', label: 'color' },
      ],
      inputs: ['blue', 'hamburger', 'pasta'],
      outputIndicator: 'This is',
    });
    expect(response.body.results[0].prediction).to.equal('color'); // blue
    expect(response.body.results[1].prediction).to.equal('food'); // hamburger
    expect(response.body.results[2].prediction).to.equal('food'); // pasta
  });
});