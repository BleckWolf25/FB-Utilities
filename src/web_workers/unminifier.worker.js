// This web worker handles code beautification operations off the main UI thread

// Helper functions for formatting different languages
const formatJavaScript = (content) => {
  // Basic JavaScript formatting
  let result = '';
  
  // Track indentation level
  let indentLevel = 0;
  const indentChar = '  '; // 2 spaces
  
  // Track if we're inside a string
  let inString = false;
  let stringChar = '';
  
  // Track if we're inside a comment
  let inSingleLineComment = false;
  let inMultiLineComment = false;
  
  // Track if we need to add a newline
  let needNewline = false;
  
  // Track if the last character was a space
  let lastWasSpace = false;
  
  // Add opening braces ({) indentation
  content = content.replace(/\{/g, ' {\n');
  
  // Add closing braces (}) indentation
  content = content.replace(/\}/g, '\n}');
  
  // Add semicolon (;) indentation
  content = content.replace(/;/g, ';\n');
  
  // Split by characters to process
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1] || '';
    
    // Handle strings
    if ((char === '"' || char === "'" || char === '`') && 
        (i === 0 || content[i - 1] !== '\\')) {
      if (inString && char === stringChar) {
        // End of string
        inString = false;
        result += char;
        continue;
      } else if (!inString) {
        // Start of string
        inString = true;
        stringChar = char;
        result += char;
        continue;
      }
    }
    
    if (inString) {
      // Inside string, just add the character
      result += char;
      continue;
    }
    
    // Handle comments
    if (!inSingleLineComment && !inMultiLineComment && char === '/' && nextChar === '/') {
      inSingleLineComment = true;
      result += char;
      continue;
    }
    
    if (inSingleLineComment && char === '\n') {
      inSingleLineComment = false;
      result += char;
      continue;
    }
    
    if (!inSingleLineComment && !inMultiLineComment && char === '/' && nextChar === '*') {
      inMultiLineComment = true;
      result += char;
      continue;
    }
    
    if (inMultiLineComment && char === '*' && nextChar === '/') {
      inMultiLineComment = false;
      result += char;
      continue;
    }
    
    if (inSingleLineComment || inMultiLineComment) {
      // Inside comment, just add the character
      result += char;
      continue;
    }
    
    // Handle indentation for braces
    if (char === '{') {
      indentLevel++;
      result += char + '\n' + indentChar.repeat(indentLevel);
      continue;
    }
    
    if (char === '}') {
      indentLevel = Math.max(0, indentLevel - 1);
      result = result.trimEnd() + '\n' + indentChar.repeat(indentLevel) + char;
      continue;
    }
    
    // Handle semicolons
    if (char === ';') {
      result += char + '\n' + indentChar.repeat(indentLevel);
      continue;
    }
    
    // Handle newlines
    if (char === '\n') {
      result += '\n' + indentChar.repeat(indentLevel);
      lastWasSpace = true;
      continue;
    }
    
    // Skip multiple spaces
    if (char === ' ' && lastWasSpace) {
      continue;
    }
    
    lastWasSpace = char === ' ';
    result += char;
  }
  
  // Clean up by replacing multiple empty lines with a single empty line
  result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  return result;
};

