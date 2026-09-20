import React from 'react';
import {
  ArrowRight,
  BookOpen,
  ChartNoAxesCombined,
  CircleCheck,
  FileText,
  Files,
  MessageCircleCheck,
  Play,
  Users,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const LandingPage = ({ justLoggedOut, hasSharedToken }) => {
  const { openAuthModal } = useAuthStore();

  return (
    <div className="bg-[#F8F7F4] text-[#19243B] min-h-screen w-full font-sans antialiased selection:bg-[#0057FF] selection:text-white">
      
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
            className="font-semibold text-[#0057FF] hover:underline underline-offset-2"
          >
            Sign in to open →
          </button>
        </div>
      )}

      <header className="bg-white border-b border-[#E2E0D9] sticky top-0 z-30 flex px-6 sm:px-12 lg:px-20 justify-between items-center h-[80px] sm:h-[92px]">
        <div className="font-semibold text-[20px] sm:text-[21px] tracking-tight flex items-center gap-3 select-none">
          <span className="rounded-[11px] bg-[#0057FF] text-white grid place-items-center size-9 sm:size-10 shadow-sm">
            <BookOpen className="size-5 sm:size-6" />
          </span>
          <span>AcademicStack</span>
        </div>
        <nav className="flex items-center gap-2 sm:gap-3" aria-label="Account">
          <button
            onClick={() => openAuthModal('login')}
            className="rounded-[10px] text-[#19243B] px-4 sm:px-5 h-10 sm:h-11 text-sm sm:text-base font-medium hover:bg-[#F1F0EC] transition-colors"
          >
            Sign in
          </button>
          <button
            onClick={() => openAuthModal('register')}
            className="rounded-[10px] bg-[#0057FF] hover:bg-[#0047D4] text-white px-4 sm:px-5 h-10 sm:h-11 text-sm sm:text-base font-medium shadow-sm transition-all"
          >
            Create account
          </button>
        </nav>
      </header>

      <section className="max-w-[1440px] mx-auto grid pt-12 sm:pt-[76px] px-6 sm:px-12 lg:px-20 pb-16 sm:pb-[76px] items-center gap-10 lg:gap-11 grid-cols-1 lg:grid-cols-[1.06fr_1fr]">
        <div>
          <div className="font-semibold text-[#0057FF] text-[13px] flex mb-4 sm:mb-6 items-center gap-2 bg-[#EAF0FF] w-fit px-3 py-1 rounded-full border border-[#C8D8FF]">
            <BookOpen className="size-4" />
            <span>Your study space, brought together</span>
          </div>

          <h1 className="font-semibold text-[38px] sm:text-[48px] lg:text-[57px] leading-[1.12] sm:leading-[1.095] tracking-tight text-[#19243B] max-w-[650px]">
            Your notes.
            <br />
            Your past papers.
            <br />
            Your next exam, <span className="text-[#0057FF]">sorted.</span>
          </h1>

          <p className="text-[#526078] text-[16px] sm:text-[18px] leading-[1.65] sm:leading-[1.75] mt-5 sm:mt-6 max-w-[540px]">
            Turn course materials into clear answers, practise what matters,
            and learn from resources shared by other students.
          </p>

          <div className="flex flex-wrap mt-7 mb-5 gap-3">
            <button
              onClick={() => openAuthModal('register')}
              className="rounded-[10px] bg-[#0057FF] hover:bg-[#0047D4] text-white px-5 sm:px-6 h-12 text-sm sm:text-base font-medium flex items-center justify-center gap-2 shadow-sm transition-all group"
            >
              <span>Create your account</span>
              <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => openAuthModal('login')}
              className="rounded-[10px] bg-white hover:bg-[#F1F0EC] text-[#19243B] border border-[#E2E0D9] px-5 sm:px-6 h-12 text-sm sm:text-base font-medium transition-colors"
            >
              Sign in
            </button>
          </div>

          <p className="text-[#687184] text-[12px] leading-[1.8] max-w-[500px]">
            Have your own OpenAI API key? Generate study content.
            <br />
            No key? Explore and clone shared study content from the community.
          </p>
        </div>

        <div className="rounded-[28px] bg-[#EAF0FF] border border-[#DCE5FB] relative h-[452px] overflow-hidden select-none shadow-xs">
          
          <div className="rounded-[19px] border border-dashed border-[#C8D8FF] absolute top-5 right-5 bottom-5 left-5 pointer-events-none" />

          <div className="font-semibold text-[#526078] text-[12px] flex absolute top-8 left-8 items-center gap-2 z-10">
            <BookOpen className="size-4 text-[#0057FF]" />
            <span>A small look inside your study space</span>
          </div>

          <div className="hidden sm:block absolute top-[145px] left-[104px] w-[360px] h-[170px] pointer-events-none">
            <div className="border-l border-dashed border-[#A7C2FF] absolute top-0 left-0 w-px h-[85px]" />
            <div className="border-t border-dashed border-[#A7C2FF] absolute top-[83px] left-0 w-[160px] h-px" />
            <div className="border-l border-dashed border-[#A7C2FF] absolute top-[83px] left-[160px] w-px h-[87px]" />
            <div className="border-r border-dashed border-[#A7C2FF] absolute top-0 right-0 w-px h-[85px]" />
            <div className="border-t border-dashed border-[#A7C2FF] absolute top-[83px] right-0 w-[125px] h-px" />
          </div>

          <div className="transform -rotate-3 hover:rotate-0 transition-transform duration-300 shadow-[0px_8px_24px_rgba(25,36,59,0.08)] rounded-2xl bg-white border border-[#E2E0D9] absolute top-[72px] sm:top-[78px] left-[20px] sm:left-[30px] p-[16px] sm:p-[18px] w-[230px] sm:w-[246px] z-10">
            <div className="flex justify-between items-center">
              <span className="rounded-[7px] bg-[#EAF0FF] text-[#0057FF] grid place-items-center size-8">
                <FileText className="size-4 sm:size-5" />
              </span>
              <span className="font-semibold rounded-[7px] bg-[#EAF0FF] text-[#0057FF] text-[11px] sm:text-[12px] py-1 px-2.5">
                Study material
              </span>
            </div>
            <h3 className="font-semibold text-sm sm:text-base tracking-tight text-[#19243B] mt-3 mb-1">
              Cell biology · Week 03
            </h3>
            <p className="text-[#526078] text-[11px] sm:text-[12px] leading-snug">
              Lecture notes · 18 pages
            </p>
          </div>

          <div className="transform rotate-3 hover:rotate-0 transition-transform duration-300 shadow-[0px_8px_24px_rgba(25,36,59,0.08)] rounded-2xl bg-white border border-[#E2E0D9] absolute top-[115px] sm:top-[127px] right-[18px] sm:right-[26px] p-[16px] sm:p-[18px] w-[210px] sm:w-[224px] z-10">
            <div className="flex justify-between items-center">
              <span className="rounded-[7px] bg-[#EAF0FF] text-[#0057FF] grid place-items-center size-8">
                <Files className="size-4 sm:size-5" />
              </span>
              <span className="font-semibold rounded-[7px] bg-[#F1F0EC] text-[#526078] text-[11px] sm:text-[12px] py-1 px-2.5">
                Past paper
              </span>
            </div>
            <h3 className="font-semibold text-sm sm:text-base tracking-tight text-[#19243B] mt-3 mb-1">
              Biology · Practice paper
            </h3>
            <p className="text-[#526078] text-[11px] sm:text-[12px] leading-snug">
              Question 4 · Cell membranes
            </p>
          </div>

          <div className="shadow-[0px_8px_24px_rgba(25,36,59,0.08)] rounded-2xl bg-white border border-[#E2E0D9] absolute bottom-[20px] sm:bottom-[27px] left-1/2 -translate-x-1/2 sm:left-[85px] sm:translate-x-0 p-[16px] sm:p-[18px] w-[calc(100%-40px)] sm:w-[367px] z-20">
            <div className="font-semibold text-[#187347] text-[12px] flex items-center gap-1.5">
              <CircleCheck className="size-4 shrink-0" />
              <span>Your answer, made clearer</span>
            </div>
            <h3 className="font-semibold text-sm sm:text-base tracking-tight text-[#19243B] mt-2 mb-1">
              How does osmosis work?
            </h3>
            <p className="text-[#526078] text-[11px] sm:text-[12px] leading-[1.6] border-l-2 border-[#C8D8FF] pl-2.5 my-2">
              Water moves across a partially permeable membrane from a dilute solution to a more concentrated solution.
            </p>
            <span className="font-semibold rounded-[7px] bg-[#EAF0FF] text-[#0057FF] text-[11px] sm:text-[12px] inline-flex py-1 px-2.5">
              From your cell biology notes
            </span>
          </div>
        </div>
      </section>

      <section className="border-t border-b border-[#E2E0D9] bg-white py-12 sm:py-16">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20">
          <h2 className="font-semibold text-[26px] sm:text-[30px] tracking-tight text-[#19243B]">
            How it works
          </h2>
          <div className="grid mt-7 sm:mt-9 gap-6 sm:gap-[26px] grid-cols-1 md:grid-cols-3">
            <article className="flex pt-4 pb-4 gap-4 items-start">
              <span className="font-semibold rounded-[10px] bg-[#EAF0FF] text-[#0057FF] border border-[#C8D8FF] grid place-items-center shrink-0 size-9 text-base">
                1
              </span>
              <div>
                <h3 className="font-semibold text-[17px] text-[#19243B] mb-1.5">
                  Add materials
                </h3>
                <p className="text-[#526078] text-[14px] leading-[1.65] max-w-[300px]">
                  Keep your notes and past papers together, organised by subject.
                </p>
              </div>
            </article>

            <article className="flex pt-4 pb-4 gap-4 items-start">
              <span className="font-semibold rounded-[10px] bg-[#EAF0FF] text-[#0057FF] border border-[#C8D8FF] grid place-items-center shrink-0 size-9 text-base">
                2
              </span>
              <div>
                <h3 className="font-semibold text-[17px] text-[#19243B] mb-1.5">
                  Generate answers
                </h3>
                <p className="text-[#526078] text-[14px] leading-[1.65] max-w-[300px]">
                  Turn your materials into clear explanations with your own API key.
                </p>
              </div>
            </article>

            <article className="flex pt-4 pb-4 gap-4 items-start">
              <span className="font-semibold rounded-[10px] bg-[#EAF0FF] text-[#0057FF] border border-[#C8D8FF] grid place-items-center shrink-0 size-9 text-base">
                3
              </span>
              <div>
                <h3 className="font-semibold text-[17px] text-[#19243B] mb-1.5">
                  Practise
                </h3>
                <p className="text-[#526078] text-[14px] leading-[1.65] max-w-[300px]">
                  Work through questions and make room for what needs another look.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20">
          <div className="flex flex-col sm:flex-row mb-8 sm:mb-9 justify-between items-start sm:items-end gap-2">
            <h2 className="font-semibold text-[26px] sm:text-[30px] tracking-tight text-[#19243B]">
              A place for every part of studying.
            </h2>
            <p className="text-[#526078] text-[14px]">
              Less searching. More understanding.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            
            <div className="rounded-2xl bg-white border border-[#E2E0D9] p-6 hover:shadow-md hover:border-[#0057FF]/30 transition-all">
              <div className="rounded-[10px] bg-[#EAF0FF] text-[#0057FF] grid mb-[18px] place-items-center size-[38px]">
                <BookOpen className="size-5" />
              </div>
              <h3 className="font-semibold text-[17px] text-[#19243B] mb-1.5">
                Study materials
              </h3>
              <p className="text-[#526078] text-[14px] leading-[1.65]">
                Give your lecture notes, readings and slides a home.
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-[#E2E0D9] p-6 hover:shadow-md hover:border-[#0057FF]/30 transition-all">
              <div className="rounded-[10px] bg-[#EAF0FF] text-[#0057FF] grid mb-[18px] place-items-center size-[38px]">
                <Files className="size-5" />
              </div>
              <h3 className="font-semibold text-[17px] text-[#19243B] mb-1.5">
                Past papers
              </h3>
              <p className="text-[#526078] text-[14px] leading-[1.65]">
                Keep past exam questions close to the materials that matter.
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-[#E2E0D9] p-6 hover:shadow-md hover:border-[#0057FF]/30 transition-all">
              <div className="rounded-[10px] bg-[#EAF0FF] text-[#0057FF] grid mb-[18px] place-items-center size-[38px]">
                <MessageCircleCheck className="size-5" />
              </div>
              <h3 className="font-semibold text-[17px] text-[#19243B] mb-1.5">
                Answers
              </h3>
              <p className="text-[#526078] text-[14px] leading-[1.65]">
                Make sense of tricky topics with clear, material-based answers.
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-[#E2E0D9] p-6 hover:shadow-md hover:border-[#0057FF]/30 transition-all">
              <div className="rounded-[10px] bg-[#EAF0FF] text-[#0057FF] grid mb-[18px] place-items-center size-[38px]">
                <Play className="size-5" />
              </div>
              <h3 className="font-semibold text-[17px] text-[#19243B] mb-1.5">
                Practice mode
              </h3>
              <p className="text-[#526078] text-[14px] leading-[1.65]">
                Take one question at a time and build your understanding.
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-[#E2E0D9] p-6 hover:shadow-md hover:border-[#0057FF]/30 transition-all">
              <div className="rounded-[10px] bg-[#EAF0FF] text-[#0057FF] grid mb-[18px] place-items-center size-[38px]">
                <ChartNoAxesCombined className="size-5" />
              </div>
              <h3 className="font-semibold text-[17px] text-[#19243B] mb-1.5">
                Paper predictor
              </h3>
              <p className="text-[#526078] text-[14px] leading-[1.65]">
                Explore possible exam topics to help guide your revision.
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-[#E2E0D9] p-6 hover:shadow-md hover:border-[#0057FF]/30 transition-all">
              <div className="rounded-[10px] bg-[#EAF0FF] text-[#0057FF] grid mb-[18px] place-items-center size-[38px]">
                <Users className="size-5" />
              </div>
              <h3 className="font-semibold text-[17px] text-[#19243B] mb-1.5">
                Community
              </h3>
              <p className="text-[#526078] text-[14px] leading-[1.65]">
                Find shared study content and make it your own.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 pb-12 sm:pb-16">
        <div className="rounded-2xl bg-[#EAF0FF] border border-[#C8D8FF] flex flex-col md:flex-row p-8 sm:p-10 justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="font-semibold text-[24px] sm:text-[29px] tracking-tight text-[#19243B] mb-1.5">
              Study better, together.
            </h2>
            <p className="text-[#526078] font-medium text-sm sm:text-base">
              You don't have to study alone.
            </p>
            <p className="text-[#526078] text-[14px] mt-2">
              Explore and clone shared study content from the community.
            </p>
          </div>
          <button
            onClick={() => openAuthModal('login')}
            className="rounded-[10px] bg-[#0057FF] hover:bg-[#0047D4] text-white px-5 sm:px-6 h-11 text-sm font-medium shrink-0 shadow-sm transition-all flex items-center gap-2"
          >
            <span>Explore Community</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </section>

      <section className="text-center bg-white border-t border-[#E2E0D9] py-14 sm:py-16 px-6 sm:px-12 lg:px-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-semibold text-[26px] sm:text-[30px] tracking-tight text-[#19243B] mb-6">
            Make room for better study sessions.
          </h2>
          <button
            onClick={() => openAuthModal('register')}
            className="rounded-[10px] bg-[#0057FF] hover:bg-[#0047D4] text-white px-6 h-11 sm:h-12 text-sm sm:text-base font-medium inline-flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>Create your account</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </section>

      <footer className="border-t border-[#E2E0D9] bg-[#F8F7F4] py-6 sm:py-8 px-6 sm:px-12 lg:px-20">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="font-semibold text-base flex items-center gap-2.5 select-none text-[#19243B]">
            <span className="rounded-lg bg-[#0057FF] text-white grid place-items-center size-[29px] shadow-xs">
              <BookOpen className="size-[17px]" />
            </span>
            <span>AcademicStack</span>
          </div>
          <nav
            className="text-[#526078] text-[13px] flex items-center gap-6"
            aria-label="Footer account links"
          >
            <button
              onClick={() => openAuthModal('login')}
              className="hover:text-[#19243B] transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="hover:text-[#19243B] transition-colors"
            >
              Create account
            </button>
          </nav>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;
