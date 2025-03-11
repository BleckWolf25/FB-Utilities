// Importar Tesseract.js no início do arquivo
importScripts('https://unpkg.com/tesseract.js@v2.1.1/dist/tesseract.min.js');
importScripts('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js');

// Variável global para armazenar a instância do worker Tesseract
let tesseractWorker = null;

// Inicializar o worker do Tesseract
async function initTesseractWorker() {
  if (!tesseractWorker) {
    tesseractWorker = await Tesseract.createWorker();
    await tesseractWorker.loadLanguage('por');  // Carrega o modelo português
    await tesseractWorker.initialize('por');    // Inicializa com português
    await tesseractWorker.setParameters({
      tessedit_pageseg_mode: Tesseract.PSM.AUTO,
      tessedit_ocr_engine_mode: Tesseract.OEM.LSTM_ONLY,
    });
  }
  return tesseractWorker;
}

// Web Worker for document conversions
// This worker handles PDF to HTML and PDF to Markdown conversions

// Define a bundled PDF parser instead of using importScripts which can cause security issues
const createPdfjsBundle = () => {
  console.log('Creating enhanced PDF.js implementation');
  
  return {
    // Core PDF document handling functionality
    getDocument: function(options) {
      return {
        promise: new Promise((resolve, reject) => {
          console.log('Processing PDF file with enhanced implementation');
          
          try {
            // Extract first few bytes to check if this looks like a PDF
            const uint8Array = new Uint8Array(options.data);
            const isPdf = uint8Array[0] === 37 && // %
                         uint8Array[1] === 80 && // P
                         uint8Array[2] === 68 && // D
                         uint8Array[3] === 70 && // F
                         uint8Array[4] === 45; // -
                         
            if (!isPdf) {
              throw new Error('The provided file does not appear to be a PDF');
            }
            
            // Parse the PDF and extract real content
            // Convert binary data to string for processing - handle very large PDFs
            let pdfString;
            try {
              pdfString = new TextDecoder().decode(options.data);
            } catch (e) {
              console.error("Error decoding PDF data:", e);
              
              // Try chunked decoding for very large PDFs
              const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB chunks
              let result = '';
              for (let i = 0; i < options.data.byteLength; i += CHUNK_SIZE) {
                const chunk = options.data.slice(i, Math.min(i + CHUNK_SIZE, options.data.byteLength));
                result += new TextDecoder().decode(chunk);
              }
              pdfString = result;
            }
            
            // Identify PDF objects that might contain text
            const textObjects = [];
            const pages = [];
            let pageCount = 0;
            
            // Track if this is likely a scanned PDF
            let hasImages = false;
            let hasText = false;
            
            // Enhanced text extraction with better handling of various PDF formats
            const extractTextFromPDF = () => {
              // Check for image objects which might indicate a scanned document
              const detectImages = () => {
                const imagePatterns = [
                  /\/Image\s/g,          // Image resource indicator
                  /\/XObject\s*<<[^>]*?\/Subtype\s*\/Image/g,  // Image XObject
                  /\/DCTDecode/g,        // JPEG compression
                  /\/FlateDecode/g,      // Common in image streams
                  /\/Width\s+\d+\s+\/Height\s+\d+/g  // Image dimensions
                ];
                
                // If we find multiple image indicators but little text, it's likely a scanned document
                for (const pattern of imagePatterns) {
                  const matches = pdfString.match(pattern);
                  if (matches && matches.length > 0) {
                    hasImages = true;
                    console.log(`Detected ${matches.length} image indicators in the PDF`);
                    break;
                  }
                }
              };
              
              // APPROACH 1: Look for text objects with BT/ET markers
              const findTextContent = (str) => {
                // Extract text between BT (begin text) and ET (end text)
                const btRegex = /BT([\s\S]*?)ET/g;
                let match;
                let texts = [];
                let textFound = false;
                
                while ((match = btRegex.exec(str)) !== null) {
                  // Extract text strings (typically in parentheses)
                  const textContentRegex = /\((.*?)(?<!\\)\)/g; 
                  const textPart = match[1];
                  let textMatch;
                  
                  // Also look for hex strings in format <hex values>
                  const hexTextRegex = /<([0-9A-Fa-f]+)>/g;
                  
                  // Process parentheses-enclosed strings
                  while ((textMatch = textContentRegex.exec(textPart)) !== null) {
                    // Basic PDF string decoding (simplified)
                    let extracted = textMatch[1]
                      .replace(/\\n/g, '\n')
                      .replace(/\\r/g, '\r')
                      .replace(/\\t/g, '\t')
                      .replace(/\\\(/g, '(')
                      .replace(/\\\)/g, ')')
                      .replace(/\\\\/g, '\\');
                    
                    if (extracted.trim()) {
                      texts.push({ str: extracted });
                      textFound = true;
                      hasText = true;
                    }
                  }
                  
                  // Process hex strings
                  let hexMatch;
                  while ((hexMatch = hexTextRegex.exec(textPart)) !== null) {
                    try {
                      // Convert hex to string (each pair of hex digits = 1 character)
                      const hex = hexMatch[1];
                      let hexStr = '';
                      for (let i = 0; i < hex.length; i += 2) {
                        if (i + 1 < hex.length) {
                          const charCode = parseInt(hex.substr(i, 2), 16);
                          hexStr += String.fromCharCode(charCode);
                        }
                      }
                      
                      if (hexStr.trim()) {
                        texts.push({ str: hexStr });
                        textFound = true;
                        hasText = true;
                      }
                    } catch (e) {
                      console.warn("Error parsing hex string:", e);
                    }
                  }
                }
                
                return texts;
              };
              
              // APPROACH 2: Look for text in content streams directly
              const extractTextFromStreams = (str) => {
                const streamRegex = /stream\s*([\s\S]*?)\s*endstream/g;
                let streamMatch;
                let texts = [];
                
                while ((streamMatch = streamRegex.exec(str)) !== null) {
                  const streamContent = streamMatch[1];
                  
                  // Look for text strings in the stream
                  const textRegex = /\((.*?)(?<!\\)\)/g;
                  let textMatch;
                  
                  while ((textMatch = textRegex.exec(streamContent)) !== null) {
                    let extracted = textMatch[1]
                      .replace(/\\n/g, '\n')
                      .replace(/\\r/g, '\r')
                      .replace(/\\t/g, '\t')
                      .replace(/\\\(/g, '(')
                      .replace(/\\\)/g, ')')
                      .replace(/\\\\/g, '\\');
                    
                    if (extracted.trim()) {
                      texts.push({ str: extracted });
                      hasText = true;
                    }
                  }
                }
                
                return texts;
              };
              
              // APPROACH 3: Extract page structure and objects
              const findPages = () => {
                // First look for page objects using the Type/Page signature
                const pageObjectRegex = /\/Type\s*\/Page[^]*?endobj/g;
                let pageMatch;
                let pagesByXref = new Map(); // Store pages by their object reference
                
                while ((pageMatch = pageObjectRegex.exec(pdfString)) !== null) {
                  pageCount++;
                  const pageContent = pageMatch[0];
                  
                  // Find page object number
                  const objNumberMatch = new RegExp('(\\d+)\\s+\\d+\\s+obj[\\s\\S]*' + pageMatch[0]).exec(pdfString);
                  const objNum = objNumberMatch ? objNumberMatch[1] : `page_${pageCount}`;
                  
                  // Extract contents (might be a reference like /Contents 5 0 R)
                  const contentsRefMatch = /\/Contents\s+(\d+)\s+\d+\s+R/g.exec(pageContent);
                  let extractedTexts = [];
                  
                  // Extract text directly from this page object
                  const directTexts = findTextContent(pageContent);
                  if (directTexts.length > 0) {
                    extractedTexts.push(...directTexts);
                  }
                  
                  // Check for image resources in this page
                  if (pageContent.includes('/XObject') && pageContent.includes('/Image')) {
                    hasImages = true;
                  }
                  
                  // If we have a contents reference, try to find that object and extract text from it
                  if (contentsRefMatch) {
                    const contentObjNum = contentsRefMatch[1];
                    const contentObjRegex = new RegExp(contentObjNum + '\\s+\\d+\\s+obj[\\s\\S]*?endobj', 'g');
                    const contentObjMatch = contentObjRegex.exec(pdfString);
                    
                    if (contentObjMatch) {
                      const contentObjTexts = findTextContent(contentObjMatch[0]);
                      if (contentObjTexts.length > 0) {
                        extractedTexts.push(...contentObjTexts);
                      }
                    }
                  }
                  
                  if (extractedTexts.length > 0) {
                    textObjects.push(...extractedTexts);
                    pages.push({
                      pageNum: pageCount,
                      objNum: objNum,
                      texts: extractedTexts
                    });
                    
                    pagesByXref.set(objNum, pageCount);
                  } else {
                    // Empty page
                    pages.push({
                      pageNum: pageCount,
                      objNum: objNum,
                      texts: []
                    });
                  }
                }
                
                return pagesByXref;
              };
              
              // Check if this might be a scanned document
              detectImages();
              
              // Execute the extraction approaches
              const pagesByXref = findPages();
              
              // If we didn't find any pages with the Type/Page approach, try another approach
              if (pageCount === 0) {
                // Look for streams that might contain text
                const allStreamTexts = extractTextFromStreams(pdfString);
                
                if (allStreamTexts.length > 0) {
                  // Group texts into pages (heuristic: split into reasonable chunks)
                  const ITEMS_PER_PAGE = 20;
                  for (let i = 0; i < allStreamTexts.length; i += ITEMS_PER_PAGE) {
                    pageCount++;
                    const pageTexts = allStreamTexts.slice(i, i + ITEMS_PER_PAGE);
                    textObjects.push(...pageTexts);
                    pages.push({
                      pageNum: pageCount,
                      texts: pageTexts
                    });
                  }
                }
              }
              
              // If still no content, try to determine page count from PDF structure
              if (pageCount === 0 || textObjects.length === 0) {
                pageCount = countPages(pdfString);
                console.log(`No text content found, but detected ${pageCount} pages`);
                
                // Create empty pages with appropriate message
                let message = hasImages && !hasText
                  ? "This appears to be a scanned PDF. The document contains images but no extractable text. Consider using OCR software for text extraction."
                  : "This PDF doesn't contain easily extractable text. It may use custom fonts, be encrypted, or have text stored as images.";
                
                for (let i = 1; i <= pageCount; i++) {
                  pages.push({
                    pageNum: i,
                    texts: [{ 
                      str: i === 1 ? message : `Page ${i}`
                    }]
                  });
                }
              }
              
              // Ensure we have at least one page
              if (pages.length === 0) {
                pages.push({
                  pageNum: 1,
                  texts: [{ str: "No content could be extracted from this PDF." }]
                });
                pageCount = 1;
              }
              
              return {
                pageCount,
                pages,
                isScannedDocument: hasImages && !hasText
              };
            };
            
            // Execute PDF text extraction
            const extractionResult = extractTextFromPDF();
            pageCount = extractionResult.pageCount;
            
            // Create our PDF document representation
            resolve({
              numPages: pageCount,
              isScannedDocument: extractionResult.isScannedDocument,
              getPage: function(pageNumber) {
                return {
                  getTextContent: function() {
                    const pageIndex = pageNumber - 1;
                    const page = pages[pageIndex] || { 
                      texts: [{ str: `No content found on page ${pageNumber}` }]
                    };
                    
                    return Promise.resolve({
                      items: page.texts
                    });
                  }
                };
              }
            });
          } catch (error) {
            console.error("PDF parsing error:", error);
            
            // Provide a minimal document to avoid crashes
            resolve({
              numPages: 1,
              getPage: function() {
                return {
                  getTextContent: function() {
                    return Promise.resolve({
                      items: [
                        { str: "Error extracting PDF content: " + error.message },
                        { str: "The PDF may be encrypted, damaged, or use unsupported features." }
                      ]
                    });
                  }
                };
              }
            });
          }
        })
      };
    },
    
    GlobalWorkerOptions: {
      workerSrc: null
    }
  };
};