const formatCSS = (content) => {
  let result = '';
  let indentLevel = 0;
  const indentChar = '  '; // 2 spaces
  
  // Add newline after opening bracket
  content = content.replace(/\{/g, ' {\n');
  
  // Add newline before closing bracket
  content = content.replace(/\}/g, '\n}');
  
  // Add newline after semicolon
  content = content.replace(/;/g, ';\n');
  
  // Process line by line
  const lines = content.split('\n');
  
  for (let line of lines) {
    line = line.trim();
    
    if (!line) continue;
    
    // Decrease indent for closing bracket
    if (line.includes('}')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    // Add indentation
    if (line.length > 0) {
      result += indentChar.repeat(indentLevel) + line + '\n';
    }
    
    // Increase indent for opening bracket
    if (line.includes('{')) {
      indentLevel++;
    }
  }
  
  return result;
};

const formatHTML = (content) => {
  let result = '';
  let indentLevel = 0;
  const indentChar = '  '; // 2 spaces
  
  // Track if we're inside a tag
  let inTag = false;
  let inAttribute = false;
  let attributeChar = '';
  let inComment = false;
  let inDoctype = false;
  
  // Function to add a tag with proper indentation
  const addLine = (text) => {
    if (text.trim()) {
      result += indentChar.repeat(indentLevel) + text + '\n';
    }
  };
  
  // First, replace all self-closing tags with a placeholder
  content = content.replace(/<([^>]*?)\/>/g, '<$1SELF_CLOSING>');
  
  // Replace some common break tags
  content = content.replace(/<br>/g, '<br>\n');
  content = content.replace(/<hr>/g, '<hr>\n');
  
  // Add newlines after opening tags
  content = content.replace(/(<[^\/][^>]*>)(?!\s*$)/g, '$1\n');
  
  // Add newlines before closing tags
  content = content.replace(/(<\/[^>]+>)/g, '\n$1');
  
  // Process line by line
  const lines = content.split('\n');
  
  for (let line of lines) {
    line = line.trim();
    
    if (!line) continue;
    
    // Check if line contains a closing tag
    if (line.match(/<\/[^>]+>/)) {
      // Decrease indent for closing tag
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    // Add the line with proper indentation
    addLine(line);
    
    // Check if line contains an opening tag but not a closing tag in the same line
    const hasOpeningTag = line.match(/<[^\/][^>]*>/);
    const hasClosingTag = line.match(/<\/[^>]+>/);
    const isSelfClosing = line.includes('SELF_CLOSING');
    
    if (hasOpeningTag && !hasClosingTag && !isSelfClosing) {
      // Increase indent for next line
      indentLevel++;
    }
  }
  
  // Replace our self-closing tag placeholder
  result = result.replace(/SELF_CLOSING>/g, '/>');
  
  return result;
};

const formatJSON = (content) => {
  try {
    const obj = JSON.parse(content);
    return JSON.stringify(obj, null, 2); // 2 space indentation
  } catch (e) {
    throw new Error(`Invalid JSON: ${e.message}`);
  }
};

const formatXML = (content) => {
  let result = '';
  let indentLevel = 0;
  const indentChar = '  '; // 2 spaces
  
  // Function to add a tag with proper indentation
  const addLine = (text) => {
    if (text.trim()) {
      result += indentChar.repeat(indentLevel) + text + '\n';
    }
  };
  
  // First, replace all self-closing tags with a placeholder
  content = content.replace(/<([^>]*?)\/>/g, '<$1SELF_CLOSING>');
  
  // Add newlines after opening tags
  content = content.replace(/(<[^\/][^>]*>)(?!\s*$)/g, '$1\n');
  
  // Add newlines before closing tags
  content = content.replace(/(<\/[^>]+>)/g, '\n$1');
  
  // Process line by line
  const lines = content.split('\n');
  
  for (let line of lines) {
    line = line.trim();
    
    if (!line) continue;
    
    // Check if line contains a closing tag
    if (line.match(/<\/[^>]+>/)) {
      // Decrease indent for closing tag
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    // Add the line with proper indentation
    addLine(line);
    
    // Check if line contains an opening tag but not a closing tag in the same line
    const hasOpeningTag = line.match(/<[^\/][^>]*>/);
    const hasClosingTag = line.match(/<\/[^>]+>/);
    const isSelfClosing = line.includes('SELF_CLOSING');
    
    if (hasOpeningTag && !hasClosingTag && !isSelfClosing) {
      // Increase indent for next line
      indentLevel++;
    }
  }
  
  // Replace our self-closing tag placeholder
  result = result.replace(/SELF_CLOSING>/g, '/>');
  
  return result;
};

const formatPython = (content) => {
  // Python formatting is simpler as it relies on indentation already
  // This is a basic formatter that handles indentation for blocks
  
  const lines = content.split('\n');
  let result = [];
  
  // Track indentation level
  let indentLevel = 0;
  const indentChar = '    '; // 4 spaces - Python standard
  
  // Process line by line
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    if (!line) {
      result.push('');
      continue;
    }
    
    // Check if this line ends with a colon (start of a new block)
    if (line.endsWith(':')) {
      result.push(indentChar.repeat(indentLevel) + line);
      indentLevel++;
      continue;
    }
    
    // Check if next line has less indentation (end of a block)
    if (i < lines.length - 1) {
      const currentIndent = (lines[i].match(/^\s*/) || [''])[0].length;
      const nextIndent = (lines[i + 1].match(/^\s*/) || [''])[0].length;
      
      if (nextIndent < currentIndent && lines[i + 1].trim()) {
        // End of a block, reduce indent
        indentLevel = Math.max(0, indentLevel - 1);
      }
    }
    
    result.push(indentChar.repeat(indentLevel) + line);
  }
  
  return result.join('\n');
};

const formatRuby = (content) => {
  // Ruby formatting - similar to Python but with different block markers
  const lines = content.split('\n');
  let result = [];
  
  // Track indentation level
  let indentLevel = 0;
  const indentChar = '  '; // 2 spaces - Ruby standard
  
  // Process line by line
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    if (!line) {
      result.push('');
      continue;
    }
    
    // Check for block start markers
    if (line.match(/\bdo\b|\bclass\b|\bdef\b|\bmodule\b|\bif\b|\bunless\b|\bcase\b|\bwhile\b|\buntil\b|\bfor\b|\bbegin\b/)) {
      result.push(indentChar.repeat(indentLevel) + line);
      indentLevel++;
      continue;
    }
    
    // Check for block end markers
    if (line.match(/\bend\b/)) {
      indentLevel = Math.max(0, indentLevel - 1);
      result.push(indentChar.repeat(indentLevel) + line);
      continue;
    }
    
    result.push(indentChar.repeat(indentLevel) + line);
  }
  
  return result.join('\n');
};

const formatPHP = (content) => {
  // PHP formatting - similar to JavaScript
  return formatJavaScript(content);
};

const formatSQL = (content) => {
  // Basic SQL formatter
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER',
    'GROUP', 'ORDER', 'HAVING', 'LIMIT', 'INSERT', 'UPDATE', 'DELETE',
    'CREATE', 'ALTER', 'DROP', 'TABLE', 'VIEW', 'FUNCTION', 'PROCEDURE'
  ];
  
  // First normalize whitespace
  content = content.replace(/\s+/g, ' ').trim();
  
  // Add newlines after specific keywords
  for (const keyword of keywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    content = content.replace(regex, `\n${keyword}`);
  }
  
  // Add newline after commas in SELECT clause
  content = content.replace(/,\s*(?=\w)/g, ',\n  ');
  
  // Add indentation for JOIN clauses
  content = content.replace(/\n((?:LEFT|RIGHT|INNER|OUTER)?\s*JOIN\b)/gi, '\n  $1');
  
  // Add indentation for WHERE conditions
  content = content.replace(/\n(WHERE\b)/gi, '\n$1');
  content = content.replace(/\bAND\b/gi, '\n  AND');
  content = content.replace(/\bOR\b/gi, '\n  OR');
  
  // Format GROUP BY
  content = content.replace(/\n(GROUP BY\b)/gi, '\n$1');
  content = content.replace(/\n(ORDER BY\b)/gi, '\n$1');
  content = content.replace(/\n(HAVING\b)/gi, '\n$1');
  
  return content;
};

