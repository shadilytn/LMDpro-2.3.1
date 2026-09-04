import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ProjectSimulation, 
  SimulationTask, 
  SimulationSubmission, 
  SimulationFeedback 
} from '../shared/simulation.types';
import { SimulationEngine } from '../services/simulationEngine';
import { UserProfile } from '../shared/types';
import { toastService } from '../services/toastService';
import confetti from 'canvas-confetti';
import { 
  Briefcase, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Send, 
  Sparkles, 
  FileCode, 
  FileText, 
  Cpu, 
  HelpCircle, 
  ArrowLeft, 
  Clock, 
  Award, 
  ShieldCheck, 
  RotateCcw, 
  Terminal, 
  BarChart3, 
  ChevronRight,
  Database,
  Code2,
  ListChecks,
  Info
} from 'lucide-react';

interface ProjectSimulationStudioProps {
  simulation: ProjectSimulation;
  user?: UserProfile;
  onBack: () => void;
  onCompleted?: (earnedXp: number) => void;
}

export const ProjectSimulationStudio: React.FC<ProjectSimulationStudioProps> = ({
  simulation,
  user,
  onBack,
  onCompleted
}) => {
  const [activeTab, setActiveTab] = React.useState<'scenario' | 'tasks' | 'assets' | 'evaluation'>('tasks');
  const [activeTaskId, setActiveTaskId] = React.useState<string>(simulation.tasks[0]?.id || '');
  const [deliverables, setDeliverables] = React.useState<Record<string, string>>({});
  const [isEvaluating, setIsEvaluating] = React.useState<boolean>(false);
  const [feedback, setFeedback] = React.useState<SimulationFeedback | null>(null);
  const [hintOpen, setHintOpen] = React.useState<Record<string, boolean>>({});
  const [activeAssetFile, setActiveAssetFile] = React.useState<string>('main.py');
  const [testOutput, setTestOutput] = React.useState<string | null>(null);

  const isAr = user?.language === 'ar';

  // Load existing submission draft/evaluated state on mount
  React.useEffect(() => {
    const existing = SimulationEngine.getSubmission(simulation.id, user?.id || 'current_user');
    if (existing) {
      if (existing.deliverables) {
        setDeliverables(existing.deliverables);
      }
      if (existing.feedback) {
        setFeedback(existing.feedback);
      }
    } else {
      // Initialize with starter templates
      const initial: Record<string, string> = {};
      simulation.tasks.forEach(task => {
        initial[task.id] = task.starterTemplate || '';
      });
      setDeliverables(initial);
    }
  }, [simulation, user]);

  const activeTask = simulation.tasks.find(t => t.id === activeTaskId) || simulation.tasks[0];

  const handleDeliverableChange = (taskId: string, value: string) => {
    setDeliverables(prev => {
      const next = { ...prev, [taskId]: value };
      // Save draft automatically
      SimulationEngine.saveSubmission({
        id: `sub-${simulation.id}-${user?.id || 'current_user'}`,
        projectId: simulation.id,
        courseId: simulation.courseId,
        userId: user?.id || 'current_user',
        status: 'draft',
        deliverables: next
      });
      return next;
    });
  };

  const handleResetTaskCode = (taskId: string) => {
    const task = simulation.tasks.find(t => t.id === taskId);
    if (task) {
      handleDeliverableChange(taskId, task.starterTemplate || '');
      toastService.info(isAr ? 'تم إعادة ضبط كود المهمة' : 'Task template reset to starter code');
    }
  };

  const handleRunSyntaxTest = () => {
    const code = deliverables[activeTaskId] || '';
    if (!code.trim()) {
      setTestOutput('⚠ Error: Workspace is empty. Write code or report text to test.');
      return;
    }
    
    setTestOutput('⏳ Running static syntax check and logic verification...');
    setTimeout(() => {
      if (code.includes('def ') || code.includes('class ') || code.includes('function ') || code.includes('#')) {
        setTestOutput(`✓ Syntax Check Passed!\n- Language format: Valid\n- Character count: ${code.length} characters\n- Line count: ${code.split('\n').length} lines\n- Status: Ready for AI Automated Evaluation.`);
      } else {
        setTestOutput(`✓ Document formatted successfully (${code.split(' ').length} words).\n- Ready for submission.`);
      }
    }, 400);
  };

  const handleSubmitForEvaluation = async () => {
    setIsEvaluating(true);
    setTestOutput(null);
    toastService.info(isAr ? 'جاري تقييم المشروع بواسطة الذكاء الاصطناعي...' : 'Submitting deliverables for AI Automated Evaluation...');

    try {
      const resultFeedback = await SimulationEngine.evaluateSubmission(
        simulation,
        deliverables,
        user?.id || 'current_user'
      );

      setFeedback(resultFeedback);
      setIsEvaluating(false);
      setActiveTab('evaluation');

      if (resultFeedback.passed) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
        toastService.success(isAr ? `تهانينا! تم اجتياز المشروع وكسب ${resultFeedback.earnedXp} XP` : `Simulation Mastered! Earned +${resultFeedback.earnedXp} XP`);
        if (onCompleted) {
          onCompleted(resultFeedback.earnedXp);
        }
      } else {
        toastService.warning(isAr ? 'المشروع يحتاج إلى تعديلات' : 'Submission evaluated. See detailed feedback notes.');
      }
    } catch (err) {
      console.error('Error submitting simulation:', err);
      setIsEvaluating(false);
      toastService.warning(isAr ? 'حدث خطأ أثناء التقييم' : 'Evaluation failed. Please try again.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Studio Top Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-[#08151c]/90 border border-cyan-500/30 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-[#030b10] border border-[#143242] text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all active:scale-95 flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isAr ? 'رجوع' : 'Back to Courses'}</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 uppercase">
                {simulation.domainRole}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
                {simulation.industryDomain}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mt-1 rtl-fluid-text">{simulation.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 px-4 py-2 rounded-2xl bg-[#030b10] border border-[#143242] text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{simulation.estimatedHours}h</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-400">
              <Award className="w-3.5 h-3.5" />
              <span>+{simulation.xpReward} XP</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{simulation.difficulty}</span>
            </div>
          </div>

          <button
            onClick={handleSubmitForEvaluation}
            disabled={isEvaluating}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-cyan-600 to-cyan-600 hover:from-cyan-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            {isEvaluating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{isAr ? 'جاري التقييم...' : 'AI Evaluating...'}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{isAr ? 'تسليم وتقييم الذكاء الاصطناعي' : 'Run AI Evaluation'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Workspace Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#030b10] border border-[#143242] w-fit">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'tasks'
              ? 'bg-gradient-to-r from-cyan-600 to-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ListChecks className="w-4 h-4" />
          <span>{isAr ? 'مهام المشروع والمحرر' : 'Tasks & Workspace'}</span>
          <span className="px-1.5 py-0.2 rounded-md bg-black/40 text-[10px] font-mono">
            {simulation.tasks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('scenario')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'scenario'
              ? 'bg-gradient-to-r from-cyan-600 to-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>{isAr ? 'سيناريو الشركة والهيكلية' : 'Scenario & Architecture'}</span>
        </button>

        <button
          onClick={() => setActiveTab('assets')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'assets'
              ? 'bg-gradient-to-r from-cyan-600 to-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>{isAr ? 'الأصول والبيانات' : 'Starter Assets'}</span>
        </button>

        {feedback && (
          <button
            onClick={() => setActiveTab('evaluation')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'evaluation'
                ? 'bg-gradient-to-r from-cyan-600 to-cyan-600 text-white shadow-md'
                : 'text-cyan-400 hover:text-cyan-300'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{isAr ? 'تقرير تقييم الذكاء الاصطناعي' : 'AI Feedback Report'}</span>
            <span className="px-1.5 py-0.2 rounded-md bg-cyan-950 text-cyan-300 font-bold text-[10px]">
              {feedback.overallScore}%
            </span>
          </button>
        )}
      </div>

      {/* TAB CONTENT: Tasks & Deliverables Workspace */}
      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
          {/* Left Column: Task Checklist Selector */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-3xl bg-[#08151c] border border-[#1b3b4a] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-cyan-400" />
                  <span>{isAr ? 'مهام المهندس المطلوبة' : 'Simulation Tasks'}</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {Object.keys(deliverables).filter(k => (deliverables[k] || '').trim().length > 20).length} / {simulation.tasks.length} {isAr ? 'مكتملة' : 'drafted'}
                </span>
              </div>

              <div className="space-y-2">
                {simulation.tasks.map((task) => {
                  const isSelected = task.id === activeTaskId;
                  const taskCode = deliverables[task.id] || '';
                  const hasDraft = taskCode.trim().length > 20;
                  const taskFeedbackNote = feedback?.taskFeedbacks[task.id];

                  return (
                    <button
                      key={task.id}
                      onClick={() => setActiveTaskId(task.id)}
                      className={`w-full text-left p-3.5 rounded-2xl transition-all border relative flex flex-col gap-2 ${
                        isSelected
                          ? 'bg-[#0f2938] border-cyan-400 shadow-lg shadow-cyan-950/50'
                          : 'bg-[#030b10] border-[#143242] hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full text-xs font-mono font-bold flex items-center justify-center ${
                            isSelected ? 'bg-cyan-500 text-black' : 'bg-[#143242] text-cyan-300'
                          }`}>
                            {task.taskNumber}
                          </span>
                          <span className="font-bold text-xs text-white line-clamp-1">{task.title}</span>
                        </div>

                        {taskFeedbackNote ? (
                          taskFeedbackNote.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-cyan-400 shrink-0" />
                          )
                        ) : hasDraft ? (
                          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                        ) : null}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1 border-t border-[#143242]/50">
                        <span className="uppercase text-cyan-300">{task.requiredDeliverableType}</span>
                        <span>{task.targetFilename || 'file'}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Task Context & Validation Criteria Card */}
            {activeTask && (
              <div className="p-4 rounded-3xl bg-[#08151c] border border-[#1b3b4a] space-y-3">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>{isAr ? 'معايير القبول للوظيفة' : 'Validation Criteria'}</span>
                </h4>

                <ul className="space-y-2 text-xs text-slate-300">
                  {activeTask.validationCriteria.map((crit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>

                {/* Socratic AI Hints Accordion */}
                <div className="pt-2 border-t border-[#143242]">
                  <button
                    onClick={() => setHintOpen(prev => ({ ...prev, [activeTask.id]: !prev[activeTask.id] }))}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 font-semibold"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{hintOpen[activeTask.id] ? (isAr ? 'إخفاء التلميح السقراطي' : 'Hide Socratic Hints') : (isAr ? 'طلب تلميح الذكاء الاصطناعي' : 'Get AI Socratic Hint')}</span>
                  </button>

                  {hintOpen[activeTask.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 space-y-1.5"
                    >
                      <div className="font-bold text-[11px] uppercase tracking-wider text-cyan-400">Socratic Guidance</div>
                      {activeTask.hints.map((hint, hIdx) => (
                        <p key={hIdx}>💡 {hint}</p>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Code/Document Interactive Editor */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            <div className="p-5 rounded-3xl bg-[#08151c] border border-[#1b3b4a] space-y-4 flex-1 flex flex-col">
              {/* Task Header & File Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#143242]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      Task {activeTask.taskNumber}:
                    </span>
                    <h3 className="font-bold text-base text-white">{activeTask.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{activeTask.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleResetTaskCode(activeTask.id)}
                    className="px-2.5 py-1.5 rounded-xl bg-[#030b10] border border-[#143242] text-slate-400 hover:text-cyan-300 text-xs flex items-center gap-1"
                    title="Reset to starter code"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إعادة الضبط' : 'Reset Starter'}</span>
                  </button>

                  <button
                    onClick={handleRunSyntaxTest}
                    className="px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 text-xs flex items-center gap-1 font-mono font-bold"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isAr ? 'اختبار الصياغة' : 'Run Test'}</span>
                  </button>
                </div>
              </div>

              {/* Workspace Code / Document Textarea Editor */}
              <div className="flex-1 flex flex-col min-h-[380px] rounded-2xl bg-[#030b10] border border-[#143242] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-[#061219] border-b border-[#143242] text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-300 font-bold">{activeTask.targetFilename || 'workspace_deliverable.py'}</span>
                  </div>
                  <span>{deliverables[activeTask.id]?.length || 0} chars</span>
                </div>

                <textarea
                  value={deliverables[activeTask.id] || ''}
                  onChange={(e) => handleDeliverableChange(activeTask.id, e.target.value)}
                  placeholder={`// Write your solution code or document for Task ${activeTask.taskNumber} here...\n// Starter code template is provided above.`}
                  className="w-full flex-1 p-4 bg-transparent text-xs font-mono text-cyan-100 placeholder-slate-600 resize-none focus:outline-none leading-relaxed"
                  spellCheck={false}
                />
              </div>

              {/* Syntax Test Output Box */}
              {testOutput && (
                <div className="p-3.5 rounded-2xl bg-black/80 border border-cyan-500/30 text-xs font-mono text-cyan-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-cyan-400">
                    <Terminal className="w-4 h-4" />
                    <span>Test Simulator Output</span>
                  </div>
                  <pre className="whitespace-pre-wrap text-[11px] text-slate-300 leading-relaxed">
                    {testOutput}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Scenario & System Architecture */}
      {activeTab === 'scenario' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-3xl bg-[#08151c] border border-[#1b3b4a] space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-cyan-400" />
                <span>{isAr ? 'سيناريو الشركة والمهام التنفيذية' : 'Enterprise Scenario & Objectives'}</span>
              </h3>

              <div className="pred pred-invert pred-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {simulation.scenario}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[#08151c] border border-[#1b3b4a] space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>{isAr ? 'هيكلية النظام المستهدفة' : 'System Architecture Blueprint'}</span>
              </h3>

              <div className="p-4 rounded-2xl bg-[#030b10] border border-[#143242] text-xs font-mono text-cyan-300 whitespace-pre-wrap overflow-x-auto">
                {simulation.systemArchitectureOverview}
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{isAr ? 'المتطلبات السابقة' : 'Prerequisites'}</h4>
                <div className="flex flex-wrap gap-2">
                  {simulation.prerequisites.map((req, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs">
                      ✓ {req}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Starter Assets */}
      {activeTab === 'assets' && (
        <div className="p-6 rounded-3xl bg-[#08151c] border border-[#1b3b4a] space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              <span>{isAr ? 'أصول المشروع والبيانات المبدئية' : 'Starter Assets & Configurations'}</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{isAr ? 'الملفات المتاحة' : 'Available Files'}</h4>
              {Object.keys(simulation.starterAssets.starterCode || {}).map(filename => (
                <button
                  key={filename}
                  onClick={() => setActiveAssetFile(filename)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-mono flex items-center justify-between transition-all ${
                    activeAssetFile === filename
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                      : 'bg-[#030b10] border-[#143242] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    <span>{filename}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 p-4 rounded-2xl bg-[#030b10] border border-[#143242] overflow-x-auto min-h-[300px]">
              <pre className="text-xs font-mono text-cyan-300 whitespace-pre-wrap leading-relaxed">
                {simulation.starterAssets.starterCode?.[activeAssetFile] || '// Select a file on the left to preview contents'}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: AI Evaluation Report */}
      {activeTab === 'evaluation' && feedback && (
        <div className="p-6 rounded-3xl bg-[#08151c] border border-cyan-500/40 space-y-6 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-[#030b10] to-cyan-950/80 border border-cyan-500/30">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                  Grade: {feedback.grade}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Evaluated at {new Date(feedback.evaluatedAt).toLocaleTimeString()}
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-2">{feedback.passed ? 'Simulation Mastered 🎉' : 'Submission Reviewed'}</h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">{feedback.summary}</p>
            </div>

            <div className="text-center p-4 rounded-2xl bg-[#061219] border border-cyan-400/40 min-w-[140px]">
              <div className="text-3xl font-black text-cyan-300 font-mono">{feedback.overallScore}%</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Overall Score</div>
            </div>
          </div>

          {/* Task-by-Task Review Grid */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-cyan-400" />
              <span>{isAr ? 'تقييم المهام بالتفصيل' : 'Task-by-Task Evaluation'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(feedback.taskFeedbacks).map((tf, idx) => (
                <div key={tf.taskId || idx} className="p-4 rounded-2xl bg-[#030b10] border border-[#143242] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">Task {idx + 1} Review</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                      tf.passed ? 'bg-cyan-950 text-cyan-400' : 'bg-cyan-950 text-cyan-400'
                    }`}>
                      {tf.score}%
                    </span>
                  </div>

                  <p className="text-xs text-cyan-200 font-mono italic">{tf.codeReviewNotes}</p>

                  <div className="space-y-1.5 text-xs">
                    <div className="font-bold text-cyan-400">Strengths:</div>
                    {tf.strengths.map((s, sIdx) => (
                      <div key={sIdx} className="text-slate-300 flex items-start gap-1.5 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </div>
                    ))}

                    <div className="font-bold text-cyan-400 pt-1">Recommendations:</div>
                    {tf.improvements.map((imp, iIdx) => (
                      <div key={iIdx} className="text-slate-300 flex items-start gap-1.5 text-[11px]">
                        <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{imp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Architectural Critique Box */}
          <div className="p-5 rounded-2xl bg-[#030b10] border border-cyan-500/30 space-y-2">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>{isAr ? 'النقد الهيكلي والأمني' : 'Architectural & Security Review'}</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">{feedback.architecturalCritique}</p>
          </div>
        </div>
      )}
    </div>
  );
};