// Helper function to estimate page count
function countPages(pdfString) {
  // Method 1: Look for /Count in the PDF which often indicates page count in the Page Tree
  const countMatch = /\/Count\s+(\d+)/i.exec(pdfString);
  if (countMatch && countMatch[1]) {
    const count = parseInt(countMatch[1], 10);
    if (count > 0 && count < 5000) { // Sanity check
      return count;
    }
  }
  
  // Method 2: Count /Type /Page instances
  const pageMatches = pdfString.match(/\/Type\s*\/Page/g);
  if (pageMatches && pageMatches.length > 0) {
    return pageMatches.length;
  }
  
  // Method 3: Look for page labels
  const pageLabels = pdfString.match(/\/PageLabels/);
  if (pageLabels) {
    // Count objects that might be pages
    const objMatches = pdfString.match(/\d+\s+\d+\s+obj/g);
    if (objMatches && objMatches.length > 2) { // At least a few objects
      // Heuristic: assume about half the objects are pages in a typical PDF
      return Math.max(1, Math.min(Math.floor(objMatches.length / 3), 100));
    }
  }
  
  return 1; // Default to 1 if we can't determine
}

// Initialize our enhanced PDF.js implementation
const pdfjsLib = createPdfjsBundle();

/**
 * Extrai texto de uma página PDF usando OCR
 * @param {ArrayBuffer} pdfBuffer - O buffer do arquivo PDF
 * @param {number} pageNum - O número da página para processar
 * @returns {Promise<string>} - Texto extraído
 */
