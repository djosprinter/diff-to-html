import {
  DiffBlock,
  DiffChunk,
  DiffCollection,
  DiffLine,
  DiffLineType,
} from './diff-spec'

export function renderHtml(collection: DiffCollection): string {
    let chunksHtml = ''
    collection.chunks.forEach(chunk => {
      chunksHtml += generateChunkHtml(chunk)
    })
    return (
      '<div class="d2h-file-list-wrapper">' +
        '<div class="d2h-file-list-header">' +
          '<span class="d2h-file-list-title">Files changed ('+ collection.chunks.length +')</span>' +
        '</div>' +
      '</div>' +
      '<div class="d2h-wrapper">' +
      chunksHtml +
      '</div>'
    )
}

function generateChunkHtml(item: DiffChunk): string {
  let blocksHtml = ''
  item.blocks.forEach(item => {
    blocksHtml += generateBlockHtml(item)
  })
  return (
    '<div class="d2h-file-wrapper">' +
      '<div class="d2h-file-header">' +
        '<span class="d2h-file-name-wrapper">' +
          '<svg aria-hidden="true" class="d2h-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12">' +
            '<path d="M6 5H2v-1h4v1zM2 8h7v-1H2v1z m0 2h7v-1H2v1z m0 2h7v-1H2v1z m10-7.5v9.5c0 0.55-0.45 1-1 ' +
            '1H1c-0.55 0-1-0.45-1-1V2c0-0.55 0.45-1 1-1h7.5l3.5 3.5z m-1 0.5L8 2H1v12h10V5z"></path>' +
          '</svg>' +
          '<span class="d2h-file-name">new.txt</span>' +
        '<span class="d2h-tag d2h-'+item.type+' d2h-'+item.type+'-tag">'+ item.type?.toUpperCase() +'</span></span>' +
      '</div>' +
      '<div class="d2h-file-diff">' +
      '<div class="d2h-code-wrapper">' +
        '<table class="d2h-diff-table">' +
          '<tbody class="d2h-diff-tbody">' +
            blocksHtml +
          '</tbody>' +
        '</table>'+
      '</div>' +
      '</div>' +
    '</div>'
  )
}

function generateBlockHtml(item: DiffBlock): string {
  let linesHtml = ''
  let lineNum1 = item.oldLines
  let lineNum2 = item.newLines
  
  item.lines.forEach(line => {
    let lineNum1Value = ''
    let lineNum2Value = ''
    
    switch (line.type) {
      case DiffLineType.DELETED:
        lineNum1Value = `${lineNum1}`
        break
      case DiffLineType.ADDED:
        lineNum2Value = `${lineNum2}`
        lineNum2++
        break
      case DiffLineType.NORMAL:
        lineNum1++
        lineNum1Value = `${lineNum1}`
        lineNum2Value = `${lineNum2}`
        lineNum2++
        break
    }
    linesHtml += generateLineHtml(line, lineNum1Value, lineNum2Value)
  })
  return (
    '<tr>' +
      '<td class="d2h-code-linenumber d2h-info"></td>' +
      '<td class="d2h-info">' +
        '<div class="d2h-code-line">'+ item.block +'</div>' +
      '</td>' +
      '</tr>' +
      linesHtml
  )
}

function generateLineHtml(line: DiffLine, num1: string, num2: string): string {
  const rowClassName = getRowClassName(line.type)
  return (
    '<tr>' +
      '<td class="d2h-code-linenumber '+ rowClassName +'">' +
        '<div class="line-num1">'+ num1 +'</div>' +
        '<div class="line-num2">'+ num2 +'</div>' +
      '</td>' +
      '<td class="'+ rowClassName +'">' +
        '<div class="d2h-code-line">' +
          '<span class="d2h-code-line-ctn">'+ line.line +'</span>' +
        '</div>' +
      '</td>' +
    '</tr>'
  )
}

function getRowClassName(type: DiffLineType | undefined): string {
  if (type === DiffLineType.ADDED) return 'd2h-ins'
  if (type === DiffLineType.DELETED) return 'd2h-del'
  return 'd2h-cntx'
}

