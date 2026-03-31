import { refractor } from 'refractor'

export interface LanguageEntry {
  name: string
  aliases: string[]
}

const languageAliases: Record<string, string[]> = {
  javascript: ['js', 'jsx', 'node'],
  typescript: ['ts', 'tsx'],
  python: ['py'],
  ruby: ['rb'],
  go: ['golang'],
  java: [],
  cpp: ['c++', 'cc', 'cxx'],
  csharp: ['cs', 'c#'],
  php: [],
  rust: ['rs'],
  swift: [],
  kotlin: ['kt', 'kts'],
  scala: [],
  html: ['markup'],
  css: [],
  scss: ['sass'],
  less: [],
  json: [],
  yaml: ['yml'],
  xml: [],
  markdown: ['md'],
  sql: [],
  bash: ['sh', 'shell', 'zsh'],
  powershell: ['ps1', 'pwsh'],
  docker: ['dockerfile'],
  graphql: ['gql'],
  regex: [],
  diff: ['patch'],
}

function buildLanguageList(): LanguageEntry[] {
  const allLanguages = refractor.listLanguages()
  const result: LanguageEntry[] = []

  for (const lang of allLanguages) {
    result.push({
      name: lang,
      aliases: languageAliases[lang] || [],
    })
  }

  return result.sort((a, b) => a.name.localeCompare(b.name))
}

export const supportedLanguages = buildLanguageList()

export const defaultLanguages = [
  'javascript', 'typescript', 'python', 'java', 'go',
  'rust', 'html', 'css', 'json', 'yaml', 'bash', 'sql',
].sort()

export function filterLanguages(query: string): LanguageEntry[] {
  if (!query) return supportedLanguages

  const lowerQuery = query.toLowerCase()
  return supportedLanguages.filter(
    lang =>
      lang.name.toLowerCase().includes(lowerQuery) ||
      lang.aliases.some(alias => alias.toLowerCase().includes(lowerQuery))
  )
}