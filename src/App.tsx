import React, { useReducer } from 'react';
import TibetanCharacterMenu from './TibetanCharacterMenu';
import {
	prefixes,
	superscripts,
	roots,
	subscriptsTable,
	suffixes,
	suffixesThatCauseVowelChange,
	secondSuffixes,
	Column,
	Tone,
} from './tibetanData';

const DIAIRESIS_UNICODE_CODE_POINT = '\u0308';
const HIGH_TONE_UNICODE_CODE_POINT = '\u0301';
const LOW_TONE_UNICODE_CODE_POINT = '\u0300';

interface AppState {
	root: string;
	superscript: string;
	prefix: string;
	suffix: string;
	secondSuffix: string;
	subscript: string;
	availableSubscripts: string[];
}

const initialState: AppState = {
	root: '',
	superscript: '',
	prefix: '',
	suffix: '',
	secondSuffix: '',
	subscript: '',
	availableSubscripts: [],
};

enum AppStateActionType {
	CLEAR_STATE,
	UPDATE_PREFIX,
	UPDATE_SUPERSCRIPT,
	UPDATE_ROOT,
	UPDATE_SUBSCRIPT,
	UPDATE_SUFFIX,
	UPDATE_SECOND_SUFFIX,
}

interface AppStateAction {
	type: AppStateActionType;
	payload: string;
}

function reducer(state: AppState, action: AppStateAction): AppState {
	switch (action.type) {
		case AppStateActionType.CLEAR_STATE:
			return initialState;
		case AppStateActionType.UPDATE_PREFIX:
			return {
				...state,
				prefix: action.payload,
			};
		case AppStateActionType.UPDATE_SUPERSCRIPT:
			// the la subscript cannot be displayed if there is a superscript
			// remove la from the subscripts menu if a superscript is selected and clear current subscript
			if (action.payload) {
				const prunedSubscripts = state.availableSubscripts.filter((s) => s !== 'ལ');
				return {
					...state,
					superscript: action.payload,
					availableSubscripts: prunedSubscripts,
					subscript: '',
				};
			}
			// if the superscript is deselected, load all subscripts for the current root
			if (subscriptsTable[state.root]) {
				return {
					...state,
					availableSubscripts: [...subscriptsTable[state.root]],
					superscript: action.payload,
				};
			}
			return {
				...state,
				superscript: action.payload,
			};
		case AppStateActionType.UPDATE_ROOT:
			// prefixes, superscripts, and suffixes are available for all roots,
			// specific subscripts are available to specific roots
			return {
				...initialState,
				root: action.payload,
				availableSubscripts: [...subscriptsTable[action.payload]],
			};
		case AppStateActionType.UPDATE_SUBSCRIPT:
			return {
				...state,
				subscript: action.payload,
			};
		case AppStateActionType.UPDATE_SUFFIX:
			return {
				...state,
				suffix: action.payload,
				secondSuffix: '',
			};
		case AppStateActionType.UPDATE_SECOND_SUFFIX:
			return {
				...state,
				secondSuffix: action.payload,
			};
		default:
			throw new Error();
	}
}

