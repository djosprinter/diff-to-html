import { DiffChunkType, DiffLineType } from './types'

export interface DiffCollection {
  chunks: DiffChunk[]
  parse(): void
}

export interface DiffChunk {
  type?: DiffChunkType
  oldPath?: string
  newPath?: string
  blocks: DiffBlock[]
  parse(chunk: string): void
}

export interface DiffBlock {
  block: string
  lines: DiffLine[]
  oldLines: number
  newLines: number
  parse(block: string): void
}

export interface DiffLine {
  line: string
  readonly type?: DiffLineType
}