import React, { useState, useEffect, useRef } from 'react';

// --- SENİN NUMARAN ---
const MY_PHONE_NUMBER = "905350631705"; // Kendi numaranı başında + olmadan yaz

// Dosya yolları (public klasöründe bulunmalı)
const AVATAR_IMG = "/avatar.jpg";
const WALLPAPER_IMG = "/wallpaper.jpg";
const CHAT_BG_IMG = "/chat-bg.jpg";

// --- SOHBET SENARYOSU ---
const CHAT_FLOW = [
  {
    id: 1,
    incoming: "Hi, teacher. How are you?",
    options: [
      { text: "Not you again... 🤦‍♂️ What is it?", nextId: 2 },
      { text: "Hi. I'm okay. What's up?", nextId: 2 }
    ]
  },
  {
    id: 2,
    incoming: "I know things have felt distant these past months, and honestly, the silence has been on my mind for a while.",
    options: [
      { text: "Reached out after all this time?", nextId: 3 },
      { text: "Finally decided to say something.", nextId: 3 }
    ]
  },
  {
    id: 3,
    incoming: "I didn't really have the courage earlier... But I genuinely missed our conversations.\n\nKhob... Delam barat tang shode.",
    options: [
      { text: "Surprised you still remember your Persian.", nextId: 4 },
      { text: "Get straight to the point, what is this about?", nextId: 4 }
    ]
  },
  {
    id: 4,
    incoming: "Well, I guess I got schooled by life these past months... 😅",
    options: [
      { text: "Good to see you learned a lesson.", nextId: 5 },
      { text: "Alright, say what you need to say.", nextId: 5 }
    ]
  },
  {
    id: 5,
    incoming: "I didn't want to just brush it off in text. There's something I wanted to share with you properly...",
    isLetterTrigger: true
  }
];

// --- SAF SVG İKONLAR ---
function IOSSignal() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
      <rect x="0.5" y="8" width="3" height="4" rx="0.8" />
      <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.8" />
      <rect x="8.5" y="3" width="3" height="9" rx="0.8" />
      <rect x="12.5" y="0.5" width="3" height="11.5" rx="0.8" />
    </svg>
  );
}

function IOSWifi() {
  return (
    <svg width="15" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h.01" />
      <path d="M8.5 16.5a5 5 0 0 1 7 0" />
      <path d="M5 13a10 10 0 0 1 14 0" />
    </svg>
  );
}

function IOSBattery() {
  return (
    <div className="flex items-center gap-0.5">
      <div className="w-5 h-2.5 rounded-[4px] border border-white/80 p-0.5 flex items-center">
        <div className="w-3/4 h-full bg-white rounded-[1.5px]"></div>
      </div>
      <div className="w-0.5 h-1 bg-white/70 rounded-r-sm"></div>
    </div>
  );
}

function WhatsAppSVG() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function DoubleCheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#53bdeb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L7 17l-5-5" />
      <path d="M22 10l-7.5 7.5-1.5-1.5" />
    </svg>
  );
}

function KraftEnvelopeMini({ onClick }) {
  return (
    <div 
      onClick={onClick}
      className="cursor-pointer group flex flex-col items-center p-3 rounded-2xl bg-[#1f2c34]/90 backdrop-blur-sm border border-[#b88351]/40 hover:border-[#d99b61] transition-all hover:scale-105 active:scale-95 shadow-2xl max-w-[260px]"
    >
      <div className="relative w-44 h-28 bg-[#b88351] rounded-md shadow-inner overflow-hidden border border-[#966536] flex items-center justify-center">
        <div className="absolute inset-0 border-t-[56px] border-t-transparent border-b-[56px] border-b-[#9e6c3c] border-l-[88px] border-l-[#a67442] border-r-[88px] border-r-[#8f5e31] pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-0 border-l-[88px] border-l-transparent border-r-[88px] border-r-transparent border-t-[60px] border-t-[#c6915c] filter drop-shadow-md group-hover:-translate-y-1 transition-transform"></div>
        <div className="relative z-10 w-7 h-7 rounded-full bg-[#802222] shadow flex items-center justify-center text-[10px] text-amber-200 border border-amber-300/40">
          ✉
        </div>
      </div>
      <div className="mt-2 text-center">
        <p className="text-xs font-semibold text-[#f0caa3] tracking-wide">A Personal Note for You</p>
        <p className="text-[10px] text-neutral-400">Tap to open envelope...</p>
      </div>
    </div>
  );
}

