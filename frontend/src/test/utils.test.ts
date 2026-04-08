import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { validateName } from '../components/TreeView/utils'

describe('validateName', () => {
  it('should return null for valid name', () => {
    expect(validateName('Valid Name')).toBeNull()
    expect(validateName('测试笔记本')).toBeNull()
    expect(validateName('Note 123')).toBeNull()
  })

  it('should return error for empty name', () => {
    expect(validateName('')).toBe('名称不能为空')
    expect(validateName('   ')).toBe('名称不能为空')
  })

  it('should return error for name exceeding 100 chars', () => {
    const longName = 'a'.repeat(101)
    expect(validateName(longName)).toBe('名称不能超过 100 个字符')
  })

  it('should return error for invalid characters', () => {
    expect(validateName('name<test')).toBe('名称不能包含特殊字符: < > : " / \\ | ? *')
    expect(validateName('name>test')).toBe('名称不能包含特殊字符: < > : " / \\ | ? *')
    expect(validateName('name:test')).toBe('名称不能包含特殊字符: < > : " / \\ | ? *')
    expect(validateName('name"test')).toBe('名称不能包含特殊字符: < > : " / \\ | ? *')
    expect(validateName('name/test')).toBe('名称不能包含特殊字符: < > : " / \\ | ? *')
    expect(validateName('name\\test')).toBe('名称不能包含特殊字符: < > : " / \\ | ? *')
    expect(validateName('name|test')).toBe('名称不能包含特殊字符: < > : " / \\ | ? *')
    expect(validateName('name?test')).toBe('名称不能包含特殊字符: < > : " / \\ | ? *')
    expect(validateName('name*test')).toBe('名称不能包含特殊字符: < > : " / \\ | ? *')
  })
})