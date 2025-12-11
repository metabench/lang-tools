process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const express = require('express');
const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const jsgui = require('jsgui3-html');
// console.log('jsgui.Control is:', jsgui.Control);
// const jsgui = { Control: class {}, Blank_HTML_Document: class { constructor() { this.head = { add: () => {} }; this.body = { add: () => {} }; this.context = {}; } all_html_render() { return '<html></html>'; } } };


const app = express();
const port = 3001;

app.use((req, res, next) => {
    console.log('Request received:', req.method, req.url);
    next();
});

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
});

// Serve jsgui3-client
// Assuming the package has a dist or main file we can serve. 
// We'll serve the whole directory for simplicity in this internal tool.
app.use('/jsgui', express.static(path.join(__dirname, '../../node_modules/jsgui3-client')));

const DOCS_DIR = path.join(__dirname, '../../docs');
const FILES = [
    '00_PROJECT_OVERVIEW.md',
    '01_PRODUCT_REQUIREMENTS.md',
    '02_DATA_ARCHITECTURE.md',
    '03_TECHNICAL_STACK.md',
    '04_VISUAL_DESIGN_SYSTEM.md',
    '05_COMPONENT_SPECIFICATIONS.md',
    '06_BUILD_INSTRUCTIONS_LOCAL_IDE.md',
    '07_IMPLEMENTATION_PHASES.md',
    '08_API_AND_INTEGRATION.md',
    '09_TESTING_AND_QA.md',
    '10_DEPLOYMENT_AND_DEVOPS.md',
    '11_PRODUCTION_CHECKLIST.md'
];

// RawHtml removed


app.get('/', (req, res) => {
    console.log('Serving docs...');
    try {
        // 1. Render Markdown
        let fullHtml = '';
        let tocHtml = '<div class="toc"><h2>Table of Contents</h2><ul>';
        
        console.log('Starting file loop...');
        FILES.forEach(file => {
            const filePath = path.join(DOCS_DIR, file);
            if (fs.existsSync(filePath)) {
                // console.log('Reading', file);
                const content = fs.readFileSync(filePath, 'utf8');
                // console.log('Rendering', file);
                const rendered = md.render(content);
                const id = file.replace('.md', '');
                
                tocHtml += `<li><a href="#${id}">${file}</a></li>`;
                
                fullHtml += `<section class="doc-section" id="${id}">`;
                fullHtml += `<div class="file-header">${file}</div>`;
                fullHtml += rendered;
                fullHtml += `</section><hr/>`;
            }
        });
        console.log('File loop done.');
        tocHtml += '</ul></div>';

        // 2. Build jsgui Page
        console.log('Creating page...');
        const page = new jsgui.Blank_HTML_Document();
        
        if (page.title) {
            page.title.add('Lang-Tools Vibe Bible');
        }
        
        // CSS
        console.log('Adding CSS...');
        const css = `
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 900px; margin: 0 auto; padding: 2rem; color: #333; background: #fff; }
            pre { background: #f6f8fa; padding: 1rem; overflow-x: auto; border-radius: 6px; border: 1px solid #e1e4e8; }
            code { background: #f6f8fa; padding: 0.2rem 0.4rem; border-radius: 3px; font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace; font-size: 85%; }
            h1 { border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; margin-top: 2rem; }
            h2 { border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; margin-top: 1.5rem; }
            hr { height: 0.25em; padding: 0; margin: 24px 0; background-color: #e1e4e8; border: 0; }
            .doc-section { margin-bottom: 4rem; }
            .file-header { font-size: 0.8rem; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
            .toc { background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 3rem; border: 1px solid #e9ecef; }
            .toc h2 { margin-top: 0; border-bottom: none; }
            .toc ul { list-style: none; padding: 0; }
            .toc li { margin-bottom: 0.5rem; }
            .toc a { text-decoration: none; color: #0366d6; }
            .toc a:hover { text-decoration: underline; }
            blockquote { border-left: 0.25em solid #dfe2e5; color: #6a737d; padding: 0 1em; margin: 0; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 1rem; }
            th, td { border: 1px solid #dfe2e5; padding: 6px 13px; }
            tr:nth-child(2n) { background-color: #f6f8fa; }
        `;
        
        const style = new jsgui.Control({ context: page.context });
        style.dom.tagName = 'style';
        style.dom.attributes.type = 'text/css';
        style.add(css);
        page.head.add(style);
        
        console.log('Adding script...');
        const script = new jsgui.script({ src: '/jsgui/jsgui3-client.js' });
        page.head.add(script);

        console.log('Adding container...');
        const container = new jsgui.div({ 'class': 'container' });
        
        // Simplified content injection to avoid crashes
        // We'll try to inject the HTML as a string. If it escapes, we'll fix it later.
        // The priority is to stop the server from crashing.
        container.add(tocHtml + fullHtml);
        
        page.body.add(container);

        console.log('Rendering page...');
        const html = page.all_html_render();
        console.log('Page rendered, length:', html.length);
        res.send(html);
        console.log('Response sent.');
    } catch (e) {
        console.error('Error during rendering:', e);
        res.status(500).send('Error rendering page: ' + e.message);
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Docs Browser running at http://0.0.0.0:${port}`);
});

console.log('Server startup complete.');