export default function App() {
  const [inChat, setInChat] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'them', text: CHAT_FLOW[0].incoming, time: 'Yesterday 23:42' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(CHAT_FLOW[0]);
  const [envelopeDropped, setEnvelopeDropped] = useState(false);

  const [animationStage, setAnimationStage] = useState('idle');
  const [imgError, setImgError] = useState(false);

  const chatEndRef = useRef(null);
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, envelopeDropped]);

  const handleOpenApp = () => {
    setInChat(true);
  };

  const triggerIncomingStep = (stepId) => {
    const step = CHAT_FLOW.find(s => s.id === stepId);
    if (!step) return;

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'them', text: step.incoming, time: currentTime }]);

      if (step.isLetterTrigger) {
        setTimeout(() => {
          setEnvelopeDropped(true);
        }, 1200);
      } else {
        setCurrentStep(step);
      }
    }, 1400);
  };

  const handleUserReply = (option) => {
    setCurrentStep(null);
    setMessages(prev => [...prev, { sender: 'me', text: option.text, time: currentTime }]);

    if (option.nextId) {
      setTimeout(() => {
        triggerIncomingStep(option.nextId);
      }, 700);
    }
  };

  const startEnvelopeSequence = () => {
    setAnimationStage('opening');
    setTimeout(() => {
      setAnimationStage('paper-out');
    }, 700);
    setTimeout(() => {
      setAnimationStage('fullscreen');
    }, 1500);
  };

  const closeLetter = () => {
    setAnimationStage('idle');
  };

  const handleSendRealWhatsApp = (replyText) => {
    const encoded = encodeURIComponent(replyText);
    const url = `https://wa.me/${MY_PHONE_NUMBER}?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-neutral-950 p-0 sm:p-4 select-none">
      
      {animationStage !== 'fullscreen' ? (
        <div className="relative w-full h-screen sm:w-[390px] sm:h-[844px] bg-black sm:rounded-[54px] shadow-2xl sm:ring-[12px] sm:ring-[#232326] overflow-hidden flex flex-col border border-neutral-800">
          
          {/* Dynamic Island */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[105px] h-[28px] bg-black rounded-full z-50 flex items-center justify-between px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-neutral-800 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-blue-950/80"></div>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-neutral-800"></div>
          </div>

          <div className="w-full h-full flex flex-col relative overflow-hidden">
            
            {!inChat ? (
              /* --- 1. ÖZEL DUVAR KAĞIDI & SAĞ ÜST KÖŞEDE WHATSAPP --- */
              <div 
                className="w-full h-full relative text-white bg-cover bg-center overflow-hidden"
                style={{ backgroundImage: `url(${WALLPAPER_IMG})` }}
              >
                {/* Status Bar */}
                <div className="absolute top-0 left-0 right-0 flex justify-between items-center text-[13px] font-semibold px-6 pt-3.5 z-40">
                  <span>{currentTime}</span>
                  <div className="flex items-center gap-1.5">
                    <IOSSignal />
                    <IOSWifi />
                    <IOSBattery />
                  </div>
                </div>

                {/* Sağ Üst Köşe WhatsApp İkonu */}
                <div className="absolute top-16 right-5 z-30">
                  <div 
                    onClick={handleOpenApp}
                    className="relative flex flex-col items-center cursor-pointer group active:scale-90 transition-transform"
                  >
                    <div className="w-[58px] h-[58px] rounded-[16px] bg-gradient-to-tr from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-2xl shadow-black/80 relative text-white group-hover:scale-105 transition-transform">
                      <WhatsAppSVG />
                      {/* Bildirim Rozeti */}
                      <div className="absolute -top-1.5 -right-1.5 bg-[#ff3b30] text-white font-bold text-[11px] min-w-[22px] h-[22px] px-1 rounded-full flex items-center justify-center ring-[2px] ring-black shadow-lg animate-bounce">
                        1
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-white/95 mt-1 tracking-wide drop-shadow-md">
                      WhatsApp
                    </span>
                  </div>
                </div>

                {/* Alt Kısım: Kilit Açma Yazısı */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
                  <span className="text-[11px] text-white/60 tracking-wider font-light bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm animate-pulse">
                    Swipe up or tap app to unlock
                  </span>
                </div>
              </div>
            ) : (
              /* --- 2. ÖZEL ARKA PLANLI WHATSAPP SOHBET ARAYÜZÜ --- */
              <div className="w-full h-full flex flex-col bg-[#0b141a]">
                
                {/* Header */}
                <div className="w-full bg-[#202c33]/95 backdrop-blur-sm pt-9 pb-2.5 px-3 flex items-center gap-2.5 border-b border-neutral-800 text-white shadow-md z-10">
                  <div 
                    onClick={() => setInChat(false)} 
                    className="cursor-pointer text-[#00a884] text-base font-semibold flex items-center gap-0.5 active:opacity-60"
                  >
                    <span className="text-xl">‹</span> Chats
                  </div>

                  <div className="w-9 h-9 rounded-full overflow-hidden bg-emerald-700 flex items-center justify-center font-bold text-xs text-white border border-neutral-700 flex-shrink-0 ml-1">
                    {!imgError ? (
                      <img 
                        src={AVATAR_IMG} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                        onError={() => setImgError(true)} 
                      />
                    ) : (
                      <span>A</span>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 leading-tight truncate">
                    <span className="text-sm font-semibold truncate">Arda</span>
                    <span className="text-[11px] text-emerald-400 font-medium">
                      {isTyping ? 'typing...' : 'online'}
                    </span>
                  </div>
                </div>

                {/* Mesaj Listesi (Özel Adem'in Yaratılışı Arka Planı) */}
                <div 
                  className="flex-1 overflow-y-auto p-4 space-y-3 bg-cover bg-center bg-no-repeat relative"
                  style={{ backgroundImage: `linear-gradient(rgba(11, 20, 26, 0.72), rgba(11, 20, 26, 0.72)), url(${CHAT_BG_IMG})` }}
                >
                  <div className="bg-[#182229]/80 backdrop-blur-sm border border-neutral-800 text-amber-200/80 text-[10px] text-center p-2 rounded-lg mx-3 mb-4 shadow-sm">
                    Messages and calls are end-to-end encrypted. No one outside of this chat can read them.
                  </div>

                  {messages.map((m, idx) => (
                    <div 
                      key={idx} 
                      className={`flex flex-col max-w-[82%] ${m.sender === 'me' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                    >
                      <div 
                        className={`px-3 py-2 rounded-2xl text-xs relative shadow-md backdrop-blur-sm ${
                          m.sender === 'me' 
                            ? 'bg-[#005c4b]/95 text-neutral-100 rounded-tr-none' 
                            : 'bg-[#202c33]/95 text-neutral-100 rounded-tl-none'
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                        <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-neutral-400">
                          <span>{m.time}</span>
                          {m.sender === 'me' && <DoubleCheckIcon />}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex items-center gap-1 bg-[#202c33]/90 backdrop-blur-sm px-3 py-2 rounded-2xl rounded-tl-none w-14 text-neutral-400 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse delay-75"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse delay-150"></span>
                    </div>
                  )}

                  {envelopeDropped && animationStage === 'idle' && (
                    <div className="flex flex-col items-center my-4 animate-fade-in">
                      <KraftEnvelopeMini onClick={startEnvelopeSequence} />
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Seçenek Butonları */}
                {currentStep && currentStep.options && (
                  <div className="bg-[#202c33]/95 backdrop-blur-md p-3 border-t border-neutral-800 flex flex-col gap-2">
                    <span className="text-[10px] text-neutral-400 px-1 font-medium">Select a response:</span>
                    <div className="flex flex-col gap-1.5">
                      {currentStep.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleUserReply(opt)}
                          className="w-full text-left px-3.5 py-2.5 rounded-xl bg-[#2a3942] hover:bg-[#32444f] active:scale-[0.99] text-xs text-neutral-100 transition border border-neutral-700/60 font-medium shadow-sm"
                        >
                          {opt.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Bar */}
                <div className="bg-[#202c33] px-3 py-2 flex items-center gap-2 border-t border-neutral-800 text-neutral-400">
                  <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-1.5 text-xs text-neutral-400">
                    {currentStep ? "Choose an option above..." : "Type a message..."}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#00a884] flex items-center justify-center text-white text-xs">
                    ➤
                  </div>
                </div>

              </div>
            )}

            {/* Zarf Açılma Sahnesi */}
            {(animationStage === 'opening' || animationStage === 'paper-out') && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-6">
                <div className="relative w-72 h-48 bg-[#b88351] rounded-lg shadow-2xl overflow-visible border border-[#8f5e31] flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#8c572a] rounded-lg"></div>

                  <div 
                    className={`absolute left-3 right-3 h-44 bg-[#fbf9f4] rounded-t-lg shadow-xl border border-amber-200/80 p-4 transition-all duration-1000 ease-out z-10 ${
                      animationStage === 'paper-out' 
                        ? '-translate-y-36 scale-105 opacity-100' 
                        : 'translate-y-2 opacity-80'
                    }`}
                  >
                    <div className="w-12 h-1 bg-amber-900/20 rounded-full mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-2 w-3/4 bg-amber-900/15 rounded"></div>
                      <div className="h-2 w-full bg-amber-900/10 rounded"></div>
                      <div className="h-2 w-5/6 bg-amber-900/10 rounded"></div>
                    </div>
                  </div>

                  <div className="absolute inset-0 border-t-[96px] border-t-transparent border-b-[96px] border-b-[#9e6c3c] border-l-[144px] border-l-[#a67442] border-r-[144px] border-r-[#8f5e31] rounded-b-lg pointer-events-none z-20"></div>

                  <div 
                    className={`absolute top-0 left-0 right-0 h-0 border-l-[144px] border-l-transparent border-r-[144px] border-r-transparent border-t-[98px] border-t-[#c6915c] origin-top transition-transform duration-700 ease-in-out z-30 ${
                      animationStage !== 'idle' ? '[transform:rotateX(180deg)] border-t-[#9e6c3c]' : ''
                    }`}
                  ></div>
                </div>
              </div>
            )}

          </div>

          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full pointer-events-none z-50"></div>
        </div>
      ) : (
        /* --- 3. TAM EKRAN A4 MEKTUP (İNGİLİZCE + FARSÇA DOKUNUŞ) --- */
        <div className="fixed inset-0 bg-[#0e0e11] z-50 overflow-y-auto flex justify-center py-6 sm:py-12 px-3 sm:px-6">
          
          <div 
            className="w-full max-w-2xl bg-[#fbf9f4] text-neutral-800 rounded-sm shadow-[0_30px_90px_rgba(0,0,0,0.85)] border border-[#e5dec9] p-8 sm:p-14 flex flex-col relative my-auto animate-fade-in"
            style={{
              backgroundImage: 'radial-gradient(#d6cdb7 0.85px, transparent 0.85px)',
              backgroundSize: '28px 28px'
            }}
          >
            {/* Üst Başlık & Kapatma */}
            <div className="flex justify-between items-center border-b border-amber-900/15 pb-4 mb-8">
              <span className="text-xs font-serif text-amber-950/60 uppercase tracking-widest font-semibold">
                Personal Letter
              </span>
              <div className="flex items-center gap-4">
                <span className="text-xs font-serif text-amber-950/50">
                  October 2026
                </span>
                <button 
                  onClick={closeLetter}
                  className="w-7 h-7 rounded-full bg-black/5 hover:bg-black/15 text-neutral-600 flex items-center justify-center text-xs font-bold transition"
                  title="Close Letter"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Hitap */}
            <div className="mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                Dear Teacher,
              </h2>
            </div>

            {/* Mektup Gövdesi */}
            <div className="font-serif text-sm sm:text-base leading-relaxed text-neutral-700 space-y-4">
              <p>
                I hope everything is going well for you. As usual, I was sitting in front of my computer around “my usual hour,” and just like I used to do, the idea of creating something like this came to mind. But this time, it’s entirely an effort to apologize. Maybe I can’t clearly pinpoint where I made a mistake, but I take full responsibility for how it made you feel; I admit it, the fault is completely mine, <em>I got schooled</em>—so I don’t even know what else to say…
              </p>
              
              <p>
                I am truly, deeply sorry. My intention was never to hurt you, upset you, or make you angry.
              </p>

              <p>
                At the same time, I also want to thank you. Even if I didn't realize it in the moment, I believe this experience contributed something valuable to my personal growth. Thank you so much for that—though I'm still not sure if such a harsh lesson was necessary for that growth…
              </p>

              <p>
                Next week marks the first year of my "second English life," and at the same time, the first anniversary of meeting you. I am genuinely very happy about that. Over this time, I believe you’ve come to know me, and I think I can say the same for you—at least what you like, what makes you angry, or what you dislike…
              </p>

              <p>
                As you know, I genuinely don’t get along with or care much for “people in general.” It might sound strange, but that's why the circle of people around me is very limited. Keeping it between us, sometimes that even includes my parents, because we often experience clashes of ideas and perspective, which gets very frustrating for me.
              </p>

              <p>
                You know that there are three people in my life whom I truly value, attach profound meaning to, and hold close to my heart: my older brother, my sister, and you. I see my brother once a month; my sister isn't here, as you know, so that only happens once a year. Right now, you are the person I see the most in my life—though with this recent coldness, even that has diminished. To be completely honest, I see you more like an older sister than just an instructor, though I don’t know how you view me.
              </p>

              <p>
                For instance, while writing this note, you seemed quite ill (Oct 8th)—at least your voice and appearance suggested so. To be honest, that really weighed on my mind because I never want the people around me—the people I truly care about—to get sick or hurt. When those people are sick or unhappy, I instinctively feel the same way. When they are happy, even if I’m having a rough day, I genuinely feel happy too.
              </p>

              <p>
                I'd like to share a secret with you, if you'll allow me. I believe you still remember that job offer I received. That profession and position had been my childhood dream, and that day, there was practically no obstacle in front of me to pursue it. We even talked about it by the tram entrance. My mother was strongly against it and felt very upset, and my father felt the same way, but to be honest, I didn't care; my mind was set on going, and I think you realized that too. Until that day we went to feed Kocakafa, and you had that talk with me… I don't know if you recall, but you mentioned a friend—maybe an ex-boyfriend who was a veteran. Then you told me that I was still very young, small (🤏), just this little, and asked what I was going to do out there. Until you said that, leaving was all I could think about; even my parents could never have changed my mind. But when you said that, I gave up on going. That is how important your place is in my life. I don't even know why I'm bringing this up now, but I just wanted to say it. Even writing this made me feel a bit emotional…
              </p>

              <p>
                I think you know how much I care about you. Please don’t misunderstand what I mean: normally, I don’t care about people, and I’ve lost many friends like that because I never make concessions for such things. But you are different to me. I don’t want this connection to end, and I don’t want it to become just a memory of the past. That's why I might have overwhelmed you during this period, and I apologize again, but I genuinely struggle to figure you out sometimes. I find myself reaching out with hope through every open door, hoping that maybe you’ll forgive me, maybe we can make peace.
              </p>

              <p>
                From another perspective, I also owe you a great debt. Initially, my outlook on English was very rigid, but you completely broke down that wall. In fact, thanks to you, I even started learning some Persian—even if just a little—and German. German has been getting quite tough lately so I paused it, but my point is: you changed my entire perspective toward languages and brought out that curiosity in me. If I had never met you, none of this would have been possible. Thank you again for that.
              </p>

              <p className="font-medium text-neutral-900 pt-2">
                Please accept my apology, and allow us to have dinner together. Forgive me or don’t forgive me, but please, let’s just sit down and talk like we used to.
              </p>
            </div>

            {/* FARSÇA ÖZÜR & SEVGİ/ÖZLEM BLOKU */}
            <div className="my-8 p-5 bg-[#f5eee1] rounded-xl border border-amber-900/15 text-center shadow-sm relative overflow-hidden">
              <div className="text-xl sm:text-2xl text-amber-950 font-serif leading-loose tracking-wide select-text" dir="rtl">
                خیلی معذرت می‌خوام، واقعاً دلم برات تنگ شده و خیلی دوستت دارم.
              </div>
              <div className="text-[11px] sm:text-xs text-amber-900/70 italic mt-2 font-serif">
                "I am deeply sorry, I truly miss you, and I care about you so much."
              </div>
            </div>

            {/* İmza */}
            <div className="text-right mt-6 mb-8 font-serif text-sm sm:text-base text-neutral-800">
              <p className="italic text-neutral-600">Sincerely,</p>
              <p className="font-semibold text-neutral-900 text-lg mt-1 tracking-wide">Arda</p>
            </div>

            {/* EN ALT: SAĞLI VE SOLLU TEKLİF BUTONLARI */}
            <div className="pt-6 border-t border-amber-900/15">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block text-center mb-4">
                Your Response:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* SOL BUTON: ÇARŞAMBA */}
                <button
                  onClick={() => handleSendRealWhatsApp("Wednesday works, dinner's on you.")}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>🍽️ Wednesday works, dinner's on you</span>
                </button>

                {/* SAĞ BUTON: PAZAR */}
                <button
                  onClick={() => handleSendRealWhatsApp("Let's do Sunday instead, dinner sounds good.")}
                  className="w-full py-3.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-900 text-white font-medium text-xs sm:text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>🍽️ Let's do Sunday instead, dinner sounds good</span>
                </button>

              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}