async function extractPageTextWithOCR(pdfBuffer, pageNum) {
  try {
    // Carregando o PDF usando PDF-lib
    const pdfDoc = await PDFLib.PDFDocument.load(pdfBuffer);
    
    // Renderizando a página como imagem
    const page = pdfDoc.getPage(pageNum - 1);
    
    // Obter tamanho da página e criar canvas com dimensões adequadas
    const { width, height } = page.getSize();
    const scale = 2; // Escala para melhor qualidade de OCR
    
    // Criar canvas off-screen para renderização
    const canvas = new OffscreenCanvas(width * scale, height * scale);
    const context = canvas.getContext('2d');
    
    // Renderizar a página no canvas (isso é simplificado - na prática precisaria de uma biblioteca como PDF.js)
    // Como não podemos renderizar diretamente aqui, vamos extrair a página como imagem em PDF
    const subPdf = await PDFLib.PDFDocument.create();
    const [copiedPage] = await subPdf.copyPages(pdfDoc, [pageNum - 1]);
    subPdf.addPage(copiedPage);
    const pngBytes = await subPdf.saveAsBase64({ dataUri: true });
    
    // Transformar a base64 em uma imagem que o Tesseract pode processar
    const img = new Image();
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = pngBytes;
    });
    
    context.drawImage(img, 0, 0, width * scale, height * scale);
    const imgBlob = await canvas.convertToBlob({ type: 'image/png' });
    
    // Inicializar o worker Tesseract se necessário
    const worker = await initTesseractWorker();
    
    // Executar OCR na imagem
    self.postMessage({ type: 'progress', payload: 70, message: `Processando OCR na página ${pageNum}` });
    const result = await worker.recognize(imgBlob);
    
    return result.data.text;
  } catch (error) {
    console.error('Erro ao extrair texto com OCR:', error);
    return `Falha ao processar OCR na página ${pageNum}: ${error.message}`;
  }
}

