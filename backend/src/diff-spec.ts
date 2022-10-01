export enum DiffChunkType {
  ADDED = 'added',
  RENAMED = 'renamed',
  CHANGED = 'changed',
  DELETED = 'deleted',
}

export enum DiffLineType {
  ADDED = 'added',
  DELETED = 'deleted',
  NORMAL = 'normal',
}

export interface DiffCollection {
  chunks: DiffChunk[]
}

export interface DiffChunk {
  type?: DiffChunkType
  oldPath?: string
  newPath?: string
  blocks: DiffBlock[]
}

export interface DiffBlock {
  block: string
  lines: DiffLine[]
  oldLines: number
  newLines: number
}

export interface DiffLine {
  line: string
  readonly type?: DiffLineType
}
