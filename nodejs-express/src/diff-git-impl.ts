import { DiffBlock, DiffChunk, DiffCollection, DiffLine } from './diff-spec'
import { DiffChunkType, DiffLineType } from './types'

export function parseDiffCollection(source: string): DiffCollection {
  return new DiffGitCollection(source)
}

const diffLineTypeMap  = new Map<string, DiffLineType>([
  ['+', DiffLineType.ADDED],
  ['-', DiffLineType.DELETED],
  [' ', DiffLineType.NORMAL],
])

export class DiffGitCollection implements DiffCollection {
  source: string
  chunks: DiffChunk[] = []

  readonly DIFF_CHUNKS_SEPARATOR = 'diff --git'

  constructor(source: string) {
    this.source = source
    this.parse()
  }

  parse(): void {
    const items = this.source.split(this.DIFF_CHUNKS_SEPARATOR)
    items.shift()
    items.forEach((item: string) => this.chunks.push(new DiffGitChunk(item)))
  }
}

export class DiffGitChunk implements DiffChunk {
  type?: DiffChunkType
  oldPath?: string
  newPath?: string
  blocks: DiffGitBlock[] = []

  readonly DIFF_RENAME_SPEC = 'rename'
  readonly DIFF_SPACE_SPEC = ' '
  readonly DIFF_OLD_FILE_NAME_SPEC = '---'
  readonly DIFF_NOTHING_SPEC = '/dev/null'
  readonly DIFF_HUNK_HEADER_SPEC = '@@'

  constructor(chunk: string) {
    this.parse(chunk)
  }

  parse(chunk: string): void {
    const lines = chunk.split('\n')
    let currentBlock: DiffGitBlock | null = null

    lines.forEach((line, i) => {
      const spaceIndex = line.indexOf(this.DIFF_SPACE_SPEC)
      const infoType = spaceIndex > -1 ? line.slice(0, spaceIndex) : ''
    
      switch (infoType) {
        case this.DIFF_RENAME_SPEC:
          this.type = DiffChunkType.RENAMED
          const infoStr = line.slice(spaceIndex + 1)
          if (infoStr.indexOf('from') === 0) {
            this.oldPath = infoStr.slice(5)
          } else {
            this.newPath = infoStr.slice(3)
          }
          break
        case this.DIFF_OLD_FILE_NAME_SPEC:
          let oldPath = line.slice(spaceIndex + 1)
          let newPath = lines[++i].slice(4)
          if (oldPath === this.DIFF_NOTHING_SPEC) {
            this.type = DiffChunkType.ADDED
            newPath = newPath.slice(2)
          } else if (newPath === this.DIFF_NOTHING_SPEC) {
            this.type = DiffChunkType.DELETED
            oldPath = oldPath.slice(2)
          } else {
            oldPath = oldPath.slice(2)
            newPath = newPath.slice(2)
          }
          if (oldPath === newPath) {
            this.type = DiffChunkType.CHANGED
          }
          this.oldPath = oldPath
          this.newPath = newPath
          break
      }

      if (line.indexOf(this.DIFF_HUNK_HEADER_SPEC) === 0) {
        currentBlock = new DiffGitBlock(line)
        this.blocks.push(currentBlock)
      }
      if (currentBlock && (line.startsWith('+') || line.startsWith('-') || line.startsWith(' '))) {
        currentBlock.lines.push(new DiffGitLine(line))
      }
    })
  }
}

export class DiffGitBlock implements DiffBlock {
  block: string
  lines: DiffGitLine[] = []
  oldLines = 0
  newLines = 0

  readonly fragmentMatch = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@.*/

  constructor(block: string) {
    this.block = block
    this.parse(block)
  }

  parse(block: string): void {
    const match = this.fragmentMatch.exec(block)
    if (match) {
      this.oldLines = Number(match[1])
      this.newLines = Number(match[2])
    }
  }
}

export class DiffGitLine implements DiffLine {
  line: string

  constructor(line: string) {
    this.line = line
  }

  get type(): DiffLineType | undefined {
    const typeChar = this.line.slice(0, 1)
    return diffLineTypeMap.get(typeChar)
  }
}