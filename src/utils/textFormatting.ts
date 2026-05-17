export interface TextSegment {
  type: 'text' | 'code'
  content: string
}

const CODE_START_SOURCE = String.raw`(?:[A-Za-z_][\w]*\s*=\s*|[A-Za-z_][\w]*\.[A-Za-z_][\w]*\(|print\(|Pipeline\(|GridSearchCV\(|cross_val_score\(|confusion_matrix\(|pd\.DataFrame\(|train_test_split\()`
const CODE_START_PATTERN = new RegExp(CODE_START_SOURCE, 'u')

const STRONG_CODE_TOKENS = [
  'LogisticRegression',
  'StandardScaler',
  'KNeighborsClassifier',
  'LinearRegression',
  'DecisionTreeClassifier',
  'RandomForestClassifier',
  'Pipeline',
  'GridSearchCV',
  'train_test_split',
  'cross_val_score',
  'confusion_matrix',
  'predict_proba',
  'fit_transform',
  'coef_',
  'pd.DataFrame',
  'sklearn',
]

const INLINE_CODE_PATTERN =
  /(`[^`]+`)|(\b(?:[A-Za-z_][\w]*\([^)\n]{0,60}\)|[A-Za-z_]+(?:_[A-Za-z0-9]+)+|[A-Za-z_]+\.[A-Za-z_][\w]*|[A-Za-z_]+\[[^\]\n]{0,24}\]|(?:cv|alpha|C|n_neighbors|test_size)\s*=\s*[^,\s.]+)\b)/gu

function insertLineBreaksAroundCode(text: string): string {
  let normalized = text.replace(/\r\n/g, '\n').replace(/\s*\n\s*/g, '\n').trim()

  normalized = normalized.replace(new RegExp(String.raw`([:?!])\s*(?=${CODE_START_SOURCE})`, 'gu'), '$1\n')
  normalized = normalized.replace(new RegExp(String.raw`(\)|\]|\})(?=${CODE_START_SOURCE})`, 'gu'), '$1\n')
  normalized = normalized.replace(new RegExp(String.raw`(,)\s*(?=${CODE_START_SOURCE})`, 'gu'), '$1\n')
  normalized = normalized.replace(/([)\]])(?=[A-Z][a-z][A-Za-z\s]{5,})/gu, '$1\n')

  return normalized
}

export function isCodeLikeLine(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed) {
    return false
  }

  if (CODE_START_PATTERN.test(trimmed)) {
    return true
  }

  if (STRONG_CODE_TOKENS.some((token) => trimmed.includes(token))) {
    return true
  }

  if (/^[A-Za-z_][\w]*(\s*,\s*[A-Za-z_][\w]*)*\s*=\s*.+$/u.test(trimmed)) {
    return true
  }

  if (/^[A-Za-z_][\w]*\.[A-Za-z_][\w]*\(.+\)$/u.test(trimmed)) {
    return true
  }

  return false
}

export function normalizeCodeSpacing(code: string): string {
  return code
    .replace(/\r\n/g, '\n')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/,\s*/g, ', ')
    .replace(/\[\s*/g, '[')
    .replace(/\s*\]/g, ']')
    .replace(/:\s*(\d)/g, ': $1')
    .replace(/\s*=\s*/g, ' = ')
    .replace(/\s{2,}/g, ' ')
    .replace(/\n /g, '\n')
    .trim()
}

export function splitPromptIntoTextAndCode(prompt: string): TextSegment[] {
  const normalized = insertLineBreaksAroundCode(prompt)
  const lines = normalized.split('\n').map((line) => line.trim()).filter(Boolean)
  const segments: TextSegment[] = []

  for (const line of lines) {
    const nextType: TextSegment['type'] = isCodeLikeLine(line) ? 'code' : 'text'
    const previousSegment = segments[segments.length - 1]

    if (previousSegment?.type === nextType) {
      previousSegment.content = `${previousSegment.content}\n${line}`.trim()
      continue
    }

    segments.push({ type: nextType, content: line })
  }

  return segments.length > 0 ? segments : [{ type: 'text', content: prompt }]
}

export function detectCodeSegments(text: string): TextSegment[] {
  return splitPromptIntoTextAndCode(text)
}

export function splitTextForInlineCode(text: string) {
  return text.split(INLINE_CODE_PATTERN)
}
