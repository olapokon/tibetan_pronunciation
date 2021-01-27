import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import App from './App';
// import ReactTestUtils from 'react-dom/test-utils';
import { act } from 'react-dom/test-utils';

let container;

beforeEach(() => {
	container = document.createElement('div');
	document.body.appendChild(container);

	act(() => {
		ReactDOM.render(<App />, container);
	});
});

afterEach(() => {
	unmountComponentAtNode(container);
	container.remove();
	container = null;
});

function triggerSelectChangeEvent(identifier, value) {
	const event = document.createEvent('HTMLEvents');
	event.initEvent('change', true, false);

	const selectElement = container.querySelector(identifier);
	selectElement.value = value;
	selectElement.dispatchEvent(event);
}

function getTextContent(identifier) {
	const el = container.querySelector(identifier);
	return el.textContent;
}

it('renders without crashing', () => {});

it('returns the correct result: with subscript "ra"', () => {
	triggerSelectChangeEvent('#root', 'ཏ');
	triggerSelectChangeEvent('#subscript', 'ར');

	expect(getTextContent('.display--transliteration')).toEqual('trá');
	expect(getTextContent('.display--tibetan')).toEqual('ཏྲ');
});

it('returns the correct result: with subscript "ya"', () => {
	triggerSelectChangeEvent('#root', 'ག');
	triggerSelectChangeEvent('#subscript', 'ཡ');

	expect(getTextContent('.display--transliteration')).toEqual('khya');
	expect(getTextContent('.display--tibetan')).toEqual('གྱ');
});

it('returns the correct result: with root sound change and diairesis', () => {
	triggerSelectChangeEvent('#root', 'ག');
	triggerSelectChangeEvent('#superscript', 'ས');
	triggerSelectChangeEvent('#subscript', 'ར');
	triggerSelectChangeEvent('#suffix', 'ལ');

	expect(getTextContent('.display--transliteration')).toEqual('drä̀l');
	expect(getTextContent('.display--tibetan')).toEqual('སྒྲལ');
});
