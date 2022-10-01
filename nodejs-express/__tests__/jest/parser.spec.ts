import { describe, expect, test } from '@jest/globals'
import { parseDiffCollection } from '../../src/diff-git-impl'
import { DiffChunkType } from '../../src/types'
import { historyOfOneFile, historyOfSomeFiles } from '../mock/history'

const collectionOfOneFile = parseDiffCollection(historyOfOneFile)
const collectionOfSomeFiles = parseDiffCollection(historyOfSomeFiles)

describe('Test collection parse', () => {
  test('Should return length of history files', () => {
    expect(collectionOfOneFile.chunks.length).toBe(1)
    expect(collectionOfSomeFiles.chunks.length).toBe(4)
  })
  test('Should parse first chunk of diff', () => {
    const [file] = collectionOfOneFile.chunks
    expect(file.type).toBe(DiffChunkType.RENAMED)
    expect(file.oldPath).toBe('builtin-http-fetch.c')
    expect(file.newPath).toBe('builtin-http-fetch.c')
  })
})
