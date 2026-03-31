export { commonmark } from '@milkdown/preset-commonmark'
export { gfm } from '@milkdown/preset-gfm'
export { history } from '@milkdown/plugin-history'
export { listener } from '@milkdown/plugin-listener'
export { 
  createCodeLanguageCompletionPlugin, 
  codeLanguageCompletionKey,
  type CodeLanguageCompletionOptions 
} from './codeLanguageCompletion'
export { CodeLanguageMenu } from './codeLanguageCompletion'
export { supportedLanguages, filterLanguages } from './codeLanguageCompletion'