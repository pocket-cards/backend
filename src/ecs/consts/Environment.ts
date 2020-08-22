export const AWS_DEFAULT_REGION = process.env.AWS_DEFAULT_REGION as string;
export const TABLE_USERS = process.env.TABLE_USERS as string;
export const TABLE_GROUPS = process.env.TABLE_GROUPS as string;
export const TABLE_WORDS = process.env.TABLE_WORDS as string;
export const TABLE_WORD_MASTER = process.env.TABLE_WORD_MASTER as string;
export const TABLE_HISTORIES = process.env.TABLE_HISTORIES as string;

export const IPA_URL = process.env.IPA_URL as string;
export const IPA_API_KEY = process.env.IPA_API_KEY as string;
export const MP3_BUCKET = process.env.MP3_BUCKET as string;
export const PATH_PATTERN = process.env.PATH_PATTERN as string;
export const TRANSLATION_URL = process.env.TRANSLATION_URL as string;
export const TRANSLATION_API_KEY = process.env.TRANSLATION_API_KEY as string;
export const VISION_URL = process.env.VISION_URL as string;
export const VISION_API_KEY = process.env.VISION_API_KEY as string;

// 最大単語数、default 10件
export const WORDS_LIMIT = process.env.WORDS_LIMIT ? Number(process.env.WORDS_LIMIT) : 10;
