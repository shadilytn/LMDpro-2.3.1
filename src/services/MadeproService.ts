
export const MadeproPrinciples = [
  { id: 1, title: 'Strategic Vision & Alignment', description: 'Aligning management practices with long-term organizational goals through structured leadership.' },
  { id: 2, title: 'Adaptive Competency Development', description: 'Developing middle management into versatile leaders capable of applying key competencies in diverse business functions.' },
  { id: 3, title: 'Operational Excellence', description: 'Optimizing management processes through data-driven insights and refined leadership development.' }
];

export const MadeproService = {
  getPrinciples: async () => {
    return MadeproPrinciples;
  },
  queryKnowledge: async (query: string) => {
    // In a real RAG setup, this would query an embedded database.
    return MadeproPrinciples.filter(p => 
      p.title.toLowerCase().includes(query.toLowerCase()) || 
      p.description.toLowerCase().includes(query.toLowerCase())
    );
  }
};
