export interface TibetanCharacter {
	wylie: string;
	phonetic: string;
	phoneticAsSuffix?: string;
	phoneticModifiedThirdColumn?: string;
	unicodeCodePoint: string;
	unicodeCodePointAsSubscript?: string;
	column: Column;
}

export enum Column {
	FIRST = 'FIRST',
	SECOND = 'SECOND',
	THIRD = 'THIRD',
	FOURTH = 'FOURTH',
	NONE = 'NONE',
}

export enum Tone {
	HIGH = 'HIGH',
	LOW = 'LOW',
	MID = 'MID',
	NONE = 'NONE',
}

export const roots: { [unicode: string]: TibetanCharacter } = {
	ཀ: {
		wylie: 'ka',
		phonetic: 'ka',
		unicodeCodePoint: '\u0F40',
		unicodeCodePointAsSubscript: '\u0F90',
		column: Column.FIRST,
	},
	ཅ: {
		wylie: 'ca',
		phonetic: 'ca',
		unicodeCodePoint: '\u0F45',
		unicodeCodePointAsSubscript: '\u0F95',
		column: Column.FIRST,
	},
	ཏ: {
		wylie: 'ta',
		phonetic: 'ta',
		unicodeCodePoint: '\u0F4F',
		unicodeCodePointAsSubscript: '\u0F9F',
		column: Column.FIRST,
	},
	པ: {
		wylie: 'pa',
		phonetic: 'pa',
		unicodeCodePoint: '\u0F54',
		unicodeCodePointAsSubscript: '\u0FA4',
		column: Column.FIRST,
	},
	ཙ: {
		wylie: 'tsa',
		phonetic: 'tsa',
		unicodeCodePoint: '\u0F59',
		unicodeCodePointAsSubscript: '\u0FA9',
		column: Column.FIRST,
	},
	ཞ: {
		wylie: 'zha',
		phonetic: 'zha',
		unicodeCodePoint: '\u0F5E',
		unicodeCodePointAsSubscript: '\u0FAE',
		column: Column.NONE,
	},
	ར: {
		wylie: 'ra',
		phonetic: 'ra',
		phoneticAsSuffix: 'r',
		unicodeCodePoint: '\u0F62',
		unicodeCodePointAsSubscript: '\u0FB2',
		column: Column.NONE,
	},
	ཧ: {
		wylie: 'ha',
		phonetic: 'ha',
		unicodeCodePoint: '\u0F67',
		unicodeCodePointAsSubscript: '\u0FB7',
		column: Column.NONE,
	},
	ཁ: {
		wylie: 'kha',
		phonetic: 'kha',
		unicodeCodePoint: '\u0F41',
		unicodeCodePointAsSubscript: '\u0F91',
		column: Column.SECOND,
	},
	ཆ: {
		wylie: 'cha',
		phonetic: 'cha',
		unicodeCodePoint: '\u0F46',
		unicodeCodePointAsSubscript: '\u0F96',
		column: Column.SECOND,
	},
	ཐ: {
		wylie: 'tha',
		phonetic: 'tha',
		unicodeCodePoint: '\u0F50',
		unicodeCodePointAsSubscript: '\u0FA0',
		column: Column.SECOND,
	},
	ཕ: {
		wylie: 'pha',
		phonetic: 'pha',
		unicodeCodePoint: '\u0F55',
		unicodeCodePointAsSubscript: '\u0FA5',
		column: Column.SECOND,
	},
	ཚ: {
		wylie: 'tsha',
		phonetic: 'tsha',
		unicodeCodePoint: '\u0F5A',
		unicodeCodePointAsSubscript: '\u0FAA',
		column: Column.SECOND,
	},
	ཟ: {
		wylie: 'za',
		phonetic: 'za',
		unicodeCodePoint: '\u0F5F',
		unicodeCodePointAsSubscript: '\u0FAF',
		column: Column.NONE,
	},
	ལ: {
		wylie: 'la',
		phonetic: 'la',
		phoneticAsSuffix: 'l',
		unicodeCodePoint: '\u0F63',
		unicodeCodePointAsSubscript: '\u0FB3',
		column: Column.NONE,
	},
	ཨ: {
		wylie: 'a',
		phonetic: 'a',
		unicodeCodePoint: '\u0F68',
		unicodeCodePointAsSubscript: '\u0FB8',
		column: Column.NONE,
	},
	ག: {
		wylie: 'ga',
		phonetic: 'kha',
		phoneticAsSuffix: 'k',
		phoneticModifiedThirdColumn: 'ga',
		unicodeCodePoint: '\u0F42',
		unicodeCodePointAsSubscript: '\u0F92',
		column: Column.THIRD,
	},
	ཇ: {
		wylie: 'ja',
		phonetic: 'cha',
		phoneticModifiedThirdColumn: 'ja',
		unicodeCodePoint: '\u0F47',
		unicodeCodePointAsSubscript: '\u0F97',
		column: Column.THIRD,
	},
	ད: {
		wylie: 'da',
		phonetic: 'tha',
		phoneticAsSuffix: '',
		phoneticModifiedThirdColumn: 'da',
		unicodeCodePoint: '\u0F51',
		unicodeCodePointAsSubscript: '\u0FA1',
		column: Column.THIRD,
	},
	བ: {
		wylie: 'ba',
		phonetic: 'pha',
		phoneticAsSuffix: 'p',
		phoneticModifiedThirdColumn: 'ba',
		unicodeCodePoint: '\u0F56',
		unicodeCodePointAsSubscript: '\u0FA6',
		column: Column.THIRD,
	},
	ཛ: {
		wylie: 'dza',
		phonetic: 'dza',
		phoneticModifiedThirdColumn: 'dza',
		unicodeCodePoint: '\u0F5B',
		unicodeCodePointAsSubscript: '\u0FAB',
		column: Column.THIRD,
	},
	འ: {
		wylie: "'a",
		phonetic: 'a',
		phoneticAsSuffix: '',
		unicodeCodePoint: '\u0F60',
		unicodeCodePointAsSubscript: '\u0FB0',
		column: Column.NONE,
	},
	ཤ: {
		wylie: 'sha',
		phonetic: 'sha',
		unicodeCodePoint: '\u0F64',
		unicodeCodePointAsSubscript: '\u0FB4',
		column: Column.NONE,
	},
	ང: {
		wylie: 'nga',
		phonetic: 'nga',
		phoneticAsSuffix: 'ng',
		unicodeCodePoint: '\u0F44',
		unicodeCodePointAsSubscript: '\u0F94',
		column: Column.FOURTH,
	},
	ཉ: {
		wylie: 'nya',
		phonetic: 'nya',
		unicodeCodePoint: '\u0F49',
		unicodeCodePointAsSubscript: '\u0F99',
		column: Column.FOURTH,
	},
	ན: {
		wylie: 'na',
		phonetic: 'na',
		phoneticAsSuffix: 'n',
		unicodeCodePoint: '\u0F53',
		unicodeCodePointAsSubscript: '\u0FA3',
		column: Column.FOURTH,
	},
	མ: {
		wylie: 'ma',
		phonetic: 'ma',
		phoneticAsSuffix: 'm',
		unicodeCodePoint: '\u0F58',
		unicodeCodePointAsSubscript: '\u0FA8',
		column: Column.FOURTH,
	},
	ཝ: {
		wylie: 'wa',
		phonetic: 'wa',
		unicodeCodePoint: '\u0F5D',
		unicodeCodePointAsSubscript: '\u0FAD',
		column: Column.NONE, // TODO: FOURTH or NONE?
	},
	ཡ: {
		wylie: 'ya',
		phonetic: 'ya',
		unicodeCodePoint: '\u0F61',
		unicodeCodePointAsSubscript: '\u0FB1',
		column: Column.NONE,
	},
	ས: {
		wylie: 'sa',
		phonetic: 'sa',
		phoneticAsSuffix: '',
		unicodeCodePoint: '\u0F66',
		unicodeCodePointAsSubscript: '\u0FB6',
		column: Column.NONE,
	},
};

export const superscripts: string[] = ['ར', 'ལ', 'ས'];

export const prefixes: string[] = ['ག', 'ད', 'བ', 'མ', 'འ'];

export const suffixes: string[] = ['ག', 'ང', 'ད', 'ན', 'བ', 'མ', 'འ', 'ར', 'ལ', 'ས'];

export const suffixesThatCauseVowelChange: string[] = ['ད', 'ན', 'ལ', 'ས'];

export const secondSuffixes: string[] = ['ད', 'ས'];

export const subscriptsTable: { [unicode: string]: string[] } = {
	ཀ: ['ཡ', 'ར', 'ལ'],
	ཁ: ['ཡ', 'ར'],
	ག: ['ཡ', 'ར', 'ལ'],
	པ: ['ཡ', 'ར', 'ལ'],
	ཕ: ['ཡ', 'ར'],
	བ: ['ཡ', 'ར'],
	མ: ['ཡ', 'ར'],
	ཏ: ['ར'],
	ཐ: ['ར'],
	ད: ['ར'],
	ཤ: ['ར'],
	ར: ['ལ'],
	ས: ['ར', 'ལ'],
	ཟ: ['ལ'],
	ཧ: ['ར'],
};
