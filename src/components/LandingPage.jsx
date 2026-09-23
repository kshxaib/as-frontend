import React from 'react';
import {
  CircleCheck,
  FileText,
  Files,
  ListChecks,
  Target,
  UserRound,
  Users,
  CheckCircle2,
  ShieldCheck,
  GitPullRequest,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { AcademicLogo } from './ui/AcademicLogo';
import { GithubIcon } from './ui/GithubIcon';

export const LandingPage = ({ justLoggedOut, hasSharedToken }) => {
  const { openAuthModal } = useAuthStore();

  return (
    <div
      data-appearance="light"
      className="bg-[#F8F7F4] text-[#19243B] min-h-screen w-full font-sans antialiased overflow-x-hidden selection:bg-[#0057FF] selection:text-white"
    >
      {justLoggedOut && (
        <div className="bg-[#EAF0FF] border-b border-[#C8D8FF] px-4 py-2.5 text-center text-xs font-medium text-[#0057FF] flex items-center justify-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>You have been signed out successfully.</span>
        </div>
      )}

      {hasSharedToken && (
        <div className="bg-[#EAF0FF] border-b border-[#C8D8FF] px-4 py-3 text-center text-xs font-medium text-[#19243B] flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 text-[#0057FF]">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>You have been invited to view a Predicted Examination Paper.</span>
          </div>
          <button
            onClick={() => openAuthModal('login')}
            className="font-semibold text-[#0057FF] hover:underline underline-offset-2 cursor-pointer"
          >
            Sign in to open →
          </button>
        </div>
      )}

      <main className="font-sans bg-[#F8F7F4] text-[#19243B]">
        <section className="flex pt-14 pr-6 pb-16 pl-6 flex-col items-center gap-12">
          <div className="text-center max-w-[900px]">
            <div className="font-semibold text-[#0057FF] text-[13px] flex mb-6 justify-center items-center gap-2 select-none">
              <AcademicLogo size={24} />
              <span>Your study space, brought together</span>
            </div>

            <h1 className="font-semibold text-[48px] leading-[1.08] -tracking-[0.055em]">
              <span className="block">Your notes.</span>
              <span className="block">Your question papers.</span>
              <span className="block">
                Your next exam,<span className="text-[#0057FF]">sorted.</span>
              </span>
            </h1>

            <p className="text-[#526078] text-[18px] leading-[1.65] mt-6 mr-auto ml-auto max-w-[700px]">
              Turn course materials into clear answers, practise what matters,
              and learn from resources shared by other students.
            </p>

            <div className="flex mt-7 flex-wrap justify-center gap-3">
              <button
                onClick={() => openAuthModal('register')}
                className="font-semibold rounded-[10px] bg-[#0057FF] hover:bg-[#0047D4] text-white px-5 h-12 text-sm transition-all shadow-sm cursor-pointer"
              >
                Create your account
              </button>

              <button
                onClick={() => openAuthModal('login')}
                className="rounded-[10px] bg-white hover:bg-[#F1F0EC] text-[#19243B] border border-[#E2E0D9] px-5 h-12 text-sm font-medium transition-colors cursor-pointer"
              >
                Sign in
              </button>
            </div>

            <p className="text-[#687184] text-[13px] leading-6 mt-4">
              Bring your course material. Build your study workspace.
            </p>
          </div>

          <div className="[perspective:1600px] w-full max-w-[1840px]">
            <div className="shadow-[0px_20px_40px_rgba(25,_36,_59,_0.12)] rounded-[28px] bg-white/80 border border-[#DCE5FB] p-4 h-[790px] overflow-hidden">
              <div className="[transform:perspective(1600px)_rotateY(-3deg)_rotateX(1deg)] shadow-[0px_14px_28px_rgba(25,_36,_59,_0.14)] rounded-[24px] bg-white border border-[#E2E0D9] p-2 h-full">
                <div className="rounded-[18px] bg-[#F8F7F4] border border-[#E2E0D9] flex h-full overflow-hidden">

                  <aside className="bg-white text-[#687184] text-[10px] border-r border-[#E2E0D9] flex p-4 flex-col shrink-0 w-[190px] select-none">
                    <div className="font-semibold text-[#19243B] flex mb-6 items-center gap-2">
                      <AcademicLogo size={24} />
                      <span className="text-[11px]">AcademicStack</span>
                    </div>

                    <p className="font-semibold text-[9px] tracking-[0.08em] mb-3 text-[#8891A1]">
                      YOUR WORKSPACE
                    </p>

                    <div className="rounded-[8px] flex mb-1 p-2 items-center gap-2">
                      <FileText className="size-3 text-[#526078]" />
                      <span>Study materials</span>
                    </div>

                    <div className="rounded-[8px] flex mb-1 p-2 items-center gap-2">
                      <Files className="size-3.5 text-[#526078]" />
                      <span>Question papers</span>
                    </div>

                    <div className="rounded-[8px] flex mb-1 p-2 items-center gap-2">
                      <ListChecks className="size-3.5 text-[#526078]" />
                      <span>Review questions</span>
                    </div>

                    <div className="font-semibold rounded-[8px] bg-[#EAF0FF] text-[#0057FF] flex mb-1 p-2 items-center gap-2">
                      <CircleCheck className="size-3.5" />
                      <span>Answers</span>
                    </div>

                    <div className="rounded-[8px] flex p-2 items-center gap-2">
                      <Target className="size-3.5 text-[#526078]" />
                      <span>Paper predictor</span>
                    </div>

                    <p className="font-semibold text-[9px] tracking-[0.08em] mt-7 mb-3 text-[#8891A1]">
                      STUDY TOGETHER
                    </p>

                    <div className="rounded-[8px] flex p-2 items-center gap-2">
                      <Users className="size-3.5 text-[#526078]" />
                      <span>Community</span>
                    </div>

                    <div className="border-t border-[#E2E0D9] flex mt-auto pt-4 items-center gap-2 text-[#526078]">
                      <UserRound className="size-3.5" />
                      <span>Profile</span>
                    </div>
                  </aside>

                  <section className="flex p-6 flex-col flex-1 min-w-0 overflow-hidden">
                    <div className="border-b border-[#E2E0D9] flex pb-4 justify-between items-start">
                      <div>
                        <h2 className="font-semibold text-[21px] -tracking-[0.02em] text-[#19243B]">
                          Operating Systems
                        </h2>
                        <p className="text-[#687184] text-[11px] flex mt-1 items-center gap-1.5">
                          <FileText className="size-3" />
                          <span>Unit 3 · Process Synchronization</span>
                        </p>
                      </div>

                      <div className="text-[#526078] text-[11px] flex items-center gap-2">
                        <span className="rounded-full bg-[#EAF0FF] border border-[#0057FF] size-3 flex items-center justify-center">
                          <span className="size-1 rounded-full bg-[#0057FF]" />
                        </span>
                        <span>Studying</span>
                      </div>
                    </div>

                    <div className="flex mt-6 justify-between items-start gap-4">
                      <div>
                        <div className="font-semibold text-[#0057FF] text-[12px] mb-1.5">
                          Q06 · 10 marks
                        </div>
                        <h3 className="font-semibold text-[21px] leading-[1.3] max-w-[760px] text-[#19243B]">
                          Explain deadlock in an operating system. Describe the necessary conditions for deadlock.
                        </h3>
                      </div>

                      <span className="font-semibold rounded-[8px] bg-[#EAF0FF] text-[#0057FF] text-[11px] py-1.5 px-3 shrink-0">
                        10 marks
                      </span>
                    </div>

                    <div className="shadow-[0px_8px_18px_rgba(25,_36,_59,_0.05)] rounded-[16px] bg-white border border-[#E2E0D9] flex mt-5 p-5 sm:p-6 flex-col overflow-hidden">
                      <div>
                        <h4 className="font-semibold text-[20px] text-[#19243B]">
                          Deadlock in Operating Systems
                        </h4>
                      </div>

                      <div className="text-[#526078] text-[12px] leading-[1.45] mt-4">
                        <h5 className="font-semibold text-[#19243B] text-[13px]">
                          Definition
                        </h5>
                        <p className="mt-1">
                          Deadlock is a state in which a set of processes are permanently blocked because each process is waiting for a resource held by another process in the same set.
                        </p>

                        <h5 className="font-semibold text-[#19243B] text-[13px] mt-4">
                          Necessary conditions
                        </h5>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mt-2 text-[12px]">
                          <div>
                            <div className="font-semibold text-[#0057FF]">01 Mutual exclusion</div>
                            <p className="text-[#526078]">at least one resource must be held in a non-shareable mode.</p>
                          </div>
                          <div>
                            <div className="font-semibold text-[#0057FF]">02 Hold and wait</div>
                            <p className="text-[#526078]">a process holds one resource while waiting for another.</p>
                          </div>
                          <div>
                            <div className="font-semibold text-[#0057FF]">03 No preemption</div>
                            <p className="text-[#526078]">a resource cannot be forcibly taken from a process.</p>
                          </div>
                          <div>
                            <div className="font-semibold text-[#0057FF]">04 Circular wait</div>
                            <p className="text-[#526078]">processes form a circular chain where each waits for a resource held by the next.</p>
                          </div>
                        </div>

                        <div className="rounded-[12px] bg-[#F8FAFF] border border-[#C8D8FF] mt-4 p-4">
                          <h5 className="font-semibold text-[#19243B] text-[13px]">
                            Resource Allocation Graph
                          </h5>

                          <div className="relative mt-2 mx-auto h-[125px] max-w-[500px]">
                            <svg
                              viewBox="0 0 460 155"
                              className="absolute inset-0 size-full"
                              aria-label="Resource allocation graph"
                            >
                              <defs>
                                <marker id="blueArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                                  <path d="M0,0 L7,3.5 L0,7 Z" fill="#0057FF" />
                                </marker>
                                <marker id="darkArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                                  <path d="M0,0 L7,3.5 L0,7 Z" fill="#19243B" />
                                </marker>
                              </defs>

                              <line x1="78" y1="35" x2="382" y2="35" stroke="#0057FF" strokeWidth="2" markerEnd="url(#blueArrow)" />
                              <line x1="405" y1="53" x2="405" y2="101" stroke="#19243B" strokeWidth="2" markerEnd="url(#darkArrow)" />
                              <line x1="382" y1="120" x2="78" y2="120" stroke="#0057FF" strokeWidth="2" markerEnd="url(#blueArrow)" />
                              <line x1="55" y1="101" x2="55" y2="53" stroke="#19243B" strokeWidth="2" markerEnd="url(#darkArrow)" />

                              <circle cx="55" cy="35" r="20" fill="#EAF0FF" stroke="#0057FF" strokeWidth="2" />
                              <rect x="382" y="15" width="40" height="40" rx="6" fill="#FFF3E6" stroke="#E58A35" strokeWidth="2" />
                              <circle cx="405" cy="120" r="20" fill="#EAF0FF" stroke="#0057FF" strokeWidth="2" />
                              <rect x="35" y="100" width="40" height="40" rx="6" fill="#FFF3E6" stroke="#E58A35" strokeWidth="2" />

                              <text x="55" y="39" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0057FF">P1</text>
                              <text x="402" y="39" textAnchor="middle" fontSize="11" fontWeight="600" fill="#C76716">R1</text>
                              <text x="405" y="124" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0057FF">P2</text>
                              <text x="55" y="124" textAnchor="middle" fontSize="11" fontWeight="600" fill="#C76716">R2</text>
                            </svg>
                          </div>

                          <div className="text-[#526078] text-[10.5px] flex justify-center gap-6 mt-2">
                            <span>Blue arrow · Request</span>
                            <span>Dark arrow · Allocation</span>
                          </div>

                          <p className="text-center text-[11.5px] text-[#526078] mt-1.5">
                            Circular wait: P1 and P2 are blocked indefinitely.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Open Source Contribution Banner */}
        <section className="px-6 pb-20 max-w-4xl mx-auto">
          <div className="rounded-[20px] bg-white border border-[#E2E0D9] p-8 sm:p-10 shadow-[0px_10px_30px_rgba(25,_36,_59,_0.06)] text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-[#0057FF] to-transparent" />
            
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF0FF] border border-[#C8D8FF] px-3.5 py-1 text-xs font-semibold text-[#0057FF] mb-4">
              <GitPullRequest className="h-3.5 w-3.5" />
              <span>Open Source & Community Driven</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#19243B] tracking-tight">
              Want to improve AcademicStack?
            </h2>

            <p className="text-[#526078] text-sm sm:text-base mt-3 max-w-xl mx-auto leading-relaxed">
              AcademicStack is open for contributions! Whether you want to enhance the exam predictor, add new study formats, improve LaTeX math rendering, or refine the UI — we welcome all ideas and pull requests.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <a
                href="https://github.com/kshxaib/AcademicStack"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[10px] bg-[#19243B] hover:bg-[#0057FF] text-white px-5 h-11 text-xs font-semibold transition-all shadow-sm"
              >
                <GithubIcon size={16} />
                <span>Contribute on GitHub</span>
              </a>

              <a
                href="https://github.com/kshxaib/AcademicStack/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[10px] bg-[#F8F7F4] hover:bg-[#EAE8E3] text-[#19243B] border border-[#E2E0D9] px-5 h-11 text-xs font-semibold transition-colors"
              >
                <Sparkles className="h-4 w-4 text-[#0057FF]" />
                <span>Suggest a Feature</span>
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E2E0D9]/60 flex flex-wrap items-center justify-between text-xs text-[#687184] gap-4">
              <div className="flex items-center gap-2">
                <AcademicLogo size={18} />
                <span className="font-semibold text-[#19243B]">AcademicStack</span>
                <span>· Built for university students</span>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/kshxaib/as-frontend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0057FF] transition-colors"
                >
                  Frontend Repo
                </a>
                <span>·</span>
                <a
                  href="https://github.com/kshxaib/as-backend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0057FF] transition-colors"
                >
                  Backend Repo
                </a>
                <span>·</span>
                <a
                  href="https://github.com/kshxaib/AcademicStack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0057FF] font-medium transition-colors"
                >
                  Main Repo
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