// Modificar a função convertPdfToHtml para incluir OCR
async function convertPdfToHtml(pdfFile) {
  try {
    // Notificar progresso
    self.postMessage({ type: 'progress', payload: 10, message: 'Preparando documento' });
    
    // Carregar o documento PDF
    const arrayBuffer = await pdfFile.arrayBuffer();
    self.postMessage({ type: 'progress', payload: 20, message: 'Documento carregado' });
    
    // Primeiro tente extração normal
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    self.postMessage({ type: 'progress', payload: 30, message: 'Analisando documento' });
    
    // Verificar se é um documento escaneado
    if (pdf.isScannedDocument) {
      self.postMessage({ type: 'progress', payload: 40, message: 'Documento escaneado detectado. Iniciando OCR.' });
      
      // Iniciar HTML
      let htmlContent = '<!DOCTYPE html>\n<html>\n<head>\n';
      htmlContent += '<meta charset="UTF-8">\n';
      htmlContent += '<title>Documento PDF Convertido com OCR</title>\n';
      htmlContent += '<style>\n';
      htmlContent += 'body { font-family: Arial, sans-serif; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 20px; }\n';
      htmlContent += '.page { margin-bottom: 30px; padding: 20px; border-bottom: 1px solid #ccc; page-break-after: always; }\n';
      htmlContent += 'h2 { color: #444; border-bottom: 1px solid #eee; padding-bottom: 5px; }\n';
      htmlContent += 'p { margin: 12px 0; }\n';
      htmlContent += '.content-container { background: white; padding: 15px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }\n';
      htmlContent += '.ocr-notice { background: #e3f2fd; color: #0d47a1; padding: 10px; border-left: 4px solid #2196f3; margin-bottom: 20px; }\n';
      htmlContent += '@media print { .page { page-break-after: always; border: none; } }\n';
      htmlContent += '</style>\n';
      htmlContent += '</head>\n<body>\n';
      
      // Adicionar aviso sobre OCR
      htmlContent += '<div class="ocr-notice">\n';
      htmlContent += '  <strong>Processado com OCR:</strong> Este documento foi processado usando reconhecimento ótico de caracteres.\n';
      htmlContent += '  A precisão pode variar dependendo da qualidade da imagem original.\n';
      htmlContent += '</div>\n';
      
      // Processar cada página com OCR
      for (let i = 1; i <= pdf.numPages; i++) {
        self.postMessage({ 
          type: 'progress', 
          payload: 40 + (i / pdf.numPages) * 50, 
          message: `Processando OCR na página ${i} de ${pdf.numPages}` 
        });
        
        // Extrair texto usando OCR
        const pageText = await extractPageTextWithOCR(arrayBuffer, i);
        
        // Adicionar à saída HTML
        htmlContent += `<div class="page" data-page-number="${i}">\n`;
        htmlContent += `<h2>Página ${i}</h2>\n`;
        htmlContent += `<div class="content-container">\n`;
        
        // Quebrar o texto em parágrafos
        const paragraphs = pageText.split(/\n\s*\n/);
        for (const paragraph of paragraphs) {
          if (paragraph.trim()) {
            htmlContent += `<p>${escapeHtml(paragraph.trim())}</p>\n`;
          }
        }
        
        htmlContent += '</div>\n';
        htmlContent += '</div>\n';
      }
      
      htmlContent += '</body>\n</html>';
      
      self.postMessage({ type: 'progress', payload: 95, message: 'Finalizando conversão' });
      
      // Retornar como Blob
      return new Blob([htmlContent], { type: 'text/html' });
    } else {
      // Se não for um documento escaneado, continue com o método normal
      return await normalConvertPdfToHtml(pdf, arrayBuffer);
    }
  } catch (error) {
    console.error('Erro no worker de documento:', error);
    throw error;
  }
}

