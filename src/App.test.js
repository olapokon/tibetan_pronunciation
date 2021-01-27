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

it('renders without crashing', () => {});

// root: 'ta', subscript: 'ra': expected: 'trá'
it('returns the correct result: with subscript', () => {
	const event = document.createEvent('HTMLEvents');
	event.initEvent('change', true, false);

	// trigger root change event - 'ta'
	const rootSelect = container.querySelector('#root');
	rootSelect.value = 'ཏ';
	rootSelect.dispatchEvent(event);

	// trigger subscript change event - 'ra'
	const subscriptSelect = container.querySelector('#subscript');
	subscriptSelect.value = 'ར';
	subscriptSelect.dispatchEvent(event);

	const transliterationDisplay = container.querySelector('.display--transliteration');
	const tibetanDisplay = container.querySelector('.display--tibetan');
	expect(transliterationDisplay.textContent).toEqual('trá');
	expect(tibetanDisplay.textContent).toEqual('ཏྲ');
});

// root: 'ག', subscript: 'ya': expected: 'khya'
it('returns the correct result: with subscript', () => {
	const event = document.createEvent('HTMLEvents');
	event.initEvent('change', true, false);

	// trigger root change event - 'ta'
	const rootSelect = container.querySelector('#root');
	rootSelect.value = 'ག';
	rootSelect.dispatchEvent(event);

	// trigger subscript change event - 'ra'
	const subscriptSelect = container.querySelector('#subscript');
	subscriptSelect.value = 'ཡ';
	subscriptSelect.dispatchEvent(event);

	const transliterationDisplay = container.querySelector('.display--transliteration');
	const tibetanDisplay = container.querySelector('.display--tibetan');
	expect(transliterationDisplay.textContent).toEqual('khya');
	expect(tibetanDisplay.textContent).toEqual('གྱ');
});

// root: 'kha', superscript: 'sa', subscript: 'ra', suffix 1: 'la': expected: 'drä̀l'
it('returns the correct result: with root sound change and diairesis', () => {
	const event = document.createEvent('HTMLEvents');
	event.initEvent('change', true, false);

	// trigger root change event - 'kha'
	const rootSelect = container.querySelector('#root');
	rootSelect.value = 'ག';
	rootSelect.dispatchEvent(event);

	// trigger superscript change event - 'sa'
	const superscriptSelect = container.querySelector('#superscript');
	superscriptSelect.value = 'ས';
	superscriptSelect.dispatchEvent(event);

	// trigger subscript change event - 'ra'
	const subscriptSelect = container.querySelector('#subscript');
	subscriptSelect.value = 'ར';
	subscriptSelect.dispatchEvent(event);

	// trigger suffix change event - 'la'
	const suffix1Select = container.querySelector('#suffix');
	suffix1Select.value = 'ལ';
	suffix1Select.dispatchEvent(event);

	const transliterationDisplay = container.querySelector('.display--transliteration');
	const tibetanDisplay = container.querySelector('.display--tibetan');
	expect(transliterationDisplay.textContent).toEqual('drä̀l');
	expect(tibetanDisplay.textContent).toEqual('སྒྲལ');
});
