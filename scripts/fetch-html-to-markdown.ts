#!/usr/bin/env bun

import TurndownService from 'turndown';
import { mkdir } from 'node:fs/promises';
import { join, basename } from 'node:path';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-'
});

async function fetchHtmlToMarkdown(url: string, outputDir: string = 'spec') {
  try {
    await mkdir(outputDir, { recursive: true });
    
    console.log(`Fetching ${url}...`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    
    const markdown = turndownService.turndown(html);
    
    const urlObj = new URL(url);
    const filename = (urlObj.pathname === '/' ? 'index' : basename(urlObj.pathname, '.html')) + '.md';
    const outputPath = join(outputDir, `${urlObj.hostname}_${filename}`);
    
    await Bun.write(outputPath, markdown);
    
    console.log(`✓ Saved to ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error(`Error processing ${url}:`, error);
    throw error;
  }
}

async function main() {
  const urls = process.argv.slice(2);
  
  if (urls.length === 0) {
    console.log('Usage: bun scripts/fetch-html-to-markdown.ts <url1> [url2] [...]');
    console.log('Example: bun scripts/fetch-html-to-markdown.ts https://example.com https://docs.example.com/api');
    process.exit(1);
  }
  
  console.log(`Processing ${urls.length} URL(s)...\n`);
  
  const results = await Promise.allSettled(
    urls.map(url => fetchHtmlToMarkdown(url))
  );
  
  console.log('\n--- Summary ---');
  let successCount = 0;
  let failureCount = 0;
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      successCount++;
    } else {
      failureCount++;
      console.error(`Failed: ${urls[index]} - ${result.reason}`);
    }
  });
  
  console.log(`\nSuccess: ${successCount}/${urls.length}`);
  if (failureCount > 0) {
    console.log(`Failed: ${failureCount}/${urls.length}`);
    process.exit(1);
  }
}

if (import.meta.main) {
  main();
}

export { fetchHtmlToMarkdown };