// A versão normal da função (sem OCR) - mover o código existente para cá
async function normalConvertPdfToHtml(pdf, arrayBuffer) {
  try {
    self.postMessage({ type: 'progress', payload: 50, message: 'Extraindo texto' });
    
    let htmlContent = '<!DOCTYPE html>\n<html>\n<head>\n';
    htmlContent += '<meta charset="UTF-8">\n';
    htmlContent += '<title>Documento PDF Convertido</title>\n';
    htmlContent += '<style>\n';
    htmlContent += 'body { font-family: Arial, sans-serif; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 20px; }\n';
    htmlContent += '.page { margin-bottom: 30px; padding: 20px; border-bottom: 1px solid #ccc; page-break-after: always; }\n';
    htmlContent += 'h2 { color: #444; border-bottom: 1px solid #eee; padding-bottom: 5px; }\n';
    htmlContent += 'p { margin: 12px 0; }\n';
    htmlContent += '.content-container { background: white; padding: 15px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }\n';
    htmlContent += '</style>\n';
    htmlContent += '</head>\n<body>\n';
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      self.postMessage({ type: 'progress', payload: 50 + (i / pdf.numPages) * 40 });
      
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      htmlContent += `<div class="page" data-page-number="${i}">\n`;
      htmlContent += `<h2>Página ${i}</h2>\n`;
      htmlContent += `<div class="content-container">\n`;
      
      if (!textContent.items || textContent.items.length === 0) {
        htmlContent += `<p><em>Nenhum conteúdo de texto encontrado nesta página.</em></p>\n`;
      } else {
        for (const item of textContent.items) {
          if (item.str && item.str.trim()) {
            htmlContent += `<p>${escapeHtml(item.str)}</p>\n`;
          }
        }
      }
      
      htmlContent += '</div>\n';
      htmlContent += '</div>\n';
    }
    
    htmlContent += '</body>\n</html>';
    
    self.postMessage({ type: 'progress', payload: 95 });
    
    // Return as Blob
    return new Blob([htmlContent], { type: 'text/html' });
  } catch (error) {
    console.error('Document worker error:', error);
    throw error;
  }
}

