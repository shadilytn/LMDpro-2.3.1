#!/usr/bin/env python3
"""
Zalamati Autonomous AI Agent Ecosystem - Auto RAG Crawler System
Designed for high-performance recursive crawling, semantic chunking, 
and automated injection into the live LMDpro RAG Knowledge Base.
"""

import os
import sys
import json
import re
import urllib.request
import urllib.parse
from html.parser import HTMLParser

class SimpleHTMLStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reset()
        self.fed = []
        self.title = ""
        self.in_title = False
        self.in_script_or_style = False

    def handle_starttag(self, tag, attrs):
        if tag.lower() == 'title':
            self.in_title = True
        if tag.lower() in ['script', 'style']:
            self.in_script_or_style = True

    def handle_endtag(self, tag):
        if tag.lower() == 'title':
            self.in_title = False
        if tag.lower() in ['script', 'style']:
            self.in_script_or_style = False

    def handle_data(self, d):
        if self.in_title:
            self.title += d
        elif not self.in_script_or_style:
            self.fed.append(d)

    def get_data(self):
        return ''.join(self.fed)

def clean_and_normalize_text(text):
    # Strip excessive whitespace and linebreaks
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def chunk_text(text, chunk_size=800, overlap=150):
    """
    Split text into overlapping semantic chunks for RAG processing
    """
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk_words = words[i:i + chunk_size]
        chunks.append(" ".join(chunk_words))
        if i + chunk_size >= len(words):
            break
        i += (chunk_size - overlap)
    return chunks

class AutoRagCrawler:
    def __init__(self, seed_url, max_depth=2, max_pages=15, default_topic="Web Crawl RAG"):
        self.seed_url = seed_url
        self.max_depth = max_depth
        self.max_pages = max_pages
        self.default_topic = default_topic
        self.visited_urls = set()
        self.parsed_origin = urllib.parse.urlparse(seed_url)

    def is_valid_url(self, url):
        parsed = urllib.parse.urlparse(url)
        # Stay within the same host/domain to prevent runaway web crawling
        return parsed.scheme in ('http', 'https') and parsed.netloc == self.parsed_origin.netloc

    def extract_links(self, html_content, base_url):
        links = set()
        # Simple regex to extract hrefs
        pattern = re.compile(r'href=["\'](https?://.*?|/.*?)["\']', re.IGNORECASE)
        for match in pattern.finditer(html_content):
            href = match.group(1)
            full_url = urllib.parse.urljoin(base_url, href)
            # Remove fragments
            full_url = urllib.parse.urljoin(full_url, urllib.parse.urlparse(full_url).path)
            if self.is_valid_url(full_url):
                links.add(full_url)
        return links

    def fetch_page(self, url):
        print(f"[*] Crawling: {url}")
        headers = {
            'User-Agent': 'ZalamatiAutoRAGCrawler/1.0 (Autonomous AI System)'
        }
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=8) as response:
                content_type = response.info().get_content_type()
                if 'html' not in content_type:
                    print(f"[!] Skipping non-HTML resource: {content_type}")
                    return None, None
                html = response.read().decode('utf-8', errors='ignore')
                return html, response.geturl()
        except Exception as e:
            print(f"[x] Error fetching {url}: {e}")
            return None, None

    def run_crawl(self):
        queue = [(self.seed_url, 0)]
        indexed_count = 0
        all_indexed_docs = []

        while queue and len(self.visited_urls) < self.max_pages:
            url, depth = queue.pop(0)
            if url in self.visited_urls or depth > self.max_depth:
                continue

            self.visited_urls.add(url)
            html, final_url = self.fetch_page(url)
            if not html:
                continue

            # Strip HTML and extract title and clean text
            stripper = SimpleHTMLStripper()
            try:
                stripper.feed(html)
            except Exception as e:
                print(f"[!] Parser error on {url}: {e}")
                continue

            raw_text = stripper.get_data()
            clean_text = clean_and_normalize_text(raw_text)
            page_title = stripper.title.strip() or f"Crawled Resource - {urllib.parse.urlparse(url).path}"

            print(f"[+] Successfully parsed: '{page_title}' ({len(clean_text)} characters)")

            # Semantic chunking
            chunks = chunk_text(clean_text, chunk_size=500, overlap=100)
            print(f"    Divided into {len(chunks)} overlapping chunks.")

            for idx, chunk in enumerate(chunks):
                doc_title = f"{page_title} [Part {idx + 1}]"
                doc_data = {
                    "action": "index",
                    "title": doc_title,
                    "content": f"Source URL: {url}\n\nContent:\n{chunk}",
                    "topic": self.default_topic
                }
                
                # Push to the local server
                success = self.push_to_rag_server(doc_data)
                if success:
                    indexed_count += 1
                    all_indexed_docs.append({
                        "title": doc_title,
                        "topic": self.default_topic,
                        "content_length": len(chunk)
                    })

            # Extract and queue links for crawling
            new_links = self.extract_links(html, final_url)
            for link in new_links:
                if link not in self.visited_urls:
                    queue.append((link, depth + 1))

        print(f"\n[===] Crawl Complete. Successfully indexed {indexed_count} chunks across {len(self.visited_urls)} pages [===]")
        return all_indexed_docs

    def push_to_rag_server(self, data):
        server_url = "http://localhost:3000/api/gemini/rag-index"
        try:
            req_data = json.dumps(data).encode('utf-8')
            req = urllib.request.Request(
                server_url, 
                data=req_data, 
                headers={'Content-Type': 'application/json'}
            )
            with urllib.request.urlopen(req, timeout=5) as response:
                res_body = response.read().decode('utf-8')
                res_json = json.loads(res_body)
                return res_json.get('status') == 'indexed'
        except Exception as e:
            # Server might not be running yet, or local API route issues, log warning
            print(f"[!] Warning: Failed to push index to Express server: {e}")
            return False

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Zalamati Auto RAG Crawler Engine")
    parser.add_argument("--url", default="https://ai.google.dev/edge/litert", help="Seed URL to crawl")
    parser.add_argument("--depth", type=int, default=1, help="Max recursion depth")
    parser.add_argument("--pages", type=int, default=5, help="Max pages to crawl")
    parser.add_argument("--topic", default="LiteRT Edge AI", help="Category topic for Firestore/Local database indexing")
    
    args = parser.parse_args()
    
    print("==================================================================")
    print("      ZALAMATI SYSTEM CORE: AUTONOMOUS PYTHON RAG CRAWLER        ")
    print("==================================================================")
    print(f"Seed URL: {args.url}")
    print(f"Max Depth: {args.depth}")
    print(f"Max Pages: {args.pages}")
    print(f"Target Topic: {args.topic}")
    print("==================================================================")
    
    crawler = AutoRagCrawler(args.url, max_depth=args.depth, max_pages=args.pages, default_topic=args.topic)
    crawler.run_crawl()
