import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectSimulation, SimulationDifficulty } from '../shared/simulation.types';
import { SimulationEngine } from '../services/simulationEngine';
import { UserProfile, Course } from '../shared/types';
import { toastService } from '../services/toastService';
import { 
  Briefcase, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Clock, 
  Award, 
  ShieldCheck, 
  Plus, 
  Search, 
  Layers, 
  Cpu, 
  ArrowRight,
  Filter,
  X,
  Code2
} from 'lucide-react';

interface ProjectSimulationsListProps {
  courseId?: string;
  courseTitle?: string;
  user?: UserProfile;
  courses?: Course[];
  onSelectSimulation: (sim: ProjectSimulation) => void;
}

export const ProjectSimulationsList: React.FC<ProjectSimulationsListProps> = ({
  courseId,
  courseTitle,
  user,
  courses = [],
  onSelectSimulation
}) => {
  const [simulations, setSimulations] = React.useState<ProjectSimulation[]>(() => {
    return courseId 
      ? SimulationEngine.getSimulationsForCourse(courseId)
      : SimulationEngine.getSimulations();
  });

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<string>('All');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = React.useState(false);
  const [customTopic, setCustomTopic] = React.useState('');
  const [customDifficulty, setCustomDifficulty] = React.useState<SimulationDifficulty>('Intermediate');
  const [selectedCourseForGen, setSelectedCourseForGen] = React.useState<string>(courseId || courses[0]?.id || 'course-ai-agentic-systems');
  const [isGenerating, setIsGenerating] = React.useState(false);

  const isAr = user?.language === 'ar';

  const handleRefreshSimulations = () => {
    if (courseId) {
      setSimulations(SimulationEngine.getSimulationsForCourse(courseId));
    } else {
      setSimulations(SimulationEngine.getSimulations());
    }
  };

  const filteredSimulations = simulations.filter(sim => {
    const matchSearch = searchQuery.trim() === '' ||
      sim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sim.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sim.domainRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sim.industryDomain.toLowerCase().includes(searchQuery.toLowerCase());

    const matchDiff = selectedDifficulty === 'All' || sim.difficulty === selectedDifficulty;
    return matchSearch && matchDiff;
  });

  const handleGenerateCustomSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim()) {
      toastService.warning(isAr ? 'يرجى إدخال موضوع المحاكاة' : 'Please specify a topic prompt');
      return;
    }

    setIsGenerating(true);
    toastService.info(isAr ? 'جاري توليد محاكاة المشروع بواسطة الذكاء الاصطناعي...' : 'Generating AI Project Simulation...');

    try {
      const selectedCourse = courses.find(c => c.id === selectedCourseForGen);
      const generatedSim = await SimulationEngine.generateSimulation(
        selectedCourseForGen,
        selectedCourse?.title || courseTitle || 'Advanced Systems',
        customTopic,
        customDifficulty
      );

      setIsGenerating(false);
      setIsGenerateModalOpen(false);
      setCustomTopic('');
      handleRefreshSimulations();
      toastService.success(isAr ? 'تم توليد المشروع بنجاح!' : 'Custom Real-World Simulation Generated!');
      onSelectSimulation(generatedSim);
    } catch (err) {
      console.error('Error generating simulation:', err);
      setIsGenerating(false);
      toastService.warning(isAr ? 'حدث خطأ أثناء التوليد' : 'Generation failed. Try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/80 via-[#08151c] to-cyan-950/80 border border-cyan-500/30 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 uppercase font-bold">
              Task-Based Learning Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {simulations.length} Real-World Simulations
            </span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 rtl-fluid-text">
            <Briefcase className="w-5 h-5 text-cyan-400" />
            <span>{isAr ? 'محاكاة المشاريع العملية في الواقع الحقيقي' : 'Real-World Project Simulations'}</span>
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl rtl-fluid-text">
            {isAr 
              ? 'تطبيق المهارات المكتسبة في الدروس على سيناريوهات واقعية ومهمات معمارية مع تقييم آلي متقدم بواسطة الذكاء الاصطناعي.'
              : 'Apply course knowledge to real-world tasks and enterprise architecture scenarios with instant automated AI evaluation.'}
          </p>
        </div>

        <button
          onClick={() => setIsGenerateModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-95 flex items-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>{isAr ? 'توليد محاكاة جديدة بالذكاء الاصطناعي' : 'Generate AI Simulation'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#030b10] border border-[#143242]">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث في المشاريع، الأوساط المهنية، والمهام...' : 'Search simulations, roles, or domains...'}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#08151c] border border-[#1b3b4a] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isAr ? 'المستوى:' : 'Level:'}</span>
          </span>
          {['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'].map(level => (
            <button
              key={level}
              onClick={() => setSelectedDifficulty(level)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                selectedDifficulty === level
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'bg-[#08151c] text-slate-400 hover:text-white border border-[#1b3b4a]'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Simulations Grid */}
      {filteredSimulations.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#08151c] border border-[#1b3b4a] space-y-3">
          <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">{isAr ? 'لم يتم العثور على مشاريع محاكاة مطابقة' : 'No simulations found'}</h3>
          <p className="text-xs text-slate-400">{isAr ? 'جرب تغيير كلمة البحث أو أنشئ محاكاة جديدة بواسطة الذكاء الاصطناعي.' : 'Try adjusting search query or click "Generate AI Simulation".'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSimulations.map((sim) => {
            const submission = SimulationEngine.getSubmission(sim.id, user?.id || 'current_user');
            const isCompleted = submission?.status === 'evaluated' && submission.feedback?.passed;
            const score = submission?.feedback?.overallScore;

            return (
              <motion.div
                key={sim.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="p-5 rounded-3xl bg-[#08151c] border border-[#1b3b4a] hover:border-cyan-500/50 shadow-xl space-y-4 flex flex-col justify-between relative group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950/80 border border-cyan-400/40 text-cyan-300">
                      {sim.domainRole}
                    </span>

                    {isCompleted ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Mastered ({score}%)</span>
                      </span>
                    ) : submission ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                        In Progress
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-400 bg-black/40">
                        {sim.difficulty}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {sim.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                      {sim.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#143242]/60">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <div className="flex items-center gap-1 text-cyan-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{sim.estimatedHours}h</span>
                    </div>
                    <div className="flex items-center gap-1 text-cyan-400">
                      <Award className="w-3.5 h-3.5" />
                      <span>+{sim.xpReward} XP</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-300">
                      <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{sim.tasks.length} Tasks</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectSimulation(sim)}
                    className="w-full py-2.5 rounded-2xl bg-[#030b10] hover:bg-cyan-950 border border-[#143242] hover:border-cyan-500/50 text-white hover:text-cyan-300 font-bold text-xs transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-cyan-950/50"
                  >
                    <span>{isCompleted ? (isAr ? 'مراجعة المخرجات' : 'Review Deliverables') : (isAr ? 'بدء محاكاة المشروع' : 'Start Simulation')}</span>
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* GENERATE CUSTOM SIMULATION MODAL */}
      <AnimatePresence>
        {isGenerateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 rounded-3xl bg-[#08151c] border border-cyan-500/40 max-w-lg w-full space-y-5 relative shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#143242] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-300" />
                  <h3 className="font-bold text-base text-white">
                    {isAr ? 'توليد محاكاة جديدة بواسطة الذكاء الاصطناعي' : 'Generate Custom AI Project Simulation'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="p-1 rounded-xl hover:bg-[#143242] text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleGenerateCustomSimulation} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {isAr ? 'المقرر أو المجال المرتبط' : 'Target Course / Discipline'}
                  </label>
                  <select
                    value={selectedCourseForGen}
                    onChange={(e) => setSelectedCourseForGen(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#030b10] border border-[#143242] text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {isAr ? 'موضوع مشروع المحاكاة والسيناريو' : 'Simulation Topic & Technical Challenge'}
                  </label>
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="e.g. Zero-Trust Cyber Audit for High-Frequency Trading API"
                    className="w-full p-3 rounded-xl bg-[#030b10] border border-[#143242] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {isAr ? 'مستوى الصعوبة' : 'Difficulty Level'}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as SimulationDifficulty[]).map(diff => (
                      <button
                        type="button"
                        key={diff}
                        onClick={() => setCustomDifficulty(diff)}
                        className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                          customDifficulty === diff
                            ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                            : 'bg-[#030b10] text-slate-400 border-[#143242] hover:text-white'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsGenerateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md flex items-center gap-2 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{isAr ? 'جاري التوليد...' : 'Generating...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-cyan-300" />
                        <span>{isAr ? 'توليد المحاكاة' : 'Generate Project'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