// Também modifique a função convertPdfToMarkdown para usar OCR quando necessário
async function convertPdfToMarkdown(pdfFile) {
  try {
    // Notificar progresso
    self.postMessage({ type: 'progress', payload: 10, message: 'Preparando documento' });
    
    // Carregar o documento PDF
    const arrayBuffer = await pdfFile.arrayBuffer();
    self.postMessage({ type: 'progress', payload: 20, message: 'Documento carregado' });
    
    // Primeiro tente extração normal
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    self.postMessage({ type: 'progress', payload: 30, message: 'Analisando documento' });
    
    // Verificar se é um documento escaneado
    if (pdf.isScannedDocument) {
      self.postMessage({ type: 'progress', payload: 40, message: 'Documento escaneado detectado. Iniciando OCR.' });
      
      let markdownContent = `# Documento PDF Convertido com OCR\n\n`;
      markdownContent += `> **Nota:** Este documento foi processado usando reconhecimento ótico de caracteres (OCR).\n`;
      markdownContent += `> A precisão pode variar dependendo da qualidade da imagem original.\n\n`;
      
      // Processar cada página com OCR
      for (let i = 1; i <= pdf.numPages; i++) {
        self.postMessage({ 
          type: 'progress', 
          payload: 40 + (i / pdf.numPages) * 50, 
          message: `Processando OCR na página ${i} de ${pdf.numPages}` 
        });
        
        // Extrair texto usando OCR
        const pageText = await extractPageTextWithOCR(arrayBuffer, i);
        
        // Adicionar à saída Markdown
        markdownContent += `## Página ${i}\n\n`;
        
        // Quebrar o texto em parágrafos
        const paragraphs = pageText.split(/\n\s*\n/);
        for (const paragraph of paragraphs) {
          if (paragraph.trim()) {
            markdownContent += `${paragraph.trim()}\n\n`;
          }
        }
      }
      
      self.postMessage({ type: 'progress', payload: 95, message: 'Finalizando conversão' });
      
      // Retornar como Blob
      return new Blob([markdownContent], { type: 'text/markdown' });
    } else {
      // Se não for um documento escaneado, continue com o método normal
      return await normalConvertPdfToMarkdown(pdf);
    }
  } catch (error) {
    console.error('Erro no worker de documento:', error);
    throw error;
  }
}

