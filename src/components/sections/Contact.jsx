import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { BsTerminal, BsEnvelope, BsCodeSlash, BsArrowRight } from 'react-icons/bs';
import ScrollReveal from '../ui/ScrollReveal';
import Magnet from '../ui/Magnet';

const Contact = ({ darkMode, t }) => {
  const formRef = useRef();
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '', honey: '' });
  const [isSending, setIsSending] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    if (contactForm.honey) {
      setFormSubmitted(true);
      setTimeout(() => setFormSubmitted(false), 3000);
      return;
    }

    setIsSending(true);
    // เปลี่ยน process.env... เป็นค่าของคุณ หรือรับจาก Prop
    const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then(() => {
        setFormSubmitted(true);
        setContactForm({ name: '', email: '', message: '', honey: '' });
        setIsSending(false);
        setTimeout(() => setFormSubmitted(false), 5000);
      }, (error) => {
        alert("Error sending message.");
        setIsSending(false);
      });
  };

  return (
    <section id="section-contact" data-section="contact" className="max-w-2xl mx-auto">
      <ScrollReveal>
        <div className={`hover-card border rounded shadow-2xl overflow-hidden ${darkMode ? 'border-slate-700 bg-slate-950' : 'border-slate-300 bg-white'}`}>
          <div className={`px-4 py-2 border-b flex items-center gap-2 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div className="ml-4 font-mono text-xs text-slate-500">root@arunburapha:~</div>
          </div>
          <div className="p-8 font-mono">
            <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
              <div className="flex flex-col">
                <label className={`text-xs mb-1 flex items-center gap-2 ${darkMode ? 'text-cyan-600' : 'text-cyan-700'}`}>
                  <BsTerminal /> {t.contactName}
                </label>
                <input
                  name="user_name"
                  className={`border p-2 focus:outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-emerald-400 focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-cyan-500'}`}
                  type="text"
                  value={contactForm.name}
                  onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                />
              </div>

              {/* Honeypot */}
              <div className="hidden">
                <input
                  name="honey_trap"
                  type="text"
                  value={contactForm.honey}
                  onChange={e => setContactForm({ ...contactForm, honey: e.target.value })}
                  tabIndex="-1"
                  autoComplete="off"
                />
              </div>

              <div className="flex flex-col">
                <label className={`text-xs mb-1 flex items-center gap-2 ${darkMode ? 'text-cyan-600' : 'text-cyan-700'}`}>
                  <BsEnvelope /> {t.contactEmail}
                </label>
                <input
                  name="user_email"
                  className={`border p-2 focus:outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-emerald-400 focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-cyan-500'}`}
                  type="email"
                  value={contactForm.email}
                  onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className={`text-xs mb-1 flex items-center gap-2 ${darkMode ? 'text-cyan-600' : 'text-cyan-700'}`}>
                  <BsCodeSlash /> {t.contactMessage}
                </label>
                <textarea
                  name="message"
                  rows="4"
                  className={`border p-2 focus:outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-emerald-400 focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-cyan-500'}`}
                  value={contactForm.message}
                  onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                ></textarea>
              </div>

              <Magnet magnetStrength={30}>
                <button
                  type="submit"
                  disabled={isSending}
                  className={`w-full py-3 border font-bold flex justify-center items-center gap-2 transition-all 
                  ${isSending ? 'opacity-50 cursor-wait' : ''}
                  ${darkMode ? 'bg-cyan-900/50 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950' : 'bg-cyan-100 border-cyan-500 text-cyan-800 hover:bg-cyan-500 hover:text-white'}`}
                >
                  {isSending ? (
                    <>SENDING DATA... <span className="animate-spin">⟳</span></>
                  ) : (
                    <>{t.sendMessage} <BsArrowRight /></>
                  )}
                </button>
              </Magnet>
              {formSubmitted && (
                <div className={`text-center p-2 rounded border ${darkMode ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-400' : 'bg-emerald-100 border-emerald-500/50 text-emerald-700'}`}>
                  ✅ {t.messageSent}
                </div>
              )}
            </form>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default Contact;