const formatMarkdown = (content) => {
  // Markdown formatting - add consistent line breaks between sections
  return content
    .replace(/\n{3,}/g, '\n\n') // Normalize multiple blank lines to just two
    .replace(/^(#{1,6})\s*/gm, '$1 ') // Ensure space after heading markers
    .replace(/\*\*\s*(\S.*?\S)\s*\*\*/g, '**$1**') // Clean spaces around bold text
    .replace(/\*\s*(\S.*?\S)\s*\*/g, '*$1*') // Clean spaces around italic text
    .replace(/~~\s*(\S.*?\S)\s*~~/g, '~~$1~~') // Clean spaces around strikethrough text
    .replace(/^\s*[-*+]\s*/gm, '* ') // Standardize list markers
    .replace(/^\s*(\d+)\.\s*/gm, '$1. ') // Standardize ordered list markers
    .trim();
};

const formatJava = (content) => {
  // Java formatting - similar to JavaScript
  return formatJavaScript(content);
};

const formatCSharp = (content) => {
  // C# formatting - similar to JavaScript
  return formatJavaScript(content);
};

const formatCpp = (content) => {
  // C++ formatting - similar to JavaScript
  return formatJavaScript(content);
};

const formatGo = (content) => {
  // Go formatting - similar to JavaScript but with some differences
  // For a simple beautifier, we can use the JavaScript one
  return formatJavaScript(content);
};

// Main function to format content based on file type
const formatContent = (content, fileType, fileExtension) => {
  // If fileType is not provided, try to determine it from the extension
  if (!fileType && fileExtension) {
    if (['js', 'jsx', 'mjs'].includes(fileExtension)) {
      fileType = 'javascript';
    } else if (['ts', 'tsx'].includes(fileExtension)) {
      fileType = 'typescript';
    } else if (['css', 'scss', 'less'].includes(fileExtension)) {
      fileType = 'css';
    } else if (['html', 'htm', 'xhtml'].includes(fileExtension)) {
      fileType = 'html';
    } else if (['json'].includes(fileExtension)) {
      fileType = 'json';
    } else if (['xml', 'svg'].includes(fileExtension)) {
      fileType = 'xml';
    } else if (['py', 'pyw'].includes(fileExtension)) {
      fileType = 'python';
    } else if (['rb', 'rake'].includes(fileExtension)) {
      fileType = 'ruby';
    } else if (['php', 'phtml', 'php5'].includes(fileExtension)) {
      fileType = 'php';
    } else if (['sql'].includes(fileExtension)) {
      fileType = 'sql';
    } else if (['md', 'markdown'].includes(fileExtension)) {
      fileType = 'markdown';
    } else if (['java'].includes(fileExtension)) {
      fileType = 'java';
    } else if (['cs'].includes(fileExtension)) {
      fileType = 'csharp';
    } else if (['cpp', 'cc', 'cxx', 'h', 'hpp'].includes(fileExtension)) {
      fileType = 'cpp';
    } else if (['go'].includes(fileExtension)) {
      fileType = 'go';
    }
  }

  // Perform formatting based on file type
  switch (fileType) {
    case 'javascript':
    case 'typescript': // TypeScript uses the same formatting strategy as JavaScript
      return formatJavaScript(content);
    case 'css':
      return formatCSS(content);
    case 'html':
      return formatHTML(content);
    case 'json':
      return formatJSON(content);
    case 'xml':
      return formatXML(content);
    case 'python':
      return formatPython(content);
    case 'ruby':
      return formatRuby(content);
    case 'php':
      return formatPHP(content);
    case 'sql':
      return formatSQL(content);
    case 'markdown':
      return formatMarkdown(content);
    case 'java':
      return formatJava(content);
    case 'csharp':
      return formatCSharp(content);
    case 'cpp':
      return formatCpp(content);
    case 'go':
      return formatGo(content);
    default:
      return content; // Return original content if type is unknown
  }
};

// Web Worker message handler
self.addEventListener('message', (event) => {
  const { content, fileType, fileExtension } = event.data;
  
  try {
    // Calculate original size
    const originalSize = new Blob([content]).size;
    
    const startTime = performance.now();
    // Format the content
    const formatted = formatContent(content, fileType, fileExtension);
    const endTime = performance.now();
    
    // Calculate formatted size
    const formattedSize = new Blob([formatted]).size;
    
    // Calculate statistics
    const difference = formattedSize - originalSize;
    const percentage = originalSize > 0 
      ? ((difference / originalSize) * 100).toFixed(2) 
      : 0;
    
    // Send result back to main thread
    self.postMessage({
      success: true,
      formattedCode: formatted,
      stats: {
        originalSize: (originalSize / 1024).toFixed(2),
        formattedSize: (formattedSize / 1024).toFixed(2),
        difference: (difference / 1024).toFixed(2),
        percentage,
        timeTaken: Math.round(endTime - startTime)
      }
    });
  } catch (error) {
    // Send error back to main thread
    self.postMessage({
      success: false,
      error: error.message
    });
  }
});