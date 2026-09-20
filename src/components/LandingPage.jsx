import React from 'react';
import {
  BookOpen,
  CircleCheck,
  FileText,
  Files,
  ListChecks,
  Target,
  UserRound,
  Users,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const AcademicLogo = ({ size = 26 }) => (
  <span
    aria-label="AcademicStack mark"
    className="relative shrink-0 inline-block select-none"
    style={{ width: size, height: size }}
  >
    <span className="[clip-path:polygon(0_0,100%_0,78%_100%,22%_100%)] bg-[#0057FF] absolute top-0 right-0 left-0 h-[4.5px]" />
    <span className="[clip-path:polygon(22%_0,78%_0,100%_100%,0_100%)] bg-[#0057FF] absolute top-[6.5px] right-0 left-0 h-[4.5px]" />
    <span className="[clip-path:polygon(0_0,100%_0,78%_100%,22%_100%)] bg-[#0057FF] absolute bottom-0 right-0 left-0 h-[4.5px]" />
  </span>
);

export const LandingPage = ({ justLoggedOut, hasSharedToken }) => {
  const { openAuthModal } = useAuthStore();

  return (
    <div data-appearance="light" className="bg-[#F8F7F4] text-[#19243B] min-h-screen w-full font-sans antialiased overflow-x-hidden selection:bg-[#0057FF] selection:text-white">
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

      <header className="bg-white border-b border-[#E2E0D9] flex px-6 sm:px-10 lg:px-16 justify-between items-center h-[80px]">
        <div className="font-semibold flex items-center gap-3 select-none">
          <AcademicLogo size={24} />
          <span className="text-[12px] font-semibold text-[#19243B] tracking-tight">AcademicStack</span>
        </div>
        <nav className="flex items-center gap-3" aria-label="Account">
          <button
            onClick={() => openAuthModal('login')}
            className="rounded-[10px] text-[#19243B] px-4 h-11 text-sm font-medium hover:bg-[#F1F0EC] transition-colors cursor-pointer"
          >
            Sign in
          </button>
          <button
            onClick={() => openAuthModal('register')}
            className="rounded-[10px] bg-[#0057FF] hover:bg-[#0047D4] text-white px-5 h-11 text-sm font-medium shadow-sm transition-all cursor-pointer"
          >
            Create account
          </button>
        </nav>
      </header>

      <main className="font-sans bg-[#F8F7F4] text-[#19243B]">
        <section className="grid mx-auto pt-8 sm:pt-12 px-6 sm:px-10 lg:px-16 pb-12 items-center gap-10 lg:gap-12 grid-cols-1 lg:grid-cols-[minmax(400px,0.7fr)_minmax(720px,1.3fr)] max-w-[1880px]">
          <div className="max-w-[650px]">
            <div className="font-semibold text-[#0057FF] text-[13px] flex mb-6 items-center gap-2 select-none">
              <AcademicLogo size={20} />
              <span>Your study space, brought together</span>
            </div>
            <h1 className="font-semibold text-[38px] sm:text-[46px] lg:text-[48px] leading-[1.08] -tracking-[0.055em] max-w-[660px]">
              Your notes.
              <br />
              Your question papers.
              <br />
              Your next exam,<span className="text-[#0057FF]">sorted.</span>
            </h1>
            <p className="text-[#526078] text-[17px] sm:text-[18px] leading-[1.65] mt-6 max-w-[570px]">
              Turn course materials into clear answers, practise what matters,
              and learn from resources shared by other students.
            </p>
            <div className="flex mt-7 flex-wrap gap-3">
              <button
                onClick={() => openAuthModal('register')}
                className="font-semibold rounded-[10px] bg-[#0057FF] hover:bg-[#0047D4] text-white px-5 sm:px-6 h-12 text-sm sm:text-base transition-all shadow-sm flex items-center justify-center cursor-pointer"
              >
                Create your account
              </button>
              <button
                onClick={() => openAuthModal('login')}
                className="rounded-[10px] bg-white hover:bg-[#F1F0EC] text-[#19243B] border border-[#E2E0D9] px-5 sm:px-6 h-12 text-sm sm:text-base font-medium transition-colors cursor-pointer"
              >
                Sign in
              </button>
            </div>
            <p className="text-[#687184] text-[13px] leading-6 mt-4">
              Bring your course material. Build your study workspace.
            </p>
          </div>

          <div className="[perspective:1600px] w-full">
            <div className="shadow-[0px_20px_40px_rgba(25,_36,_59,_0.12)] rounded-[28px] bg-white/80 border border-[#DCE5FB] p-3 sm:p-4 overflow-hidden">
              <div className="lg:[transform:perspective(1600px)_rotateY(-3deg)_rotateX(1deg)] shadow-[0px_14px_28px_rgba(25,_36,_59,_0.14)] rounded-[24px] bg-white border border-[#E2E0D9] p-2 overflow-hidden">
                <div className="rounded-[18px] bg-[#F8F7F4] border border-[#E2E0D9] flex h-[760px] overflow-hidden">
                  
                  <aside className="bg-white text-[#687184] text-[10px] border-r border-[#E2E0D9] flex p-4 flex-col shrink-0 w-[190px] select-none">
                    <div className="font-semibold text-[#19243B] flex mb-6 items-center gap-2">
                      <AcademicLogo size={20} />
                      <span className="text-[11px]">AcademicStack</span>
                    </div>
                    <p className="font-semibold text-[9px] tracking-[0.08em] mb-3 text-[#8891A1]">
                      YOUR WORKSPACE
                    </p>
                    <div className="rounded-[8px] flex mb-1 p-2 items-center gap-2 hover:bg-[#F8F7F4] cursor-default">
                      <FileText className="size-3 text-[#526078]" />
                      <span>Study materials</span>
                    </div>
                    <div className="rounded-[8px] flex mb-1 p-2 items-center gap-2 hover:bg-[#F8F7F4] cursor-default">
                      <Files className="size-3.5 text-[#526078]" />
                      <span>Question papers</span>
                    </div>
                    <div className="rounded-[8px] flex mb-1 p-2 items-center gap-2 hover:bg-[#F8F7F4] cursor-default">
                      <ListChecks className="size-3.5 text-[#526078]" />
                      <span>Review questions</span>
                    </div>
                    <div className="font-semibold rounded-[8px] bg-[#EAF0FF] text-[#0057FF] flex mb-1 p-2 items-center gap-2">
                      <CircleCheck className="size-3.5" />
                      <span>Answers</span>
                    </div>
                    <div className="rounded-[8px] flex p-2 items-center gap-2 hover:bg-[#F8F7F4] cursor-default">
                      <Target className="size-3.5 text-[#526078]" />
                      <span>Paper predictor</span>
                    </div>
                    <p className="font-semibold text-[9px] tracking-[0.08em] mt-7 mb-3 text-[#8891A1]">
                      STUDY TOGETHER
                    </p>
                    <div className="rounded-[8px] flex p-2 items-center gap-2 hover:bg-[#F8F7F4] cursor-default">
                      <Users className="size-3.5 text-[#526078]" />
                      <span>Community</span>
                    </div>
                    <div className="text-[#8891A1] text-[9px] leading-6 border border-[#E2E0D9] rounded-[10px] bg-[#FAF9F6] mt-5 p-3">
                      Data Structures · Trees
                      <br />
                      DBMS · Normalization
                      <br />
                      Computer Networks · TCP/IP
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
                        <h3 className="font-semibold text-[19px] sm:text-[21px] leading-[1.3] max-w-[760px] text-[#19243B]">
                          Explain deadlock in an operating system. Describe the necessary conditions for deadlock and methods for handling it.
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
                        <span className="text-[#687184] text-[11px] flex mt-1 items-center gap-1">
                          <BookOpen className="size-3 text-[#0057FF]" />
                          <span>Reading answer</span>
                        </span>
                      </div>

                      <div className="text-[#526078] text-[12px] leading-[1.45] mt-5">
                        <h5 className="font-semibold text-[#19243B] text-[13px]">
                          Definition
                        </h5>
                        <p className="mt-1">
                          Deadlock is a state in which a set of processes are permanently blocked because each process is waiting for a resource held by another process in the same set.
                        </p>

                        <h5 className="font-semibold text-[#19243B] text-[13px] mt-5">
                          Necessary conditions
                        </h5>
                        <div className="flex flex-col gap-2 mt-2 text-[12px]">
                          <div>
                            <div className="font-semibold text-[#0057FF]">
                              01 Mutual exclusion
                            </div>
                            <p className="text-[#526078]">
                              at least one resource must be held in a non-shareable mode.
                            </p>
                          </div>
                          <div>
                            <div className="font-semibold text-[#0057FF]">
                              02 Hold and wait
                            </div>
                            <p className="text-[#526078]">
                              a process holds one resource while waiting for another.
                            </p>
                          </div>
                          <div>
                            <div className="font-semibold text-[#0057FF]">
                              03 No preemption
                            </div>
                            <p className="text-[#526078]">
                              a resource cannot be forcibly taken from a process.
                            </p>
                          </div>
                          <div>
                            <div className="font-semibold text-[#0057FF]">
                              04 Circular wait
                            </div>
                            <p className="text-[#526078]">
                              processes form a circular chain where each waits for a resource held by the next.
                            </p>
                          </div>
                        </div>

                        <div className="rounded-[12px] bg-[#F8FAFF] border border-[#C8D8FF] mt-5 p-4">
                          <h5 className="font-semibold text-[#19243B] text-[14px]">
                            Resource Allocation Graph
                          </h5>
                          <div className="relative mt-2 mx-auto h-[155px] max-w-[620px]">
                            <svg
                              viewBox="0 0 460 155"
                              className="absolute inset-0 size-full"
                              aria-label="Resource allocation graph"
                            >
                              <defs>
                                <marker
                                  id="blueArrow"
                                  markerWidth="7"
                                  markerHeight="7"
                                  refX="6"
                                  refY="3.5"
                                  orient="auto"
                                >
                                  <path d="M0,0 L7,3.5 L0,7 Z" fill="#0057FF" />
                                </marker>
                                <marker
                                  id="darkArrow"
                                  markerWidth="7"
                                  markerHeight="7"
                                  refX="6"
                                  refY="3.5"
                                  orient="auto"
                                >
                                  <path d="M0,0 L7,3.5 L0,7 Z" fill="#19243B" />
                                </marker>
                              </defs>
                              <line
                                x1="78"
                                y1="35"
                                x2="382"
                                y2="35"
                                stroke="#0057FF"
                                strokeWidth="2"
                                markerEnd="url(#blueArrow)"
                              />
                              <line
                                x1="405"
                                y1="53"
                                x2="405"
                                y2="101"
                                stroke="#19243B"
                                strokeWidth="2"
                                markerEnd="url(#darkArrow)"
                              />
                              <line
                                x1="382"
                                y1="120"
                                x2="78"
                                y2="120"
                                stroke="#0057FF"
                                strokeWidth="2"
                                markerEnd="url(#blueArrow)"
                              />
                              <line
                                x1="55"
                                y1="101"
                                x2="55"
                                y2="53"
                                stroke="#19243B"
                                strokeWidth="2"
                                markerEnd="url(#darkArrow)"
                              />
                              <circle
                                cx="55"
                                cy="35"
                                r="20"
                                fill="#EAF0FF"
                                stroke="#0057FF"
                                strokeWidth="2"
                              />
                              <rect
                                x="382"
                                y="15"
                                width="40"
                                height="40"
                                rx="6"
                                fill="#FFF3E6"
                                stroke="#E58A35"
                                strokeWidth="2"
                              />
                              <circle
                                cx="405"
                                cy="120"
                                r="20"
                                fill="#EAF0FF"
                                stroke="#0057FF"
                                strokeWidth="2"
                              />
                              <rect
                                x="35"
                                y="100"
                                width="40"
                                height="40"
                                rx="6"
                                fill="#FFF3E6"
                                stroke="#E58A35"
                                strokeWidth="2"
                              />
                              <text
                                x="55"
                                y="39"
                                textAnchor="middle"
                                fontSize="11"
                                fontWeight="600"
                                fill="#0057FF"
                              >
                                P1
                              </text>
                              <text
                                x="402"
                                y="39"
                                textAnchor="middle"
                                fontSize="11"
                                fontWeight="600"
                                fill="#C76716"
                              >
                                R1
                              </text>
                              <text
                                x="405"
                                y="124"
                                textAnchor="middle"
                                fontSize="11"
                                fontWeight="600"
                                fill="#0057FF"
                              >
                                P2
                              </text>
                              <text
                                x="55"
                                y="124"
                                textAnchor="middle"
                                fontSize="11"
                                fontWeight="600"
                                fill="#C76716"
                              >
                                R2
                              </text>
                            </svg>
                          </div>
                          <div className="text-[#526078] text-[10px] flex justify-center gap-5 mt-1">
                            <span>Blue arrow · Request</span>
                            <span>Dark arrow · Allocation</span>
                          </div>
                          <p className="text-center text-[11px] text-[#526078] mt-2">
                            Circular wait: P1 and P2 are blocked indefinitely.
                          </p>
                        </div>

                        <h5 className="font-semibold text-[#19243B] text-[13px] mt-5">
                          Deadlock handling
                        </h5>
                        <div className="text-[#526078] flex mt-2 flex-col gap-1.5">
                          <div>Detection & recovery</div>
                          <div>Avoidance</div>
                          <div>Prevention</div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