// A versão normal da função de markdown (sem OCR)
async function normalConvertPdfToMarkdown(pdf) {
  // Seu código atual para conversão de PDF para Markdown
  try {
    self.postMessage({ type: 'progress', payload: 50, message: 'Extraindo texto' });
    
    let markdownContent = `# Documento PDF Convertido\n\n`;
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      self.postMessage({ type: 'progress', payload: 50 + (i / pdf.numPages) * 40 });
      
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      markdownContent += `## Página ${i}\n\n`;
      
      if (!textContent.items || textContent.items.length === 0) {
        markdownContent += `*Nenhum conteúdo de texto encontrado nesta página.*\n\n`;
      } else {
        let lastY = null;
        let currentParagraph = '';
        
        for (const item of textContent.items) {
          if (item.str && item.str.trim()) {
            if (lastY !== null && Math.abs(item.transform?.[5] - lastY) > 12) {
              markdownContent += `${currentParagraph.trim()}\n\n`;
              currentParagraph = item.str;
            } else {
              if (currentParagraph.length > 0 && 
                  !currentParagraph.endsWith(' ') && 
                  !currentParagraph.endsWith('-')) {
                currentParagraph += ' ';
              }
              currentParagraph += item.str;
            }
            
            if (item.transform) {
              lastY = item.transform[5];
            }
          }
        }
        
        // Add the last paragraph
        if (currentParagraph.trim()) {
          markdownContent += `${currentParagraph.trim()}\n\n`;
        }
      }
    }
    
    self.postMessage({ type: 'progress', payload: 95 });
    
    // Return as Blob
    return new Blob([markdownContent], { type: 'text/markdown' });
  } catch (error) {
    console.error('Document worker error:', error);
    throw error;
  }
}

// Atualizar o handler de mensagens para suportar inicialização do OCR
self.onmessage = async function(e) {
  try {
    if (e.data.type === 'init') {
      console.log('Document converter worker initialized');
      
      // Se o recurso de OCR for solicitado, inicialize-o antecipadamente
      if (e.data.payload?.enableOcr) {
        self.postMessage({ type: 'progress', message: 'Carregando motor OCR...' });
        await initTesseractWorker();
        self.postMessage({ type: 'progress', message: 'Motor OCR inicializado com sucesso!' });
      }
      
      self.postMessage({ type: 'initialized' });
      return;
    }
    
    if (e.data.type === 'convert') {
      const { file, sourceFormat, targetFormat, useOcr } = e.data.payload;
      let result = null;
      
      console.log(`Converting from ${sourceFormat} to ${targetFormat} ${useOcr ? 'with OCR' : ''}`);
      
      if (sourceFormat === 'pdf' && targetFormat === 'html') {
        result = await convertPdfToHtml(file);
      } else if (sourceFormat === 'pdf' && targetFormat === 'md') {
        result = await convertPdfToMarkdown(file);
      } else {
        throw new Error(`Conversão não suportada de ${sourceFormat} para ${targetFormat}`);
      }
      
      self.postMessage({ type: 'progress', payload: 100 });
      self.postMessage({ type: 'success', payload: result });
    }
  } catch (error) {
    console.error('Worker error:', error);
    self.postMessage({ type: 'error', payload: error.message });
  }
};

/**
 * Helper function to escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}