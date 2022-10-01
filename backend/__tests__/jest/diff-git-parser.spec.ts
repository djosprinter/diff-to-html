import { describe, expect, test } from '@jest/globals'
import { parseDiffCollection } from '../../src/diff-git-impl'
import { DiffChunkType, DiffLineType } from '../../src/diff-spec'
import { historyOfOneChunk, historyOfSomeChunk } from '../mock/history'

const collectionOfOneChunk = parseDiffCollection(historyOfOneChunk)
const collectionOfSomeChunks = parseDiffCollection(historyOfSomeChunk)

describe('Test collection parse', () => {
  test('Should return length of diff chunks', () => {
    expect(collectionOfOneChunk.chunks.length).toBe(1)
    expect(collectionOfSomeChunks.chunks.length).toBe(4)
  })
  test('Should parse chunk of diff with one chunk', () => {
    const [chunk] = collectionOfOneChunk.chunks
    expect(chunk.type).toBe(DiffChunkType.RENAMED)
    expect(chunk.oldPath).toEqual('builtin-http-fetch.c')
    expect(chunk.newPath).toBe('http-fetch.c')
    expect(chunk.blocks.length).toBe(2)
    
    const [block1, block2] = chunk.blocks
    expect(block1.block).toEqual('@@ -1,8 +1,9 @@')
    expect(block1.oldLines).toBe(1)
    expect(block1.newLines).toBe(1)

    expect(block2.block).toEqual('@@ -18,6 +19,8 @@')
    expect(block2.oldLines).toBe(18)
    expect(block2.newLines).toBe(19)

    const [line1, line2, _, line4] = block1.lines
    expect(block1.lines.length).toBe(6)
    expect(line1.line).toEqual('-int cmd_http_fetch(int argc, const char **argv, const char *prefix)')
    expect(line1.type).toEqual(DiffLineType.DELETED)
    expect(line2.type).toEqual(DiffLineType.ADDED)
    expect(line4.type).toEqual(DiffLineType.NORMAL)
  })
  test('Should parse chunk of diff with many chunks', () => {
    const [chunk1, chunk2, chunk3] = collectionOfSomeChunks.chunks
    expect(chunk1.type).toBe(DiffChunkType.DELETED)
    expect(chunk1.oldPath).toEqual('new.txt')
    expect(chunk1.newPath).toEqual('/dev/null')
    expect(chunk1.blocks.length).toBe(1)

    expect(chunk2.type).toBe(DiffChunkType.CHANGED)
    expect(chunk2.oldPath).toEqual('new2.txt')
    expect(chunk2.newPath).toEqual('new2.txt')
    expect(chunk2.blocks.length).toBe(1)

    expect(chunk3.type).toBe(DiffChunkType.ADDED)
    expect(chunk3.oldPath).toEqual('/dev/null')
    expect(chunk3.newPath).toEqual('new3.txt')
    expect(chunk3.blocks.length).toBe(1)
  })
})
