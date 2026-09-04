import { ProjectSimulation } from '../shared/simulation.types';

export const MOCK_PROJECT_SIMULATIONS: ProjectSimulation[] = [
  {
    id: 'sim-sheaf-admm-swarm',
    courseId: 'course-ai-agentic-systems',
    courseTitle: 'Advanced Autonomous Agentic Systems & Sheaf Topology',
    title: 'Autonomous Swarm Consensus via Sheaf-ADMM Protocol',
    description: 'Design and code a distributed consensus engine for a fleet of 5 autonomous swarm drones navigating cluttered airspace without a central command server.',
    domainRole: 'Principal Swarm Robotics Architect',
    industryDomain: 'Autonomous Aerospace & Defense',
    difficulty: 'Advanced',
    estimatedHours: 4,
    xpReward: 500,
    scenario: `### Executive Scenario
You are the Lead Swarm Systems Engineer at **AeroMatrix Defense Labs**. Your team is deploying a tactical fleet of 5 autonomous surveillance drones in a GPS-denied urban canyon. 

Due to dynamic electronic jamming, central ground stations cannot broadcast navigation updates. The drones must maintain spatial formation and target consensus **purely through peer-to-peer radio links** using a **Cellular Sheaf topology** and the **Sheaf-ADMM (Alternating Direction Method of Multipliers)** algorithm.

### Business & Engineering Objectives
1. Prevent drone collision by enforcing local state agreement across private coordinate stalks $\\mathcal{F}(i)$.
2. Calculate consensus projections $z_e$ along shared communication edges $e=(i,j)$ using local restriction maps $F_{i \\to e}$.
3. Handle communication link drops smoothly via dual variable accumulation $u_e$ without crashing the fleet control loop.`,
    systemArchitectureOverview: `\`\`\`
+------------------+                    +------------------+
| Drone Alpha (0)  |---[Edge e1=(0,1)]--|  Drone Beta (1)  |
+------------------+                    +------------------+
         |                                       |
  [Edge e2=(0,2)]                         [Edge e3=(1,3)]
         |                                       |
+------------------+                    +------------------+
| Drone Gamma (2)  |---[Edge e4=(2,3)]--| Drone Delta (3)  |
+------------------+                    +------------------+
                                                 |
                                          [Edge e5=(3,4)]
                                                 |
                                        +------------------+
                                        | Drone Epsilon(4) |
                                        +------------------+
\`\`\``,
    prerequisites: [
      'Understanding of Cellular Sheaf Laplacians',
      'Python/TypeScript vector operations & matrix calculations',
      'Convex optimization fundamentals (ADMM)'
    ],
    tasks: [
      {
        id: 'task-1-sheaf-matrix',
        taskNumber: 1,
        title: 'Define Sheaf Restriction Maps & Laplacian Topology',
        description: `Implement the restriction map matrix constructor \`build_sheaf_restriction_maps(num_nodes, edges)\` that constructs linear projections $F_{i \\to e}$ mapping 3D spatial coordinate vectors (x, y, z) into edge stalks.`,
        requiredDeliverableType: 'code',
        targetFilename: 'sheaf_consensus.py',
        starterTemplate: `import numpy as np

def build_sheaf_restriction_maps(num_nodes=5, edges=None):
    """
    Constructs local restriction maps F_{i -> e} for a 5-drone network.
    edges: list of tuples (u, v) representing communication links.
    Returns: dict mapping (node, edge) -> restriction_matrix (3x3)
    """
    if edges is None:
        edges = [(0, 1), (0, 2), (1, 3), (2, 3), (3, 4)]
    
    restriction_maps = {}
    for edge_idx, (u, v) in enumerate(edges):
        # TODO: Define 3x3 identity or rotation projection for node u and node v onto edge
        restriction_maps[(u, edge_idx)] = np.eye(3)
        restriction_maps[(v, edge_idx)] = np.eye(3)
        
    return restriction_maps, edges
`,
        validationCriteria: [
          'Correctly initializes 3x3 projection matrices for each incident node-edge pair',
          'Supports custom edge configurations without hardcoded dimension errors',
          'Ensures linear map compatibility across edge stalks'
        ],
        hints: [
          'Identity matrix np.eye(3) represents aligned local orientation frames',
          'Ensure every edge e=(u,v) maps both node u and node v'
        ]
      },
      {
        id: 'task-2-admm-loop',
        taskNumber: 2,
        title: 'Implement the Unrolled Sheaf-ADMM Update Engine',
        description: `Write the core iterative consensus loop \`run_sheaf_admm_step(x_nodes, z_edges, u_duals, restriction_maps, rho=1.0)\` performing primal $x$-updates, edge $z$-consensus projections, and dual $u$-updates.`,
        requiredDeliverableType: 'code',
        targetFilename: 'admm_engine.py',
        starterTemplate: `import numpy as np

def run_sheaf_admm_step(x_nodes, z_edges, u_duals, restriction_maps, edges, rho=1.0):
    """
    Performs 1 iteration of Sheaf-ADMM consensus.
    x_nodes: dict {node_id: array(3)}
    z_edges: dict {edge_idx: array(3)}
    u_duals: dict {(node_id, edge_idx): array(3)}
    """
    new_x = {}
    new_z = {}
    new_u = {}
    
    # Step 1: Primal Local x-Update
    for u_id in x_nodes.keys():
        # TODO: Compute local update incorporating target and edge expectations
        new_x[u_id] = x_nodes[u_id] # Placeholder
        
    # Step 2: Edge Consensus z-Update
    for edge_idx, (u, v) in enumerate(edges):
        # TODO: Average projected states from node u and node v plus duals
        F_u = restriction_maps.get((u, edge_idx), np.eye(3))
        F_v = restriction_maps.get((v, edge_idx), np.eye(3))
        
        val_u = F_u @ new_x[u] + u_duals.get((u, edge_idx), np.zeros(3))
        val_v = F_v @ new_x[v] + u_duals.get((v, edge_idx), np.zeros(3))
        
        new_z[edge_idx] = 0.5 * (val_u + val_v)
        
    # Step 3: Dual Accumulator u-Update
    for edge_idx, (u, v) in enumerate(edges):
        F_u = restriction_maps.get((u, edge_idx), np.eye(3))
        F_v = restriction_maps.get((v, edge_idx), np.eye(3))
        
        new_u[(u, edge_idx)] = u_duals.get((u, edge_idx), np.zeros(3)) + (F_u @ new_x[u] - new_z[edge_idx])
        new_u[(v, edge_idx)] = u_duals.get((v, edge_idx), np.zeros(3)) + (F_v @ new_x[v] - new_z[edge_idx])
        
    return new_x, new_z, new_u
`,
        validationCriteria: [
          'Correctly computes primal x-update incorporating local neighbor state expectations',
          'Computes edge consensus z-averaging across projected stalks',
          'Accumulates dual residuals u to guarantee convergence within <= 20 iterations'
        ],
        hints: [
          'Dual variables store residual disagreement between node projections and edge average',
          'When error residual ||F_u x_u - z_e|| < 0.01, consensus is achieved'
        ]
      },
      {
        id: 'task-3-resilience-report',
        taskNumber: 3,
        title: 'Architectural Resilience Analysis & Link Drop Report',
        description: `Write a technical architecture report detailing how the Sheaf-ADMM network recovers when Edge e2=(0,2) is dropped mid-flight due to radar jamming. Include performance metrics and topological recovery steps.`,
        requiredDeliverableType: 'analytical_report',
        targetFilename: 'resilience_analysis.md',
        starterTemplate: `# Sheaf-ADMM Swarm Resilience Report

## Executive Summary
[Provide high-level summary of link drop simulation results]

## Topological Analysis of Edge Drop (e2 = (0, 2))
- **Graph Re-configuration**: Explain how graph spectral radius shifts when e2 is disconnected.
- **Cohomological Obstruction Class**: Describe how non-zero residuals in edge e2 trigger Sheaf-Theoretic Planning (STP).

## Performance Metrics
- **Initial Consensus Iterations**: 14 steps
- **Post-Jamming Re-convergence**: [Detail expected iterations]
- **Max Spatial Offset Error**: [Specify in meters]

## Mitigation Strategies
1. Dynamic restriction map re-weighting
2. Local buffer retention for dual accumulators
`,
        validationCriteria: [
          'Analyzes topological graph connectivity changes during link drop',
          'Explains Sheaf-Theoretic Planning (STP) abductive recovery mechanism',
          'Provides clear engineering recommendations for real-world drone deployments'
        ],
        hints: [
          'Reference non-zero Cohomological Obstruction Class [omega] != 0',
          'Highlight how dual accumulator buffers prevent consensus drift during transient outages'
        ]
      }
    ],
    starterAssets: {
      starterCode: {
        'main.py': `# Simulation Entrypoint
from sheaf_consensus import build_sheaf_restriction_maps
from admm_engine import run_sheaf_admm_step
import numpy as np

print("=== AeroMatrix Swarm Consensus Simulation ===")
maps, edges = build_sheaf_restriction_maps()
print(f"Initialized {len(edges)} communication edges across 5 drone nodes.")
`
      },
      dataFiles: {
        'drone_telemetry.json': JSON.stringify({
          drones: [
            { id: 0, initialPos: [10.5, 20.0, 50.0], targetPos: [15.0, 25.0, 55.0] },
            { id: 1, initialPos: [12.0, 22.0, 51.0], targetPos: [15.0, 25.0, 55.0] },
            { id: 2, initialPos: [8.5, 18.0, 48.0], targetPos: [15.0, 25.0, 55.0] },
            { id: 3, initialPos: [14.0, 26.0, 53.0], targetPos: [15.0, 25.0, 55.0] },
            { id: 4, initialPos: [16.0, 28.0, 56.0], targetPos: [15.0, 25.0, 55.0] }
          ]
        }, null, 2)
      },
      configYaml: `swarm_config:
  fleet_size: 5
  communication_range_meters: 150
  consensus_tolerance: 0.005
  max_admm_iterations: 50
  rho_penalty: 1.2
`
    },
    rubric: {
      criteria: [
        {
          id: 'crit-correctness',
          title: 'Algorithmic Correctness & ADMM Convergence',
          weightPercentage: 40,
          description: 'Implementation mathematically satisfies Sheaf-ADMM consensus constraints and converges reliably.'
        },
        {
          id: 'crit-architecture',
          title: 'Code Structure & Modular Separation',
          weightPercentage: 30,
          description: 'Code is cleanly modularized into restriction maps, updates, and orchestration scripts.'
        },
        {
          id: 'crit-resilience',
          title: 'Fault Tolerance & Engineering Analysis',
          weightPercentage: 30,
          description: 'Report accurately analyzes link drop resilience and provides sound topological insights.'
        }
      ]
    }
  },
  {
    id: 'sim-enterprise-rag-pipeline',
    courseId: 'course-ai-agentic-systems',
    courseTitle: 'Enterprise RAG Architecture & Vector Indexing',
    title: 'High-Throughput Enterprise RAG with Grounded Citations',
    description: 'Build a production-grade Retrieval-Augmented Generation (RAG) system with hybrid vector-keyword retrieval, hallucination guardrails, and automated citation verification.',
    domainRole: 'Lead AI Infrastructure Engineer',
    industryDomain: 'Enterprise Financial Intelligence',
    difficulty: 'Intermediate',
    estimatedHours: 3,
    xpReward: 400,
    scenario: `### Executive Scenario
You are the Lead AI Infrastructure Engineer at **FinTech Global Intelligence**. The investment research team needs a secure, zero-hallucination RAG platform to query thousands of 200+ page SEC 10-K financial filings and earnings transcripts.

Generic naive RAG pipelines return hallucinated numbers or miss vital tabular financial notes. Your mission is to build a **Hybrid Vector + BM25 Retrieval Engine** equipped with **topological citation verification** and **strict source grounding**.

### Engineering Requirements
1. Semantic Document Chunking with metadata tracking (Page Number, Section, Document ID).
2. Hybrid Dense + Sparse Retrieval with Reciprocal Rank Fusion (RRF).
3. Automated Hallucination Verification pipeline that checks generated claims against retrieved context chunks before returning to the user.`,
    systemArchitectureOverview: `\`\`\`
[10-K PDFs / Documents] ---> [Hierarchical Chunking & Embedding] ---> [Vector DB + BM25 Index]
                                                                                |
[User Query] -------------> [Hybrid RRF Search Engine] <-----------------------+
                                   |
                          [Context Chunks + Query]
                                   |
                          [Gemini 3.7 Flash Model]
                                   |
                          [Draft Answer with Citations]
                                   |
                          [Grounding & Verification Guardrail]
                                   |
                          [Verified Output Response]
\`\`\``,
    prerequisites: [
      'Understanding of Vector Embeddings & Similarity Search',
      'Python/TypeScript API integrations',
      'Prompt Engineering & Guardrails'
    ],
    tasks: [
      {
        id: 'task-1-chunker',
        taskNumber: 1,
        title: 'Implement Hierarchical Semantic Chunking',
        description: `Implement \`chunk_financial_document(doc_text, doc_id, chunk_size=500, overlap=100)\` that splits text along logical markdown headers and paragraph breaks while maintaining parent section context metadata.`,
        requiredDeliverableType: 'code',
        targetFilename: 'document_chunker.py',
        starterTemplate: `import re

def chunk_financial_document(doc_text, doc_id="SEC_10K_2025", chunk_size=500, overlap=100):
    """
    Splits doc_text into semantic chunks with metadata.
    Returns: list of dicts [{ 'chunk_id': str, 'text': str, 'metadata': dict }]
    """
    paragraphs = doc_text.split('\\n\\n')
    chunks = []
    current_chunk = ""
    current_section = "General"
    
    for idx, p in enumerate(paragraphs):
        if p.startswith('#'):
            current_section = p.strip('#').strip()
            
        if len(current_chunk) + len(p) <= chunk_size:
            current_chunk += p + "\\n\\n"
        else:
            if current_chunk:
                chunks.append({
                    'chunk_id': f"{doc_id}_c{len(chunks)+1}",
                    'text': current_chunk.strip(),
                    'metadata': {
                        'doc_id': doc_id,
                        'section': current_section,
                        'char_count': len(current_chunk)
                    }
                })
            # Start new chunk with overlap
            current_chunk = p + "\\n\\n"
            
    if current_chunk:
        chunks.append({
            'chunk_id': f"{doc_id}_c{len(chunks)+1}",
            'text': current_chunk.strip(),
            'metadata': {
                'doc_id': doc_id,
                'section': current_section,
                'char_count': len(current_chunk)
            }
        })
        
    return chunks
`,
        validationCriteria: [
          'Preserves section metadata in chunk metadata dictionaries',
          'Enforces chunk size constraints without cutting sentences abruptly',
          'Generates unique deterministic chunk IDs for downstream vector indexing'
        ],
        hints: [
          'Ensure overlap preserves semantic boundary across chunk transitions',
          'Extract section headers starting with # or ITEM 1A'
        ]
      },
      {
        id: 'task-2-hybrid-retriever',
        taskNumber: 2,
        title: 'Build Hybrid Vector + BM25 Reciprocal Rank Fusion (RRF)',
        description: `Implement \`reciprocal_rank_fusion(vector_results, bm25_results, k=60)\` combining dense vector search scores and sparse BM25 keyword rankings.`,
        requiredDeliverableType: 'code',
        targetFilename: 'hybrid_retriever.py',
        starterTemplate: `def reciprocal_rank_fusion(vector_results, bm25_results, k=60):
    """
    vector_results: list of chunk_ids ordered by vector similarity score
    bm25_results: list of chunk_ids ordered by BM25 keyword score
    Returns: list of (chunk_id, rrf_score) sorted in descending order
    """
    rrf_scores = {}
    
    # Process vector rankings
    for rank, chunk_id in enumerate(vector_results):
        if chunk_id not in rrf_scores:
            rrf_scores[chunk_id] = 0.0
        rrf_scores[chunk_id] += 1.0 / (k + rank + 1)
        
    # Process BM25 rankings
    for rank, chunk_id in enumerate(bm25_results):
        if chunk_id not in rrf_scores:
            rrf_scores[chunk_id] = 0.0
        rrf_scores[chunk_id] += 1.0 / (k + rank + 1)
        
    # Sort by score descending
    sorted_ranks = sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)
    return sorted_ranks
`,
        validationCriteria: [
          'Correctly applies 1.0 / (k + rank) formula to both vector and BM25 candidate sets',
          'Handles overlapping and non-overlapping candidate chunks seamlessly',
          'Returns sorted list with highest combined relevance score at top'
        ],
        hints: [
          'Default k value 60 is standard in information retrieval research literature',
          'Check that highest RRF score corresponds to rank 0'
        ]
      },
      {
        id: 'task-3-grounding-verifier',
        taskNumber: 3,
        title: 'Implement Source Citation & Hallucination Guardrail',
        description: `Write \`verify_rag_citations(draft_answer, retrieved_chunks)\` that verifies whether facts cited in draft_answer are explicitly grounded in the retrieved context chunks.`,
        requiredDeliverableType: 'code',
        targetFilename: 'citation_verifier.py',
        starterTemplate: `def verify_rag_citations(draft_answer, retrieved_chunks):
    """
    Verifies draft answer citations against retrieved context.
    Returns dict: { 'is_verified': bool, 'verified_citations': list, 'unsupported_claims': list }
    """
    # TODO: Perform sentence tokenization and match keywords/numerical claims against chunks
    context_blob = " ".join([c['text'] for c in retrieved_chunks]).lower()
    
    unsupported = []
    verified = []
    
    # Simple verification logic checking key numbers and facts
    sentences = [s.strip() for s in draft_answer.split('.') if s.strip()]
    for s in sentences:
        # Check if numbers in sentence exist in context_blob
        numbers = [word for word in s.split() if any(char.isdigit() for char in word)]
        num_found = all(num.strip(',$%') in context_blob for num in numbers)
        
        if num_found or len(numbers) == 0:
            verified.append(s)
        else:
            unsupported.append(s)
            
    is_verified = len(unsupported) == 0
    return {
        'is_verified': is_verified,
        'verified_citations': verified,
        'unsupported_claims': unsupported
    }
`,
        validationCriteria: [
          'Identifies numerical hallucinated claims not present in retrieved context',
          'Returns detailed breakdown of verified vs unsupported claim sentences',
          'Triggers revision block when unverified claims are detected'
        ],
        hints: [
          'Pay special attention to financial values like revenue percentages and dollar amounts',
          'If a claim is not grounded in context_blob, flag it in unsupported_claims'
        ]
      }
    ],
    starterAssets: {
      starterCode: {
        'rag_pipeline.py': `# RAG Pipeline Orchestrator
from document_chunker import chunk_financial_document
from hybrid_retriever import reciprocal_rank_fusion
from citation_verifier import verify_rag_citations

doc_sample = """# SEC 10-K FILING - FINTECH GLOBAL INC (2025)

## ITEM 7: MANAGEMENT'S DISCUSSION AND ANALYSIS

In fiscal year 2025, consolidated revenue reached $4.25 billion, representing a 18.5% year-over-year increase compared to $3.58 billion in 2024. Cloud subscription recurring revenue accounted for 72% of total net sales.

Operational expenses increased by 8.2% to $1.12 billion, primarily driven by expanding R&D investments in autonomous AI platform infrastructure and GPU cluster deployments."""

chunks = chunk_financial_document(doc_sample)
print(f"Document processed into {len(chunks)} chunks.")
`
      },
      dataFiles: {
        'sample_sec_10k.json': JSON.stringify({
          company: 'FinTech Global Inc',
          year: 2025,
          sections: [
            { title: 'Item 1. Business', text: 'FinTech Global provides AI-driven financial platforms...' },
            { title: 'Item 7. MD&A', text: 'Consolidated revenue reached $4.25 billion in 2025...' }
          ]
        }, null, 2)
      },
      configYaml: `rag_config:
  embedding_model: "gemini-embedding-2"
  vector_dimension: 1536
  hybrid_search:
    top_k_vector: 20
    top_k_bm25: 20
    rrf_k_constant: 60
  hallucination_threshold: 0.95
`
    },
    rubric: {
      criteria: [
        {
          id: 'crit-chunking',
          title: 'Semantic Document Chunking',
          weightPercentage: 30,
          description: 'Document chunker preserves hierarchy, context metadata, and logical boundaries.'
        },
        {
          id: 'crit-hybrid-search',
          title: 'Hybrid RRF Search Accuracy',
          weightPercentage: 35,
          description: 'Reciprocal Rank Fusion correctly weights vector and keyword candidates.'
        },
        {
          id: 'crit-verification',
          title: 'Citation Verification & Hallucination Guardrail',
          weightPercentage: 35,
          description: 'Verification module catches unsupported numerical claims and enforces strict grounding.'
        }
      ]
    }
  },
  {
    id: 'sim-quantum-safe-banking',
    courseId: 'course-quantum-computing',
    courseTitle: 'Quantum Computing & Post-Quantum Cryptography',
    title: 'Post-Quantum TLS 1.3 Key Exchange & Security Audit',
    description: 'Audit legacy RSA-4096 banking endpoints and implement a lattice-based Kyber-768 quantum-safe key exchange mechanism.',
    domainRole: 'Chief Quantum Security Officer',
    industryDomain: 'Quantum-Safe Banking & Cyber Resilience',
    difficulty: 'Expert',
    estimatedHours: 5,
    xpReward: 600,
    scenario: `### Executive Scenario
You are the Chief Quantum Security Officer at **Global Interbank Clearing Network**. With quantum computers rapidly scaling toward Shor's algorithm threat thresholds, your executive board has mandated that all SWIFT transaction gateways migrate to **NIST Post-Quantum Cryptography (PQC) standards**.

You must inspect legacy RSA/ECC endpoints, implement **Kyber-768 (ML-KEM)** key encapsulation, and design a hybrid classical-quantum handshake protocol.`,
    systemArchitectureOverview: `\`\`\`
[Client Application]                                    [Bank Transaction Gateway]
         |                                                       |
         |----- 1. ClientHello (Kyber-768 Public Key + ECDH) --->|
         |                                                       | [Generate Shared Secret]
         |<---- 2. ServerHello (Kyber Ciphertext + ECDH) --------|
         |                                                       |
 [Decrypt Kyber Ciphertext]                                      |
         |                                                       |
         +==== 3. Encrypted Quantum-Safe TLS Session (AES-256) ===+
\`\`\``,
    prerequisites: [
      'Post-Quantum Cryptography fundamentals (Lattice-based cryptography)',
      'TLS 1.3 Handshake mechanics',
      'Python cryptography libraries'
    ],
    tasks: [
      {
        id: 'task-1-vulnerability-audit',
        taskNumber: 1,
        title: 'Audit Classical RSA-4096 Vulnerability',
        description: `Write a threat assessment function \`assess_rsa_quantum_vulnerability(key_size_bits=4096)\` calculating physical qubit requirements under Shor's algorithm and estimating time-to-compromise.`,
        requiredDeliverableType: 'code',
        targetFilename: 'quantum_audit.py',
        starterTemplate: `def assess_rsa_quantum_vulnerability(key_size_bits=4096):
    """
    Estimates Shor's algorithm logical and physical qubit requirements for breaking RSA.
    Returns dict: { 'logical_qubits_required': int, 'physical_qubits_estimated': int, 'risk_level': str }
    """
    # Shor's algorithm for RSA requires ~ 2 * n logical qubits where n is bit size
    logical_qubits = 2 * key_size_bits
    
    # Assuming surface code error correction overhead ~ 1000 physical qubits per logical qubit
    physical_qubits = logical_qubits * 1000
    
    risk_level = "CRITICAL_MIGRATION_REQUIRED" if physical_qubits <= 10000000 else "EVALUATING"
    
    return {
        'key_size_bits': key_size_bits,
        'logical_qubits_required': logical_qubits,
        'physical_qubits_estimated': physical_qubits,
        'risk_level': risk_level,
        'recommended_pqc_standard': 'ML-KEM (Kyber-768)'
    }
`,
        validationCriteria: [
          'Calculates logical qubit requirement using 2*N formulation',
          'Applies realistic error-correction overhead estimation for physical qubits',
          'Flags RSA-4096 as vulnerable to harvest-now-decrypt-later quantum attacks'
        ],
        hints: [
          'Logical qubits = 2 * bit_size',
          'Physical qubits factor in surface code error correction overhead (approx 1,000 to 2,000x)'
        ]
      },
      {
        id: 'task-2-kyber-kem',
        taskNumber: 2,
        title: 'Implement Hybrid Kyber-768 KEM Handshake Wrapper',
        description: `Implement \`hybrid_pqc_key_exchange(client_pqc_pubkey, client_ecdh_pubkey)\` generating a combined session key derived from both Kyber-768 and X25519 ECDH secrets using HKDF-SHA256.`,
        requiredDeliverableType: 'code',
        targetFilename: 'hybrid_pqc_kem.py',
        starterTemplate: `import hashlib

def hybrid_pqc_key_exchange(pqc_shared_secret: bytes, ecdh_shared_secret: bytes) -> bytes:
    """
    Combines PQC (Kyber-768) and classical (ECDH) shared secrets using HKDF-SHA256.
    Returns: 32-byte final symmetric session key.
    """
    combined_secret = pqc_shared_secret + ecdh_shared_secret
    
    # Derive master session key using SHA-256 HKDF expansion
    session_key = hashlib.sha256(b"PQC_HYBRID_TLS13_SALT_" + combined_secret).digest()
    return session_key
`,
        validationCriteria: [
          'Successfully concatenates PQC secret and classical ECDH secret',
          'Uses cryptographic hash KDF (SHA-256) to derive 32-byte (256-bit) key',
          'Ensures secret symmetry across both client and server handshake endpoints'
        ],
        hints: [
          'Hybrid key exchange protects against both classical compromises and future quantum decryption',
          'Final session key must be exactly 32 bytes for AES-256-GCM session encryption'
        ]
      }
    ],
    starterAssets: {
      starterCode: {
        'pqc_gateway.py': `# SWIFT PQC Gateway Test
from quantum_audit import assess_rsa_quantum_vulnerability
from hybrid_pqc_kem import hybrid_pqc_key_exchange
import os

print("=== SWIFT Quantum Security Audit ===")
audit = assess_rsa_quantum_vulnerability(4096)
print(f"Risk Level: {audit['risk_level']}")
print(f"Physical Qubits Required to Compromise RSA-4096: {audit['physical_qubits_estimated']:,}")

fake_pqc_secret = os.urandom(32)
fake_ecdh_secret = os.urandom(32)
master_key = hybrid_pqc_key_exchange(fake_pqc_secret, fake_ecdh_secret)
print(f"Derived Hybrid Quantum-Safe Session Key: {master_key.hex()}")
`
      },
      dataFiles: {},
      configYaml: `pqc_config:
  standard: "NIST FIPS 203 (ML-KEM)"
  parameter_set: "Kyber-768"
  classical_fallback: "X25519"
  hkdf_hash: "SHA256"
`
    },
    rubric: {
      criteria: [
        {
          id: 'crit-audit',
          title: 'Quantum Threat Modeling',
          weightPercentage: 40,
          description: 'Accurately quantifies qubit thresholds and Shor algorithm attack vectors.'
        },
        {
          id: 'crit-kem',
          title: 'Hybrid Cryptographic Handshake',
          weightPercentage: 60,
          description: 'Correctly implements PQC + ECDH key derivation and entropy aggregation.'
        }
      ]
    }
  }
];
