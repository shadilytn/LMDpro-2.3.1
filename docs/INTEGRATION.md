# Zalamati Developer Integration & Gateway Guide

Welcome to the **Zalamati Developer Integration Hub**. This documentation outlines the system specifications, Model Context Protocol (MCP) standards, active RAG indexing protocols, and official language SDK details to connect external agent swarms and IDE contexts securely.

---

## 1. REST API Engine Specification

All REST communication is handled via the gateway with authorization scopes. Access is validated via bearer keys (`Authorization: Bearer zal_dev_sk_...`).

### 1.1 Course Generation Engine
Generates structured syllabi, adaptive modules, and diagnostic quizzes.
* **Endpoint:** `POST /api/v1/generate-course`
* **Request Schema:**
  ```json
  {
    "topic": "Quantum Computing",
    "category": "Computer Science",
    "level": "Advanced",
    "moduleCount": 3
  }
  ```
* **Response Schema:** Returns a standard structured Course Object containing multi-module syllabus trees.

### 1.2 Socratic Tutor Core
Converses with students using structured leading inquiries rather than immediate answers.
* **Endpoint:** `POST /api/v1/tutor`
* **Request Schema:**
  ```json
  {
    "prompt": "What is backpropagation?",
    "thinkingMode": true
  }
  ```

### 1.3 High-Dimensional RAG Indexer
Retrieves or registers text contents inside the active learning memory bank.
* **Endpoint:** `POST /api/gemini/rag-index`
* **Query Mode Payload:**
  ```json
  {
    "query": "Model Context Protocol"
  }
  ```
* **Index Mode Payload:**
  ```json
  {
    "action": "index",
    "title": "Quantum Error Correction",
    "content": "Active physical qubits require structured surface code loops...",
    "topic": "Quantum Computing"
  }
  ```

---

## 2. Model Context Protocol (MCP) Server

The Zalamati engine features a fully compliant **Model Context Protocol (MCP)** server, enabling seamless tool integration for authorized AI desktop hosts and local workspace IDE environments.

### 2.1 Connection Configurations
The MCP server operates natively over two standard communication transports:

#### A. Stdio Subprocess Transport (For local CLI and workspaces)
Integrate Zalamati into local workspace host servers by declaring the node gateway in your global client configs:
```json
{
  "mcpServers": {
    "zalamati-engine": {
      "command": "npx",
      "args": ["-y", "@zalamati/mcp-server"],
      "env": {
        "ZALAMATI_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

#### B. HTTP with SSE Transport (For secure web-tier client integrations)
Establish an active client connection by initiating an event stream request:
* **Connection Request:** `GET /api/mcp/sse`
* **Client Handshake:** The server returns a unique `connectionId` and specifies where client requests should be POSTed:
  ```http
  event: endpoint
  data: /api/mcp/message?connectionId=mcp-conn-123abc
  ```
* **Client Delivery:** All JSON-RPC client messages must be POSTed to the specified endpoint with `Content-Type: application/json`.

---

## 3. Registered MCP Tools Schema

Every tool requires standardized parameters and returns compliant JSON-RPC payloads:

### 3.1 `generate_course_schema`
Builds detailed course syllabi, modules, lessons, and quizzes for any topic.
* **Arguments:**
  * `topic` (string): The target subject or concept.
  * `level` (string, optional): Beginner, Intermediate, or Advanced.

### 3.2 `ask_socratic_tutor`
Queries the Socratic AI tutor for structured, conceptual explanations.
* **Arguments:**
  * `prompt` (string): Socratic inquiry text.
  * `thinkingMode` (boolean, optional): Enables deep multi-step reasoning models.

### 3.3 `search_vector_rag`
Searches indexed textbook materials, custom documentation, and academic repositories.
* **Arguments:**
  * `query` (string): High-dimensional semantic search search term.

---

## 4. Telemetry & Telemetry Monitoring
Monitor active server instances by querying the status telemetry path:
* **Endpoint:** `GET /api/mcp/status`
* **Sample Response:**
  ```json
  {
    "status": "ONLINE",
    "mcpVersion": "1.1.0",
    "transport": "SSE/HTTP-Hybrid",
    "activeConnections": 0,
    "indexedDocsCount": 2,
    "exposedTools": [
      "generate_course_schema",
      "ask_socratic_tutor",
      "search_vector_rag",
      "synthesize_tts",
      "evaluate_quiz_mastery"
    ]
  }
  ```
