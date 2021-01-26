import React, { Component } from 'react';
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
} from './tibetanUnicodeData';

const DIAIRESIS_UNICODE_CODEPOINT = '\u0308';
const HIGH_TONE_UNICODE_CODEPOINT = '\u0301';
const LOW_TONE_UNICODE_CODEPOINT = '\u0300';

type AppProps = null;

interface AppState {
	root: string;
	superscript: string;
	prefix: string;
	suffix: string;
	secondSuffix: string;
	subscript: string;
	availableSubscripts: string[];
}

// manual of standard tibetan p 44
class App extends Component<AppProps, AppState> {
	state: AppState = {
		root: '',
		superscript: '',
		prefix: '',
		suffix: '',
		secondSuffix: '',
		subscript: '',
		availableSubscripts: [],
	};

	handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
		const { name, value } = event.target;
		switch (name) {
			case 'root':
				this.setState({
					...this.state,
					[name]: value,
				});
				this.handleRootChange(value);
				break;
			case 'suffix':
				this.setState({
					...this.state,
					secondSuffix: '',
					[name]: value,
				});
				break;
			case 'superscript':
				// the la subscript cannot be displayed if there is a superscript
				// remove la from the subscripts menu if a superscript is selected and clear current subscript
				if (value) {
					const prunedSubscripts = [...this.state.availableSubscripts];
					if (prunedSubscripts.includes('ལ')) {
						prunedSubscripts.splice(prunedSubscripts.indexOf('ལ'), 1);
					}
					this.setState({
						...this.state,
						[name]: value,
						availableSubscripts: prunedSubscripts,
						subscript: '',
					});
					break;
				}
				// if the superscript is deselected, load all subscripts for the current root
				if (subscriptsTable[this.state.root]) {
					this.setState({
						...this.state,
						availableSubscripts: [...subscriptsTable[this.state.root]],
						[name]: value,
					});
				} else {
					this.setState({
						...this.state,
						[name]: value,
					});
				}
				break;
			default:
				this.setState({
					...this.state,
					[name]: value,
				});
				break;
		}
	};

	handleRootChange = (value: string): void => {
		// prefixes, superscripts, and suffixes are available for all roots,
		// specific subscripts are available to specific roots

		// reset the affixes in state
		this.setState({
			superscript: '',
			prefix: '',
			suffix: '',
			secondSuffix: '',
			subscript: '',
			availableSubscripts: [],
		});

		if (subscriptsTable[value]) {
			this.setState({
				availableSubscripts: [...subscriptsTable[value]],
			});
		}
	};

	createTibetanDisplay = (): string => {
		if (!this.state.root) {
			return 'ཨ';
		}
		const prefix = this.state.prefix ? roots[this.state.prefix].unicodeCodePoint : '';
		const superscript = this.state.superscript
			? roots[this.state.superscript].unicodeCodePoint
			: '';
		const subscript = this.state.subscript
			? roots[this.state.subscript].unicodeCodePointAsSubscript
			: '';
		const suffix = this.state.suffix ? roots[this.state.suffix].unicodeCodePoint : '';
		const secondSuffix = this.state.secondSuffix
			? roots[this.state.secondSuffix].unicodeCodePoint
			: '';
		const root = superscript
			? roots[this.state.root].unicodeCodePointAsSubscript
			: roots[this.state.root].unicodeCodePoint;
		return `${prefix}${superscript}${root}${subscript}${suffix}${secondSuffix}`;
	};

	createPhoneticDisplay = (): string => {
		if (!this.state.root || !roots[this.state.root]) {
			return '';
		}

		const root = roots[this.state.root];
		let rootPhonetic = root.phonetic;
		const column = roots[this.state.root].column;
		let tone: Tone = Tone.NONE;
		let diairesis = false;
		let suffix = '';

		// determine if there is change in the root, based on a prefix, superscript, or subscript
		// the root change of the subscript overrides the root change for a third column root with prefix
		if (this.state.prefix || this.state.superscript) {
			if (column === Column.THIRD) {
				rootPhonetic = root.phoneticModifiedThirdColumn
					? root.phoneticModifiedThirdColumn
					: root.phonetic;
			}
			if (column === Column.FOURTH) {
				tone = Tone.HIGH;
			}
		}

		if (this.state.subscript) {
			switch (this.state.subscript) {
				// ra subscript
				case 'ར':
					switch (this.state.root) {
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
							if (this.state.superscript === 'ས') {
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
					if (this.state.root === 'ཟ') {
						rootPhonetic = 'da';
						tone = Tone.LOW;
					} else {
						rootPhonetic = 'la';
						tone = Tone.HIGH;
					}
					break;

				// ya subscript
				case 'ཡ':
					switch (this.state.root) {
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
		}

		if (this.state.suffix) {
			if (suffixesThatCauseVowelChange.includes(this.state.suffix)) {
				diairesis = true;
			}
			suffix = roots[this.state.suffix].phoneticAsSuffix || '';
		}

		let phoneticDisplay = rootPhonetic;
		if (diairesis) phoneticDisplay += DIAIRESIS_UNICODE_CODEPOINT;
		if (tone === Tone.HIGH) phoneticDisplay += HIGH_TONE_UNICODE_CODEPOINT;
		if (tone === Tone.LOW) phoneticDisplay += LOW_TONE_UNICODE_CODEPOINT;
		phoneticDisplay += suffix;

		return phoneticDisplay;
	};

	render() {
		const MENUS = [
			// prefixes
			{
				active: Boolean(this.state.root),
				handleChange: this.handleChange,
				label: 'Prefix',
				identifier: 'prefix',
				value: this.state.prefix,
				options: prefixes,
			},
			// superscripts
			{
				active: Boolean(this.state.root),
				handleChange: this.handleChange,
				label: 'Superscript',
				identifier: 'superscript',
				value: this.state.superscript,
				options: superscripts,
			},
			// root characters menu
			{
				active: true,
				handleChange: this.handleChange,
				label: 'Root character',
				identifier: 'root',
				value: this.state.root,
				options: Object.keys(roots),
			},
			// subscripts
			{
				active: this.state.availableSubscripts.length > 0,
				handleChange: this.handleChange,
				label: 'Subscript',
				identifier: 'subscript',
				value: this.state.subscript,
				options: this.state.availableSubscripts,
			},
			// suffixes
			{
				active: Boolean(this.state.root),
				handleChange: this.handleChange,
				label: 'Suffix 1',
				identifier: 'suffix',
				value: this.state.suffix,
				options: suffixes,
			},
			// second suffixes
			{
				active: Boolean(this.state.suffix),
				handleChange: this.handleChange,
				label: 'Suffix 2',
				identifier: 'secondSuffix',
				value: this.state.secondSuffix,
				options: secondSuffixes,
			},
		];
		return (
			<div className="container">
				{/* tibetan display */}
				<div className="display--tibetan">
					<h1>{this.createTibetanDisplay()}</h1>
				</div>
				{/* transliteration display */}
				<div className="display--transliteration">{this.createPhoneticDisplay()}</div>
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
}

export default App;
