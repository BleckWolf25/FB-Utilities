// This web worker handles code minification operations off the main UI thread

// Helper functions for minifying different languages
const minifyJavaScript = (content) => {
  return content
    .replace(/\/\/.*$/gm, '') // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*([{}:;,=+\-*/&|!<>()])\s*/g, '$1') // Remove spaces around operators/punctuation
    .trim();
};

const minifyCSS = (content) => {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*([:;{}])\s*/g, '$1') // Remove spaces around operators/punctuation
    .replace(/;}|{ /g, '}') // Remove unnecessary characters
    .trim();
};

const minifyHTML = (content) => {
  let previous;
  do {
    previous = content;
    content = content.replace(/<!--[\s\S]*?-->/g, ''); // Remove HTML comments
  } while (content !== previous);
  return content
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/>\s+</g, '><') // Remove space between tags
    .trim();
};

const minifyJSON = (content) => {
  try {
    const obj = JSON.parse(content);
    return JSON.stringify(obj); // Compact JSON format
  } catch (e) {
    throw new Error(`Invalid JSON: ${e.message}`);
  }
};

const minifyXML = (content) => {
  // Simple sanitization - block common XXE patterns
  if (content.includes("<!ENTITY") || content.includes("<!DOCTYPE")) {
    throw new Error("XML with DOCTYPE or ENTITY declarations cannot be minified due to security concerns");
  }
  
  return content
    .replace(/<!--[\s\S]*?-->/g, '') // Remove XML comments
    .replace(/>\s+</g, '><') // Remove space between tags
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim();
};

const minifyPython = (content) => {
  // Split the code into lines
  const lines = content.split('\n');
  const result = [];
  
  // Process line by line
  lines.forEach(line => {
    // Remove comments and trim whitespace
    const trimmedLine = line.split('#')[0].trimEnd();
    
    // Skip empty lines
    if (trimmedLine) {
      result.push(trimmedLine);
    }
  });
  
  // Join lines back together
  return result.join('\n');
};

const minifyRuby = (content) => {
  return content
    .replace(/#.*$/gm, '') // Remove single-line comments
    .replace(/=begin[\s\S]*?=end/gm, '') // Remove multi-line comments
    .split('\n')
    .filter(line => line.trim()) // Remove empty lines
    .join('\n');
};

const minifyPHP = (content) => {
  return content
    .replace(/\/\/.*$/gm, '') // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*([{}:;,=+\-*/&|!<>()])\s*/g, '$1') // Remove spaces around operators/punctuation
    .trim();
};

const minifySQL = (content) => {
  return content
    .replace(/--.*$/gm, '') // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim();
};

const minifyMarkdown = (content) => {
  return content
    .split('\n')
    .map(line => line.trim())
    .filter((line, index, arr) => {
      // Keep headings, list items, etc. but remove consecutive blank lines
      if (!line) {
        const nextLine = arr[index + 1];
        return nextLine ? !nextLine.trim() === false : false;
      }
      return true;
    })
    .join('\n');
};

const minifyJava = (content) => {
  return content
    .replace(/\/\/.*$/gm, '') // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/^\s*\n/gm, '') // Remove empty lines
    .replace(/\s+/g, ' ') // Collapse all whitespace to a single space
    .replace(/\s*([{}:;,()=+\-*/%&|^!<>?.])\s*/g, '$1') // Remove spaces around operators & punctuation
    .replace(/;\s*}/g, '}') // Remove semicolons before closing braces
    .trim();
};

const minifyCSharp = (content) => {
  return content
    .replace(/\/\/.*$/gm, '') // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/^\s*\n/gm, '') // Remove empty lines
    .replace(/\s+/g, ' ') // Collapse all whitespace to a single space
    .replace(/\s*([{}:;,()=+\-*/%&|^!<>?.])\s*/g, '$1') // Remove spaces around operators & punctuation
    .replace(/;\s*}/g, '}') // Remove semicolons before closing braces
    .trim();
};

const minifyCpp = (content) => {
  return content
    .replace(/\/\/.*$/gm, '') // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/^\s*\n/gm, '') // Remove empty lines
    .replace(/\s+/g, ' ') // Collapse all whitespace to a single space
    .replace(/\s*([{}:;,()=+\-*/%&|^!<>?.])\s*/g, '$1') // Remove spaces around operators & punctuation
    .replace(/#include\s+/g, '#include') // Handle preprocessor directives
    .trim();
};

const minifyGo = (content) => {
  return content
    .replace(/\/\/.*$/gm, '') // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/^\s*\n/gm, '') // Remove empty lines
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*([{}:;,()=+\-*/%&|^!<>?.])\s*/g, '$1') // Remove spaces around operators & punctuation
    .trim();
};

// Main function to minify content based on language
const minifyContent = (content, fileType, fileExtension) => {
  // If the file type is not specified but extension is available, determine file type
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

  // Perform minification based on file type
  switch (fileType) {
    case 'javascript':
    case 'typescript': // TypeScript uses the same minification strategy as JavaScript
      return minifyJavaScript(content);
    case 'css':
      return minifyCSS(content);
    case 'html':
      return minifyHTML(content);
    case 'json':
      return minifyJSON(content);
    case 'xml':
      return minifyXML(content);
    case 'python':
      return minifyPython(content);
    case 'ruby':
      return minifyRuby(content);
    case 'php':
      return minifyPHP(content);
    case 'sql':
      return minifySQL(content);
    case 'markdown':
      return minifyMarkdown(content);
    case 'java':
      return minifyJava(content);
    case 'csharp':
      return minifyCSharp(content);
    case 'cpp':
      return minifyCpp(content);
    case 'go':
      return minifyGo(content);
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
    
    // Minify the content
    const minified = minifyContent(content, fileType, fileExtension);
    
    // Calculate minified size
    const minifiedSize = new Blob([minified]).size;
    
    // Calculate statistics
    const reduction = originalSize - minifiedSize;
    const percentage = originalSize > 0 
      ? ((reduction / originalSize) * 100).toFixed(2) 
      : 0;
    
    // Send result back to main thread
    self.postMessage({
      success: true,
      minifiedCode: minified,
      stats: {
        originalSize: (originalSize / 1024).toFixed(2),
        minifiedSize: (minifiedSize / 1024).toFixed(2),
        reduction: (reduction / 1024).toFixed(2),
        percentage
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