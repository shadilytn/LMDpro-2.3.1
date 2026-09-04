import { Course, Module } from '../shared/types';

export interface LearningPathPhase {
  phase: string;
  title: string;
  description: string;
  durationMonths: number;
  keyCompetencies: string[];
}

export interface DegreeTool {
  name: string;
  category: string;
  description: string;
}

export interface EducationalMaterial {
  type: 'Textbook' | 'Research Paper' | 'Interactive Sandbox' | 'Dataset' | 'Open Source Spec';
  title: string;
  authorOrSource: string;
  summary: string;
}

export interface CapstoneProject {
  title: string;
  summary: string;
  techStack: string[];
}

export interface DegreeMetadata {
  institution: string;
  degreeLevel: string;
  credits: number;
  tracks: string[];
  careerOutcomes: string[];
  accreditation: string;
  crawledSource: string;
  learningPath?: LearningPathPhase[];
  recommendedTools?: DegreeTool[];
  educationalMaterials?: EducationalMaterial[];
  capstoneProjects?: CapstoneProject[];
}

export interface DegreeCourse extends Course {
  degreeMetadata: DegreeMetadata;
}

// Key Academic Discipline Domains across Advanced Science, Engineering & AI Leadership
const DISCIPLINE_DOMAINS = [
  {
    category: 'Executive Leadership, Management & Organizational Systems',
    partner: 'Madepro Leadership Institute & Harvard Dataverse Lab',
    crawledSource: 'Madepro Leadership Board (Shady BA & Harvard Dataverse doi:10.7910/DVN/VUT1T2)',
    topics: [
      { name: 'M.S. in Executive Leadership & Adaptive Management Systems', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Strategic Leadership & High-Reliability Operations', level: 'Bachelor of Science (B.S.)' },
      { name: 'Ph.D. in Quantitative Leadership Metrics & Decision Architecture', level: 'Ph.D. Doctorate' },
      { name: 'M.S. in High-Reliability Organizing (HRO) & Industrial Safety Management', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Lean Management, Operational Excellence & Kaizen Systems', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Executive Decision Science & Bayesian Cognitive De-Biasing', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Organizational Psychology, Psychological Safety & Team Architecture', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Digital Transformation & Agentic AI Leadership', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Performance Engineering, OKR Strategy & Value-Stream KPIs', level: 'Bachelor of Science (B.S.)' },
      { name: 'Post-Doc Fellowship in Empirical Leadership & Organization Analytics', level: 'Post-Doctoral Research' },
    ]
  },
  {
    category: 'Autonomous & Cognitive Systems',
    partner: 'LMDpro Systems Faculty',
    crawledSource: 'LMDpro Academic Board',
    topics: [
      { name: 'M.S. in Autonomous Multi-Agent Swarms & Antigravity Reasoning', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Applied Machine Learning & Agentic Systems', level: 'Bachelor of Science (B.S.)' },
      { name: 'Ph.D. in Deep Neural Architectures & Cognitive Foundations', level: 'Ph.D. Doctorate' },
      { name: 'M.S. in Deep Neural Architectures & Transformer Engineering', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Cognitive Computer Vision & Spatial Computing', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Generative Systems & Large Multimodal Models', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Natural Language Processing & Semantic Search', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Embodied Robotics & Humanoid Intelligence', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Reinforcement Learning & Autonomous Control', level: 'Bachelor of Science (B.S.)' },
      { name: 'Post-Doc Fellowship in Neuromorphic Computing & Spiking Neural Networks', level: 'Post-Doctoral Research' },
    ]
  },
  {
    category: 'Cloud Engineering & Distributed Systems',
    partner: 'LMDpro Systems Institute',
    crawledSource: 'LMDpro Academic Board',
    topics: [
      { name: 'M.S. in Cloud Architecture & Serverless Microservices', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Cloud Infrastructure & Systems Engineering', level: 'Bachelor of Science (B.S.)' },
      { name: 'Ph.D. in High-Throughput Distributed Database Theory', level: 'Ph.D. Doctorate' },
      { name: 'M.S. in Distributed Systems & Resilient Database Engineering', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in DevOps, CI/CD Pipelines & Site Reliability Engineering', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Multi-Cloud Native Architecture & Kubernetes', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Linux Systems Programming & Virtualization', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Edge Cloud Computing & IoT Mesh Systems', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Network Infrastructure & Cloud Communications', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Platform Engineering & Infrastructure as Code', level: 'Master of Science (M.S.)' },
    ]
  },
  {
    category: 'Cybersecurity, Cryptography & Defense',
    partner: 'LMDpro Security Lab',
    crawledSource: 'LMDpro Academic Board',
    topics: [
      { name: 'M.S. in Post-Quantum Cryptography & Zero-Trust Security', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Cybersecurity Operations & Threat Intelligence', level: 'Bachelor of Science (B.S.)' },
      { name: 'Ph.D. in Cryptographic Verification & Zero-Knowledge Proofs', level: 'Ph.D. Doctorate' },
      { name: 'M.S. in Offensive Cyber Operations & Penetration Testing', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Digital Forensics & Incident Response Engineering', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Cloud Security Architecture & DevSecOps', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Network Security & Intrusion Detection Systems', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Blockchain Security & Smart Contract Auditing', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Identity Management & Access Control Systems', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in AI Security, Adversarial Robustness & Safety', level: 'Master of Science (M.S.)' },
    ]
  },
  {
    category: 'Data Science, Analytics & Big Data',
    partner: 'LMDpro Data Science Center',
    crawledSource: 'LMDpro Academic Board',
    topics: [
      { name: 'M.S. in Enterprise Data Science & Predictive Analytics', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Data Analytics & Quantitative Decision Making', level: 'Bachelor of Science (B.S.)' },
      { name: 'Ph.D. in Causal Inference & Large-Scale Machine Learning', level: 'Ph.D. Doctorate' },
      { name: 'M.S. in Big Data Engineering & Real-Time Stream Processing', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Applied Statistics & Business Intelligence', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Causal Inference & Machine Learning Experiments', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Data Visualization & Storytelling Engineering', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Spatial Data Analytics & Geographic Information Systems', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Data Governance, Ethics & Privacy Engineering', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Graph Neural Networks & Complex Data Mining', level: 'Master of Science (M.S.)' },
    ]
  },
  {
    category: 'Full-Stack Software Engineering',
    partner: 'LMDpro Engineering Academy',
    crawledSource: 'LMDpro Academic Board',
    topics: [
      { name: 'M.S. in Modern Full-Stack Systems & High-Velocity Architecture', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Software Engineering & Web Application Development', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Mobile Operating Systems & Cross-Platform Engineering', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Front-End Engineering & Advanced UI/UX Frameworks', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Microservices, GraphQL & Event-Driven APIs', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Back-End Engineering with Node.js, Go & Rust', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Software Testing, Automation & Formal Verification', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Human-Computer Interaction & Interactive Design', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Progressive Web Apps & WebAssembly Engineering', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Object-Oriented Design & Clean Code Architecture', level: 'Bachelor of Science (B.S.)' },
    ]
  },
  {
    category: 'Robotics, Embodied AI & IoT',
    partner: 'LMDpro Robotics Institute',
    crawledSource: 'LMDpro Academic Board',
    topics: [
      { name: 'M.S. in Embodied Robotics & Autonomous Navigation (SLAM)', level: 'Master of Engineering (M.Eng.)' },
      { name: 'B.S. in Mechatronics & Robotics Systems Engineering', level: 'Bachelor of Engineering (B.Eng.)' },
      { name: 'Ph.D. in Kinematic Control & Humanoid Bipedal Dynamics', level: 'Ph.D. Doctorate' },
      { name: 'M.S. in Industrial Automation & Physical AI Twin Systems', level: 'Master of Engineering (M.Eng.)' },
      { name: 'B.S. in IoT Hardware Engineering & Embedded Sensors', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Drone Flight Dynamics & Autonomous Aerial Swarms', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Microcontroller Programming & RTOS Engineering', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Robotic Perception, Lidar & Sensor Fusion', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Computer Integrated Manufacturing & CAD Automation', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Bionic Prosthetics & Neural Engineering Interfaces', level: 'Master of Science (M.S.)' },
    ]
  },
  {
    category: 'Quantum Computing & Theoretical Physics',
    partner: 'LMDpro Quantum Center',
    crawledSource: 'LMDpro Academic Board',
    topics: [
      { name: 'M.S. in Quantum Information Science & Quantum Algorithms', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Quantum Physics & Computational Mechanics', level: 'Bachelor of Science (B.S.)' },
      { name: 'Ph.D. in Fault-Tolerant Quantum Error Correction', level: 'Ph.D. Doctorate' },
      { name: 'M.S. in Quantum Hardware, Qubits & Cryogenic Systems', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Applied Mathematics & Quantum Computing Basics', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Quantum Error Correction & Fault-Tolerant AI', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Mathematical Physics & Linear Algebra Systems', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Quantum Cryptography & Key Distribution Networks', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in High-Energy Physics & Particle Simulations', level: 'Bachelor of Science (B.S.)' },
      { name: 'Post-Doc Fellowship in Quantum Tensor Networks & Topological Physics', level: 'Post-Doctoral Research' },
    ]
  },
  {
    category: 'FinTech, Blockchain & Quantitative Finance',
    partner: 'LMDpro Finance & Tech Institute',
    crawledSource: 'LMDpro Academic Board',
    topics: [
      { name: 'M.S. in Quantitative Finance & Algorithmic Trading Engines', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Financial Engineering & Risk Analytics', level: 'Bachelor of Science (B.S.)' },
      { name: 'Ph.D. in Stochastic Volatility & High-Frequency Market Microstructure', level: 'Ph.D. Doctorate' },
      { name: 'M.S. in Decentralized Finance (DeFi) & Smart Contracts', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Blockchain Development & Distributed Ledgers', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Computational Financial Modeling & Stochastic Calculi', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in FinTech Product Architecture & Digital Payments', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in High-Frequency Trading & Market Microstructure', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Corporate Financial Analytics & Portfolio Science', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in AI in Asset Management & Automated Risk Control', level: 'Master of Science (M.S.)' },
    ]
  },
  {
    category: 'Bioinformatics & Digital Healthcare Technology',
    partner: 'LMDpro Health Technology Faculty',
    crawledSource: 'LMDpro Academic Board',
    topics: [
      { name: 'M.S. in Computational Biology & Genomic Data Science', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Health Informatics & Electronic Medical Records', level: 'Bachelor of Science (B.S.)' },
      { name: 'Ph.D. in Generative AI for Molecular Protein Folding', level: 'Ph.D. Doctorate' },
      { name: 'M.S. in AI Medical Imaging & Diagnostic Computer Vision', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Digital Health Technologies & Wearable Devices', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Drug Discovery with Generative AI & Protein Folding', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Biomedical Engineering Systems & Signal Analysis', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Precision Medicine & Clinical Trial Data Science', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Medical Software Compliance & HIPAA Security', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Neuroscience & Brain-Computer Interface Systems', level: 'Master of Science (M.S.)' },
    ]
  },
  {
    category: 'AI Product Leadership & Digital Business',
    partner: 'LMDpro School of Management',
    crawledSource: 'LMDpro Academic Board',
    topics: [
      { name: 'M.S. in AI Product Management & Enterprise Strategy', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Business Information Systems & Digital Leadership', level: 'Bachelor of Science (B.S.)' },
      { name: 'Ph.D. in Technological Disruption & Global Innovation Governance', level: 'Ph.D. Doctorate' },
      { name: 'M.S. in Technology Operations & Digital Transformation', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Agility, Scrum & Product Lifecycle Engineering', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Tech Entrepreneurship & Venture Architecture', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in E-Commerce Engineering & Growth Analytics', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in AI Ethics, Technology Governance & Policy', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Digital Marketing Analytics & MarTech Systems', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Supply Chain Optimization & AI Logistics', level: 'Master of Science (M.S.)' },
    ]
  },
  {
    category: 'Space Systems, Aerospace & Orbital Mechanics',
    partner: 'LMDpro Aerospace Institute',
    crawledSource: 'LMDpro Academic Board',
    topics: [
      { name: 'M.S. in Orbital Mechanics & Space Mission Systems', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Aerospace Systems & Propulsion Engineering', level: 'Bachelor of Engineering (B.Eng.)' },
      { name: 'M.S. in Satellite Constellations & CubeSat Telemetry', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Spacecraft Avionics & Flight Control Software', level: 'Bachelor of Science (B.S.)' },
      { name: 'Ph.D. in Autonomous Deep Space Navigation & Guidance Systems', level: 'Ph.D. Doctorate' },
      { name: 'M.S. in Rocket Propulsion & Combustion Dynamics', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Atmospheric Aerodynamics & Hypersonic Systems', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Space Environment Engineering & Thermal Control', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Remote Sensing & Earth Observation Analytics', level: 'Bachelor of Science (B.S.)' },
      { name: 'Post-Doc Fellowship in Interplanetary Trajectory Optimization', level: 'Post-Doctoral Research' },
    ]
  },
  {
    category: 'Renewable Energy & Climate Engineering',
    partner: 'LMDpro Sustainability Faculty',
    crawledSource: 'LMDpro Academic Board',
    topics: [
      { name: 'M.S. in Smart Grid Architecture & Energy Storage Systems', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Sustainable Energy Engineering & Solar Photovoltaics', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Hydrogen Fuel Cells & Clean Energy Technology', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Wind Turbine Aerodynamics & Off-Grid Networks', level: 'Bachelor of Science (B.S.)' },
      { name: 'Ph.D. in Computational Climate Modeling & Carbon Capture', level: 'Ph.D. Doctorate' },
      { name: 'M.S. in Environmental Data Analytics & Resource Optimization', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Electric Vehicle Infrastructure & Battery Systems', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Circular Economy & Life Cycle Assessment Systems', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Green Building Automation & Energy Auditing', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Hydroelectric Systems & Geo-Thermal Engineering', level: 'Master of Science (M.S.)' },
    ]
  },
  {
    category: 'Hardware Systems, VLSI & Semiconductor Engineering',
    partner: 'LMDpro Semiconductor Lab',
    crawledSource: 'LMDpro Academic Board',
    topics: [
      { name: 'M.S. in VLSI Circuit Design & Hardware Accelerator Architecture', level: 'Master of Engineering (M.Eng.)' },
      { name: 'B.S. in Microelectronics & Semiconductor Fabrication', level: 'Bachelor of Engineering (B.Eng.)' },
      { name: 'M.S. in FPGA Design, Verilog & Digital System Synthesis', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Embedded Electronics & Printed Circuit Board Design', level: 'Bachelor of Science (B.S.)' },
      { name: 'Ph.D. in Sub-Nanometer Transistor Physics & Lithography', level: 'Ph.D. Doctorate' },
      { name: 'M.S. in Computer Architecture & RISC-V Processor Design', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Electronic Signal Processing & System-on-Chip (SoC)', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Hardware Trojan Detection & Cryptographic Chips', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Sensor Instrumentation & Precision Analog Design', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Photonic Chips & Optical Semiconductor Interconnects', level: 'Master of Science (M.S.)' },
    ]
  },
  {
    category: 'Spatial Computing, AR/VR & Game Engine Architecture',
    partner: 'LMDpro Media & Simulation Institute',
    crawledSource: 'LMDpro Academic Board',
    topics: [
      { name: 'M.S. in Spatial Computing & Mixed Reality (AR/VR) Engineering', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Game Engine Architecture & Real-Time Graphics', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Shader Programming, Ray Tracing & GPU Optimization', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in 3D Modeling, Rigging & Interactive Simulation', level: 'Bachelor of Science (B.S.)' },
      { name: 'Ph.D. in Neural Radiance Fields (NeRFs) & 3D Gaussian Splatting', level: 'Ph.D. Doctorate' },
      { name: 'M.S. in Virtual Simulation & Metaverse World Architecture', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Interactive Audio Synthesis & Spatial Sound Design', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Physics Engine Development & Rigid Body Simulation', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Computer Graphics & WebGL Engine Engineering', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Haptic Feedback Interfaces & Motion Tracking', level: 'Master of Science (M.S.)' },
    ]
  },
  {
    category: 'Autonomous Cybernetics & Systems Biology',
    partner: 'LMDpro Complex Systems Lab',
    crawledSource: 'LMDpro Academic Board',
    topics: [
      { name: 'M.S. in Complex Adaptive Systems & Cybernetic Control', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Systems Biology & Metabolic Network Modeling', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Synthetic Biology & Genetic Circuit Engineering', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Biomathematics & Nonlinear Dynamical Systems', level: 'Bachelor of Science (B.S.)' },
      { name: 'Ph.D. in Cellular Automata & Swarm Cybernetics Theory', level: 'Ph.D. Doctorate' },
      { name: 'M.S. in Bio-Inspired Computation & Molecular Algorithms', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Bio-Mechatronics & Soft Robotics Engineering', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Ecological Modeling & Ecosystem Cybernetics', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Biostatistics & Public Health Informatics', level: 'Bachelor of Science (B.S.)' },
      { name: 'Post-Doc Fellowship in Synthetic Genomes & Cellular Computing', level: 'Post-Doctoral Research' },
    ]
  },
  {
    category: 'Occupational Health, Industrial Safety & Workplace Engineering',
    partner: 'LMDpro Industrial Safety Institute (OSHA/NEBOSH Aligned)',
    crawledSource: 'LMDpro Academic Board',
    topics: [
      { name: 'M.S. in Industrial Safety Engineering & Quantitative Risk Assessment', level: 'Master of Engineering (M.Eng.)' },
      { name: 'B.S. in Occupational Health & Safety Management (OSHA/ISO 45001)', level: 'Bachelor of Science (B.S.)' },
      { name: 'Ph.D. in Ergonomic Systems, Human Factors & Disaster Resilience', level: 'Ph.D. Doctorate' },
      { name: 'M.S. in Hazardous Materials, Process Safety & Chemical Defense', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Fire Protection Engineering & Emergency Evacuation Dynamics', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Electrical Safety, Arc Flash Analysis & LOTO Protocols', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Construction Safety Management & Structural Hazard Mitigation', level: 'Bachelor of Science (B.S.)' },
      { name: 'M.S. in Machine Guarding, Robotics Safety & Industrial Automation Safeguards', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Environmental Hygiene & Workplace Toxicology', level: 'Bachelor of Science (B.S.)' },
      { name: 'Executive Diploma in Industrial Safety Leadership & Regulatory Compliance', level: 'Professional Diploma' },
    ]
  },
  {
    category: 'Biomedical Robotics, Neural Prosthetics & Bionics',
    partner: 'LMDpro Bioengineering & Neural Systems Lab',
    crawledSource: 'LMDpro Academic Board',
    topics: [
      { name: 'M.S. in Neural Engineering & Brain-Computer Interfaces (BCI)', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Biomedical Robotics & Assistive Exoskeleton Engineering', level: 'Bachelor of Engineering (B.Eng.)' },
      { name: 'Ph.D. in Bioelectronic Medicine & Neuromodulation Systems', level: 'Ph.D. Doctorate' },
      { name: 'M.S. in Bionic Limbs, Sensory Feedback & Myoelectric Control', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Biomechanical Instrumentation & Implantable Microdevices', level: 'Bachelor of Science (B.S.)' },
    ]
  },
  {
    category: 'AI Ethics, Algorithmic Governance & Global Tech Law',
    partner: 'LMDpro Institute of AI Governance & Policy',
    crawledSource: 'LMDpro Academic Board',
    topics: [
      { name: 'M.S. in AI Governance, Algorithmic Auditing & Alignment', level: 'Master of Science (M.S.)' },
      { name: 'B.S. in Digital Sovereignty, Tech Ethics & Cyber Law', level: 'Bachelor of Science (B.S.)' },
      { name: 'Ph.D. in Sociotechnical AI Safety & Global Regulatory Policy', level: 'Ph.D. Doctorate' },
      { name: 'M.S. in Explainable AI (XAI) & Fairness-Aware Machine Learning', level: 'Master of Science (M.S.)' },
      { name: 'Executive Master in Enterprise AI Compliance (EU AI Act & NIST)', level: 'Executive Master' },
    ]
  },
  {
    category: 'Marine Autonomous Systems & Oceanographic Engineering',
    partner: 'LMDpro Marine Robotics & Ocean Observation Lab',
    crawledSource: 'LMDpro Academic Board',
    topics: [
      { name: 'M.S. in Autonomous Underwater Vehicles (AUVs) & Ocean Robotics', level: 'Master of Engineering (M.Eng.)' },
      { name: 'B.S. in Marine Cybernetics & Subsea Sensor Networks', level: 'Bachelor of Engineering (B.Eng.)' },
      { name: 'M.S. in Hydrodynamic Control & Oceanic Climate Monitoring Swarms', level: 'Master of Science (M.S.)' },
    ]
  }
];

const COVER_IMAGES = [
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  ''
];

function generateDegreeModules(programName: string, category: string): Module[] {
  const cleanTitle = programName.replace(/(M\.S\.|B\.S\.|M\.Eng\.|B\.Eng\.|Ph\.D\.|Post-Doc Fellowship) in /, '');
  const isQuantum = category.includes('Quantum');
  const isAI = category.includes('Autonomous') || category.includes('Cognitive') || category.includes('Machine Learning');
  const isCyber = category.includes('Cybersecurity') || category.includes('Cryptography');
  const isCloud = category.includes('Cloud') || category.includes('Distributed');
  const isData = category.includes('Data Science');
  const isBio = category.includes('Bioinformatics') || category.includes('Healthcare');
  const isRobotics = category.includes('Robotics') || category.includes('Mechatronics');
  const isAerospace = category.includes('Space') || category.includes('Aerospace');
  const isEnergy = category.includes('Renewable') || category.includes('Energy');
  const isFinTech = category.includes('FinTech') || category.includes('Finance');

  return [
    {
      id: `mod-core-1`,
      title: `Module 1: Foundations & Theoretical Paradigm of ${cleanTitle}`,
      description: `Rigorous academic and mathematical principles underlying ${cleanTitle}. Formulation of state spaces, foundational theorems, and baseline computational models.`,
      lessons: [
        {
          id: `les-1-1`,
          title: `Theoretical Foundations & Formal Problem Specification`,
          durationMinutes: 45,
          content: `### 1. Abstract & Scope
This foundational class establishes the mathematical and conceptual architecture of **${cleanTitle}**. We examine the governing analytical frameworks, deterministic constraints, and modern methodologies.

### 2. Core Theorems & Formal Representation
${isQuantum 
  ? 'We formulate state spaces using Dirac notation $|\\psi\\rangle \\in \\mathcal{H}$, density matrices $\\rho = \\sum_i p_i |\\psi_i\\rangle\\langle\\psi_i|$, unitary evolutions $U^\\dagger U = I$, and Hilbert space projective measurements.' 
  : isAI 
  ? 'We formulate cognitive agents as Markov Decision Processes (MDP) $(S, A, P, R, \\gamma)$, cellular sheaf consensus loops, and differentiable belief graphs.'
  : isCyber 
  ? 'We examine lattice-based cryptography, Ring Learning With Errors (Ring-LWE), zero-knowledge SNARK proof systems, and mathematical hardness assumptions.'
  : isBio 
  ? 'We model biological sequence alignment via dynamic programming (Needleman-Wunsch, Smith-Waterman), Hidden Markov Models (HMMs), and 3D molecular topological graphs.'
  : isCloud 
  ? 'We analyze the CAP theorem, Raft/Paxos consensus state machines, vectorized clock trees, and Byzantine Fault Tolerance (BFT).'
  : 'We formalize systems modeling, parameter optimization, differential state dynamics, and computational complexity bounds.'}

### 3. Empirical Application & Laboratory Requirements
Students explore the standard toolchain, configure high-throughput simulation environments, and validate experimental hypotheses through code notebooks.`,
          keyTakeaways: [
            'Establish rigorous analytical foundations and formal domain specifications.',
            'Derive core mathematical models and state transformation operations.',
            'Validate theoretical bounds through computational test benches.'
          ],
          audioScript: `Welcome to Module 1 of ${cleanTitle}. In this lesson, we establish formal theoretical foundations, state space representations, and baseline computational models.`,
          quizzes: [
            {
              id: `q-1-1-1`,
              question: `Which fundamental principle governs the state representation in ${cleanTitle}?`,
              options: [
                'Formal mathematical abstraction coupled with deterministic state verification',
                'Unchecked heuristics without theoretical error bounds',
                'Arbitrary manual parameters with no empirical validation',
                'Static deprecated legacy specifications'
              ],
              correctAnswerIndex: 0,
              explanation: 'Graduate-level engineering requires rigorous mathematical modeling, formal abstraction, and reproducible verification.',
              hint: 'Look for formal mathematical rigor and verification.'
            },
            {
              id: `q-1-1-2`,
              question: `Why is formal proof verification critical before deploying production implementations?`,
              options: [
                'It guarantees safety bounds, prevents catastrophic failure modes, and certifies reliability',
                'It is only a cosmetic requirement for academic papers',
                'It slows down modern compilers without providing security',
                'It replaces all software testing entirely'
              ],
              correctAnswerIndex: 0,
              explanation: 'Formal verification guarantees that system invariants and safety boundaries hold across all possible operational edge cases.',
              hint: 'Ensures safety and invariant guarantees.'
            }
          ],
          flashcards: [
            {
              id: `fc-1-1`,
              front: `Core Mathematical Paradigm of ${cleanTitle}?`,
              back: 'Formal state space modeling, invariant verification, and rigorous algorithmic evaluation.'
            },
            {
              id: `fc-1-2`,
              front: 'Role of Empirical Test Benches?',
              back: 'Validating mathematical hypotheses against real-world telemetry, noise channels, and latency constraints.'
            }
          ]
        },
        {
          id: `les-1-2`,
          title: `Algorithmic Synthesis & Laboratory Computation`,
          durationMinutes: 50,
          content: `### Laboratory Implementation
In this hands-on laboratory class, students implement core algorithmic routines from scratch in high-performance runtimes (Python/C++/Rust/TypeScript).

### Key Benchmarking Vectors:
1. **Computational Complexity**: Measuring $\\mathcal{O}(N \\log N)$ asymptotic performance.
2. **Memory Stalk Allocation**: Optimizing cache locality and vectorization.
3. **Resilience**: Simulating adverse network and compute conditions.`,
          keyTakeaways: [
            'Construct executable prototypes from formal mathematical equations.',
            'Benchmark algorithmic complexity and memory efficiency.',
            'Deploy automated unit and integration tests.'
          ],
          audioScript: `In this laboratory session, we translate our mathematical formulations into performant, executable code and benchmark real-world performance metrics.`,
          quizzes: [
            {
              id: `q-1-2-1`,
              question: 'How do memory access patterns impact high-throughput computational throughput?',
              options: [
                'Sequential cache-aligned access drastically reduces cache misses and improves SIMD throughput',
                'Memory access speed has no effect on computational latency',
                'Random memory access is always faster than contiguous vectors',
                'Virtual memory completely eliminates hardware latency'
              ],
              correctAnswerIndex: 0,
              explanation: 'Contiguous, cache-friendly data structures maximize CPU/GPU cache line utilization and enable SIMD hardware acceleration.',
              hint: 'Cache locality and SIMD alignment.'
            }
          ],
          flashcards: [
            {
              id: `fc-1-3`,
              front: 'What is SIMD Vectorization?',
              back: 'Single Instruction, Multiple Data execution enabling parallel mathematical operations across hardware registers.'
            }
          ]
        }
      ]
    },
    {
      id: `mod-core-2`,
      title: `Module 2: Advanced Systems Architecture, Distributed Scaling & Optimization`,
      description: `High-degree system architectures, multi-agent consensus, fault tolerance, and production scaling benchmarks.`,
      lessons: [
        {
          id: `les-2-1`,
          title: `Distributed Consensus & High-Concurrency Architecture`,
          durationMinutes: 60,
          content: `### Distributed Systems Architecture
Analyzing decentralized node topologies, network partition tolerance, and high-throughput data pipelines in ${cleanTitle}.

### Architectural Pillars:
- **Consensus Protocols**: Differentiable consensus, Paxos/Raft, and Sheaf Laplacian diffusion.
- **Latency Optimization**: Zero-copy network transports and asynchronous event loops.
- **Fault Tolerance**: Automatic failover, distributed checkpointing, and idempotent retry semantics.`,
          keyTakeaways: [
            'Design scalable, fault-tolerant distributed pipelines.',
            'Apply mathematical consensus mechanisms across heterogeneous nodes.',
            'Analyze latency and throughput trade-offs under high concurrency.'
          ],
          audioScript: `In Module 2, we explore distributed systems design, fault tolerance, and high-concurrency optimization in ${cleanTitle}.`,
          quizzes: [
            {
              id: `q-2-1-1`,
              question: 'What is the primary trade-off when configuring distributed consensus mechanisms?',
              options: [
                'Balancing network latency and round-trip verification against consistency guarantees',
                'Sacrificing all data integrity for instantaneous responses',
                'Eliminating all memory usage by deleting historical logs',
                'Restricting execution to single-core hardware'
              ],
              correctAnswerIndex: 0,
              explanation: 'Distributed consensus balances message complexity and network latency against strong consistency and fault tolerance.',
              hint: 'Trade-off between latency and consistency.'
            }
          ],
          flashcards: [
            {
              id: `fc-2-1`,
              front: 'What is Byzantine Fault Tolerance (BFT)?',
              back: 'The ability of a distributed network to reach consensus even when certain nodes fail arbitrarily or transmit conflicting data.'
            }
          ]
        }
      ]
    },
    {
      id: `mod-capstone`,
      title: `Module 3: Degree Capstone, Comprehensive Examination & Academic Defense`,
      description: `Culminating degree thesis, comprehensive final examination, production codebase deployment, and oral defense before the LMD Academic Board.`,
      lessons: [
        {
          id: `les-3-1`,
          title: `Comprehensive Final Examination & Defense Evaluation`,
          durationMinutes: 90,
          content: `### Degree Defense Guidelines
The Capstone module requires candidates to synthesize all theoretical concepts, algorithmic implementations, and architectural principles developed throughout the degree program.

### Assessment Criteria:
1. **Theoretical Mastery**: Comprehensive multi-part academic evaluation.
2. **Production Demonstration**: Live deployment of a production-grade software artifact or empirical research repository.
3. **Oral Defense**: Rigorous Q&A addressing edge cases, scalability limitations, and future research trajectories.`,
          keyTakeaways: [
            'Demonstrate end-to-end domain mastery across theoretical and applied spectra.',
            'Deliver a verified, production-grade technical solution.',
            'Successfully defend engineering decisions before academic peers.'
          ],
          audioScript: `Welcome to the comprehensive degree capstone and defense session. Complete the final examination and prepare your technical project presentation.`,
          quizzes: [
            {
              id: `q-3-1-1`,
              question: `What distinguishes a rigorous Capstone engineering submission from an introductory project?`,
              options: [
                'Full end-to-end system architecture, formal testing, empirical benchmarks, and clear documentation',
                'A superficial mock UI with no backend or mathematical validation',
                'An unverified script without tests or error handling',
                'A single slide presentation with no working code'
              ],
              correctAnswerIndex: 0,
              explanation: 'An accredited Capstone requires end-to-end technical realization, automated test suites, empirical benchmarking, and comprehensive documentation.',
              hint: 'Complete system architecture and verifiable validation.'
            },
            {
              id: `q-3-1-2`,
              question: 'How should continuous telemetry and performance metrics be integrated in production systems?',
              options: [
                'By piping structured logging, latency metrics, and error rates to centralized dashboards with automated alert thresholds',
                'By ignoring runtime exceptions in production',
                'By writing all logs exclusively to temporary console output',
                'By disabling all monitoring tools to save CPU cycles'
              ],
              correctAnswerIndex: 0,
              explanation: 'Centralized telemetry, automated alerts, and structured logging ensure continuous observability and immediate remediation of system anomalies.',
              hint: 'Structured logging, observability, and automated alerting.'
            }
          ],
          flashcards: [
            {
              id: `fc-3-1`,
              front: 'Requirements for Degree Defense?',
              back: 'Operational codebase, research write-up with empirical metrics, and successful oral examination.'
            },
            {
              id: `fc-3-2`,
              front: 'Role of Continuous Observability?',
              back: 'Real-time monitoring of distributed nodes to detect latency anomalies, memory leaks, and consensus drift.'
            }
          ]
        }
      ]
    }
  ];
}

function generateLearningPath(topicName: string, category: string): LearningPathPhase[] {
  return [
    {
      phase: 'Phase 1: Core Fundamentals & Theory',
      title: `Mathematical & Theoretical Principles of ${category.split(' ')[0]}`,
      description: 'Establish foundational principles, formal logic, vector spaces, and domain fundamentals.',
      durationMonths: 4,
      keyCompetencies: ['Formal Logic', 'System Modeling', 'Domain Mathematics', 'Basic Prototyping']
    },
    {
      phase: 'Phase 2: Applied Engineering & System Design',
      title: `Advanced Architecture & Production Engineering`,
      description: 'Build enterprise-grade software implementations, performance benchmarks, and automated pipelines.',
      durationMonths: 6,
      keyCompetencies: ['Production Codebases', 'Distributed Workflows', 'Performance Optimization', 'CI/CD Automation']
    },
    {
      phase: 'Phase 3: Research Specialization & Capstone',
      title: `Academic Thesis, Industry Capstone & Defense`,
      description: 'Develop a novel project solution or research paper, presented before the LMD Academic Board.',
      durationMonths: 4,
      keyCompetencies: ['Peer Review', 'Technical Defense', 'Publication Standard Write-ups', 'System Integration']
    }
  ];
}

function generateTools(category: string): DegreeTool[] {
  const common = [
    { name: 'Git & GitHub', category: 'Version Control', description: 'Source code management, pull requests, and CI/CD actions.' },
    { name: 'Docker & Containers', category: 'Infrastructure', description: 'Isolated execution environments and deployment images.' },
    { name: 'VS Code & Web IDEs', category: 'Developer Tools', description: 'Cloud IDE workspaces and static code analysis.' }
  ];

  if (category.includes('Autonomous') || category.includes('Data') || category.includes('AI')) {
    return [
      ...common,
      { name: 'PyTorch & TensorFlow', category: 'AI Frameworks', description: 'Deep learning model training, GPU acceleration, and tensor operations.' },
      { name: 'Google GenAI SDK', category: 'LLM Orchestration', description: 'Gemini 3.1 Pro & 3.6 Flash API integrations and function calling.' },
      { name: 'Jupyter & Google Colab', category: 'Data Science', description: 'Interactive Python notebooks for mathematical experimentation.' }
    ];
  } else if (category.includes('Cloud') || category.includes('Security') || category.includes('Full-Stack')) {
    return [
      ...common,
      { name: 'Kubernetes & Helm', category: 'Orchestration', description: 'Container orchestration, auto-scaling, and cluster management.' },
      { name: 'PostgreSQL & Firestore', category: 'Database Systems', description: 'Relational SQL and cloud NoSQL database engines.' },
      { name: 'Node.js & Go / Rust', category: 'Backend Runtimes', description: 'High-performance microservices and server APIs.' }
    ];
  } else if (category.includes('Quantum') || category.includes('Physics') || category.includes('Robotics')) {
    return [
      ...common,
      { name: 'Qiskit & PennyLane', category: 'Quantum Simulation', description: 'Quantum circuit synthesis, error mitigation, and qubit execution.' },
      { name: 'ROS2 & Gazebo', category: 'Robotics Simulation', description: 'Robot Operating System 2 nodes, kinematics, and SLAM.' },
      { name: 'Blender & WebGL / R3F', category: '3D & Spatial Visualization', description: 'Parametric 3D mesh modeling and real-time WebGL rendering.' }
    ];
  } else {
    return [
      ...common,
      { name: 'Tableau & PowerBI', category: 'Business Intelligence', description: 'Data modeling, dashboard creation, and analytics visualization.' },
      { name: 'Jira & Confluence', category: 'Product Management', description: 'Agile sprint tracking, roadmap architecture, and documentation.' },
      { name: 'Figma & Rive', category: 'Design & Interaction', description: 'UI/UX prototyping and real-time vector state machines.' }
    ];
  }
}

function generateMaterials(topicName: string): EducationalMaterial[] {
  return [
    {
      type: 'Textbook',
      title: `Principles of Modern ${topicName.split(' in ')[1] || topicName}`,
      authorOrSource: 'LMDpro Academic Press & MIT OpenCourseWare',
      summary: 'Comprehensive graduate textbook covering fundamental theorems, architecture, and empirical studies.'
    },
    {
      type: 'Research Paper',
      title: `State-of-the-Art Benchmarks and Empirical Survey in ${topicName.split(' in ')[1] || topicName}`,
      authorOrSource: 'IEEE & ACM Digital Library Repositories',
      summary: 'Peer-reviewed research paper examining recent breakthroughs and performance metrics.'
    },
    {
      type: 'Interactive Sandbox',
      title: 'LMDpro Vector Sandbox & WebGL Simulation Engine',
      authorOrSource: 'LMDpro Open-Source Codebases',
      summary: 'Live browser-based interactive laboratory for parameter tweaking, code execution, and 3D visual analysis.'
    }
  ];
}

function generateCapstones(topicName: string, category: string): CapstoneProject[] {
  return [
    {
      title: `Autonomous Production Engine for ${topicName.split(' in ')[1] || topicName}`,
      summary: 'Build a production-grade, end-to-end software system demonstrating high availability, automated testing, and comprehensive documentation.',
      techStack: ['TypeScript', 'Python', 'Docker', 'Google Cloud', 'GitHub Actions']
    },
    {
      title: `Empirical Research Benchmark & Comparative Study`,
      summary: 'Conduct quantitative performance analysis comparing novel algorithmic techniques against classical baselines.',
      techStack: ['Python', 'PyTorch / NumPy', 'PostgreSQL', 'Grafana']
    }
  ];
}

// Generate the complete expanded list of Degree Programs dynamically across all DISCIPLINE_DOMAINS
export const DEGREE_PROGRAMS: DegreeCourse[] = DISCIPLINE_DOMAINS.flatMap((domain, domainIdx) => {
  return domain.topics.map((topic, topicIdx) => {
    const index = domainIdx * 10 + topicIdx;
    const id = `degree-prog-${index + 1}`;
    const isMaster = topic.level.includes('Master') || topic.level.includes('Ph.D') || topic.level.includes('Post-Doctoral');
    const isDoctorate = topic.level.includes('Ph.D') || topic.level.includes('Post-Doctoral');
    const credits = isDoctorate ? 60 : isMaster ? 36 : 120;
    const durationHours = isDoctorate ? 120 : isMaster ? 48 : 96;
    const coverImage = COVER_IMAGES[index % COVER_IMAGES.length];

    return {
      id,
      title: topic.name,
      category: domain.category,
      description: `A comprehensive ${topic.level} program delivered by ${domain.partner}. Features structured academic modules, practical laboratory assignments, interactive evaluations, capstone research, and degree defense.`,
      level: isDoctorate ? 'Advanced' : isMaster ? 'Advanced' : 'Intermediate',
      coverImage,
      author: 'LMDpro Academic Faculty',
      rating: Number((4.7 + (index % 4) * 0.08).toFixed(1)),
      durationHours,
      modules: generateDegreeModules(topic.name, domain.category),
      tags: [
        topic.level,
        domain.category.split(' ')[0],
        'LMDpro Certified',
        'Accredited Degree'
      ],
      isAiGenerated: false,
      degreeMetadata: {
        institution: 'LMDpro Institute of Technology',
        degreeLevel: topic.level,
        credits,
        tracks: [domain.category, 'Applied Research', 'Enterprise Systems'],
        careerOutcomes: [
          `${isDoctorate ? 'Distinguished Scientist / Principal' : isMaster ? 'Lead / Principal' : 'Senior'} ${domain.category.split(' ')[0]} Specialist`,
          'Academic & Industry Research Specialist',
          'Enterprise Solutions Architect'
        ],
        accreditation: 'LMDpro Academic Board & ISO 21001 Certified',
        crawledSource: 'LMDpro Academic Repository',
        learningPath: generateLearningPath(topic.name, domain.category),
        recommendedTools: generateTools(domain.category),
        educationalMaterials: generateMaterials(topic.name),
        capstoneProjects: generateCapstones(topic.name, domain.category)
      }
    };
  });
});