// manual of standard tibetan p 44
function App() {
	const [state, dispatch] = useReducer(reducer, initialState);

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
		const { name, value } = event.target;
		switch (name) {
			case 'prefix':
				dispatch({
					type: AppStateActionType.UPDATE_PREFIX,
					payload: value,
				});
				break;
			case 'superscript':
				dispatch({
					type: AppStateActionType.UPDATE_SUPERSCRIPT,
					payload: value,
				});
				break;
			case 'root':
				dispatch({
					type: AppStateActionType.UPDATE_ROOT,
					payload: value,
				});
				break;
			case 'subscript':
				dispatch({
					type: AppStateActionType.UPDATE_SUBSCRIPT,
					payload: value,
				});
				break;
			case 'suffix':
				dispatch({
					type: AppStateActionType.UPDATE_SUFFIX,
					payload: value,
				});
				break;
			case 'secondSuffix':
				dispatch({
					type: AppStateActionType.UPDATE_SECOND_SUFFIX,
					payload: value,
				});
				break;
			default:
				break;
		}
	};

	const createTibetanDisplay = (): string => {
		if (!state.root) {
			return 'ཨ';
		}
		const prefix = state.prefix ? roots[state.prefix].unicodeCodePoint : '';
		const superscript = state.superscript ? roots[state.superscript].unicodeCodePoint : '';
		const subscript = state.subscript ? roots[state.subscript].unicodeCodePointAsSubscript : '';
		const suffix = state.suffix ? roots[state.suffix].unicodeCodePoint : '';
		const secondSuffix = state.secondSuffix ? roots[state.secondSuffix].unicodeCodePoint : '';
		const root = superscript
			? roots[state.root].unicodeCodePointAsSubscript
			: roots[state.root].unicodeCodePoint;
		return `${prefix}${superscript}${root}${subscript}${suffix}${secondSuffix}`;
	};

	const createPhoneticDisplay = (): string => {
		if (!state.root || !roots[state.root]) {
			return '';
		}

		const root = roots[state.root];
		let rootPhonetic = root.phonetic;
		const column = roots[state.root].column;
		let tone: Tone = Tone.NONE;
		let diairesis = false;
		let suffix = '';

		// determine if there is change in the root, based on a prefix, superscript, or subscript
		// the root change of the subscript overrides the root change for a third column root with prefix
		if (state.prefix || state.superscript) {
			if (column === Column.THIRD) {
				rootPhonetic = root.phoneticModifiedThirdColumn
					? root.phoneticModifiedThirdColumn
					: root.phonetic;
			}
			if (column === Column.FOURTH) {
				tone = Tone.HIGH;
			}
		}

		if (state.subscript) {
			[rootPhonetic, tone] = subscriptPhoneticChange(
				state.subscript,
				state.root,
				rootPhonetic,
				state.superscript,
				tone
			);
		}

		if (state.suffix) {
			if (suffixesThatCauseVowelChange.includes(state.suffix)) {
				diairesis = true;
			}
			suffix = roots[state.suffix].phoneticAsSuffix || '';
		}

		let phoneticDisplay = rootPhonetic;
		if (diairesis) phoneticDisplay += DIAIRESIS_UNICODE_CODE_POINT;
		if (tone === Tone.HIGH) phoneticDisplay += HIGH_TONE_UNICODE_CODE_POINT;
		if (tone === Tone.LOW) phoneticDisplay += LOW_TONE_UNICODE_CODE_POINT;
		phoneticDisplay += suffix;

		return phoneticDisplay;
	};

	function subscriptPhoneticChange(
		subscript: string,
		root: string,
		rootPhonetic: string,
		superscript: string,
		tone: Tone
	): [string, Tone] {
		switch (subscript) {
			// ra subscript
			case 'ར':
				switch (root) {
					case 'ཀ':
					case 'ཏ':
					case 'པ':
						rootPhonetic = 'tra';
						tone = Tone.HIGH;
						break;
					case 'ཁ':
					case 'ཐ':
					case 'ཕ':
						rootPhonetic = 'thra';
						tone = Tone.HIGH;
						break;
					case 'ག':
					case 'ད':
					case 'བ':
						if (superscript === 'ས') {
							rootPhonetic = 'dra';
						} else {
							rootPhonetic = 'thra';
						}
						tone = Tone.LOW;
						break;
					case 'ཧ':
						rootPhonetic = 'hra';
						break;
					default:
						break;
				}
				break;

			// la subscript
			case 'ལ':
				if (root === 'ཟ') {
					rootPhonetic = 'da';
					tone = Tone.LOW;
				} else {
					rootPhonetic = 'la';
					tone = Tone.HIGH;
				}
				break;

			// ya subscript
			case 'ཡ':
				switch (root) {
					case 'མ':
						rootPhonetic = 'nya';
						tone = Tone.LOW;
						break;
					case 'པ':
						rootPhonetic = 'ca';
						tone = Tone.HIGH;
						break;
					case 'ཕ':
						rootPhonetic = 'cha';
						tone = Tone.HIGH;
						break;
					case 'བ':
						rootPhonetic = 'cha';
						tone = Tone.LOW;
						break;
					default:
						rootPhonetic = rootPhonetic.slice(0, -1) + 'ya';
						break;
				}
				break;

			default:
				break;
		}
		return [rootPhonetic, tone];
	}

	const MENUS = [
		// prefixes
		{
			active: Boolean(state.root),
			handleChange: handleChange,
			label: 'Prefix',
			identifier: 'prefix',
			value: state.prefix,
			options: prefixes,
		},
		// superscripts
		{
			active: Boolean(state.root),
			handleChange: handleChange,
			label: 'Superscript',
			identifier: 'superscript',
			value: state.superscript,
			options: superscripts,
		},
		// root characters menu
		{
			active: true,
			handleChange: handleChange,
			label: 'Root character',
			identifier: 'root',
			value: state.root,
			options: Object.keys(roots),
		},
		// subscripts
		{
			active: state.availableSubscripts.length > 0,
			handleChange: handleChange,
			label: 'Subscript',
			identifier: 'subscript',
			value: state.subscript,
			options: state.availableSubscripts,
		},
		// suffixes
		{
			active: Boolean(state.root),
			handleChange: handleChange,
			label: 'Suffix 1',
			identifier: 'suffix',
			value: state.suffix,
			options: suffixes,
		},
		// second suffixes
		{
			active: Boolean(state.suffix),
			handleChange: handleChange,
			label: 'Suffix 2',
			identifier: 'secondSuffix',
			value: state.secondSuffix,
			options: secondSuffixes,
		},
	];
	return (
		<div className="container">
			{/* tibetan display */}
			<div className="display--tibetan">
				<h1>{createTibetanDisplay()}</h1>
			</div>
			{/* transliteration display */}
			<div className="display--transliteration">{createPhoneticDisplay()}</div>
			{/* character menus */}
			<div className="options">
				{MENUS.map((m, i) => (
					<TibetanCharacterMenu
						key={`menu_${i}`}
						active={m.active}
						handleChange={m.handleChange}
						label={m.label}
						identifier={m.identifier}
						value={m.value}
						options={m.options}
					/>
				))}
			</div>
		</div>
	);
}

export default App;
