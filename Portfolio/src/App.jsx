import { useState, useEffect, useRef } from "react";
import profileImage from "./assets/image.png";

/* ─── Google Fonts + minimal global overrides ─── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=DM+Mono:wght@300;400;500&family=Syne:wght@400;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #080b0f; cursor: none; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: #080b0f; }
  ::-webkit-scrollbar-thumb { background: #b8f724; }

  .font-fraunces { font-family: 'Fraunces', Georgia, serif; }
  .font-mono     { font-family: 'DM Mono', 'Courier New', monospace; }
  .font-syne     { font-family: 'Syne', sans-serif; }

  /* cursor */
  .cur-dot  { position:fixed; width:10px; height:10px; background:#b8f724; border-radius:50%; pointer-events:none; z-index:9999; mix-blend-mode:difference; transition:transform .15s; }
  .cur-ring { position:fixed; width:34px; height:34px; border:1.5px solid #b8f724; border-radius:50%; pointer-events:none; z-index:9998; opacity:.55; transition:left .1s ease,top .1s ease; mix-blend-mode:difference; }

  /* noise overlay */
  .noise { position:fixed; inset:0; pointer-events:none; z-index:1000; opacity:.22;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E"); }

  /* grid */
  .grid-bg { background-image:linear-gradient(rgba(184,247,36,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(184,247,36,.07) 1px,transparent 1px); background-size:56px 56px; animation:gridDrift 18s linear infinite; }
  @keyframes gridDrift { to { background-position: 0 56px; } }

  /* orbs */
  @keyframes orbFloat { 0%,100%{transform:translateY(0) scale(1);} 50%{transform:translateY(-28px) scale(1.06);} }
  @keyframes rotateSlow { to { transform:rotate(360deg); } }
  @keyframes pulseDot { 0%,100%{box-shadow:0 0 0 0 rgba(184,247,36,.5);} 50%{box-shadow:0 0 0 10px rgba(184,247,36,0);} }

  /* reveal */
  .reveal { opacity:0; transform:translateY(36px); transition:opacity .75s ease, transform .75s ease; }
  .reveal.in { opacity:1; transform:translateY(0); }
  .reveal-l { opacity:0; transform:translateX(-40px); transition:opacity .75s ease, transform .75s ease; }
  .reveal-l.in { opacity:1; transform:translateX(0); }
  .reveal-r { opacity:0; transform:translateX(40px); transition:opacity .75s ease, transform .75s ease; }
  .reveal-r.in { opacity:1; transform:translateX(0); }

  /* stagger delays */
  .d1{transition-delay:.05s;} .d2{transition-delay:.15s;} .d3{transition-delay:.25s;} .d4{transition-delay:.35s;} .d5{transition-delay:.45s;}

  /* hero fade-up */
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px);} to{opacity:1;transform:none;} }
  .fade-up { opacity:0; animation:fadeUp .8s ease forwards; }
  .fu1{animation-delay:.25s;} .fu2{animation-delay:.45s;} .fu3{animation-delay:.65s;} .fu4{animation-delay:.85s;}

  /* skill card shimmer bar */
  .skill-bar::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#b8f724,#f724b8); transform:scaleX(0); transform-origin:left; transition:transform .4s ease; }
  .skill-bar:hover::before { transform:scaleX(1); }

  /* project ghost num */
  .proj-ghost::after { content:attr(data-n); position:absolute; top:-8px; right:12px; font-family:'Fraunces',serif; font-size:5.5rem; font-weight:900; color:rgba(184,247,36,.04); line-height:1; pointer-events:none; transition:color .3s; }
  .proj-ghost:hover::after { color:rgba(184,247,36,.09); }

  /* link underline */
  .nav-ul { position:relative; }
  .nav-ul::after { content:''; position:absolute; bottom:-3px; left:0; right:0; height:1px; background:#b8f724; transform:scaleX(0); transition:transform .2s ease; }
  .nav-ul:hover::after { transform:scaleX(1); }

  /* parallax will-change */
  .parallax-el { will-change: transform; }

  /* section label line */
  .s-label::before { content:''; display:inline-block; width:28px; height:1px; background:#b8f724; margin-right:12px; vertical-align:middle; }

  /* exp bullet */
  .exp-li::before { content:'→'; position:absolute; left:0; color:#f724b8; }

  /* btn */
  .btn-lime { background:#b8f724; color:#080b0f; font-family:'DM Mono',monospace; font-size:.78rem; letter-spacing:.1em; text-transform:uppercase; padding:.8rem 1.9rem; border:none; cursor:none; font-weight:500; transition:transform .2s,box-shadow .2s; text-decoration:none; display:inline-block; }
  .btn-lime:hover { transform:translate(-3px,-3px); box-shadow:6px 6px 0 #f724b8; }
  .btn-ghost { background:transparent; color:#e8e4dd; font-family:'DM Mono',monospace; font-size:.78rem; letter-spacing:.1em; text-transform:uppercase; padding:.8rem 1.9rem; border:1px solid rgba(184,247,36,.2); cursor:none; transition:transform .2s,border-color .2s,color .2s; text-decoration:none; display:inline-block; }
  .btn-ghost:hover { transform:translate(-3px,-3px); border-color:#b8f724; color:#b8f724; }

  @media(max-width:768px){
    .hero-right-col{display:none!important;}
    .hero-grid{grid-template-columns:1fr!important;}
    .about-grid{grid-template-columns:1fr!important; gap:2.5rem!important;}
    .contact-grid{grid-template-columns:1fr!important; gap:2.5rem!important;}
    .exp-grid{grid-template-columns:1fr!important; gap:.5rem!important;}
    .nav-links{display:none!important;}
    section{padding:4rem 1.25rem!important;}
    nav{padding:1.1rem 1.25rem!important;}
  }
`;

/* ─── DATA ─── */
const SKILLS = [
  { icon: "⬡", cat: "Front-End",       tags: ["HTML", "CSS", "JavaScript ES6+", "React.js"] },
  { icon: "◈", cat: "Back-End",         tags: ["Node.js", "Express.js", "REST APIs", "Django"] },
  { icon: "◉", cat: "Database",         tags: ["MongoDB", "Mongoose", "SQLite"] },
  { icon: "◊", cat: "Auth & Security",  tags: ["JWT Authentication", "Role-Based Access Control"] },
  { icon: "△", cat: "ML / Tools",       tags: ["Python", "TensorFlow", "Keras", "OpenCV", "Git", "GitHub"] },
];

const PROJECTS = [
  { n:"01", title:"PetPal",        sub:"MERN Stack Pet Adoption Platform",
    desc:"Full-stack pet adoption platform with JWT authentication and role-based access for users. Responsive React UI for managing pets, profiles, and adoption requests. Scalable MongoDB backend with smooth frontend integration.",
    tech:["React","Node.js","Express","MongoDB","JWT"] },
  { n:"02", title:"BlogCraft",     sub:"Blog Management System",
    desc:"Secure blog platform with complete CRUD functionality, authentication flows, and an admin dashboard. Integrated JWT and MongoDB for scalable, reliable data storage.",
    tech:["MERN Stack","JWT","REST API","Admin Dashboard"] },
  { n:"03", title:"EventFlow",     sub:"Event Management System",
    desc:"Event booking and management platform with dynamic routing and RESTful APIs. Admins can create, update, and manage event listings with full CRUD operations.",
    tech:["MERN Stack","Dynamic Routing","REST APIs"] },
  { n:"04", title:"SheepVision",   sub:"Deep Learning Breed Identifier",
    desc:"Image classification system using VGG16 architecture to identify sheep breeds. Dataset preprocessing, augmentation, fine-tuning, and model training. Research paper published in IJARCCE.",
    tech:["Python","TensorFlow","VGG16","OpenCV","Keras"] },
];

const CONTACT_LINKS = [
  { label:"Email",    val:"meghanaar222@gmail.com",                 href:"mailto:meghanaar222@gmail.com" },
  { label:"Phone",    val:"+91 97411 85015",                        href:"tel:9741185015" },
  { label:"LinkedIn", val:"meghana-rangaswamy-4862b5237",           href:"https://linkedin.com/in/meghana-rangaswamy-4862b5237/" },
  { label:"GitHub",   val:"Meghana8204",                            href:"https://github.com/Meghana8204" },
];

const STATS = [
  { n:"4+", l:"MERN Projects" }, { n:"1", l:"Research Paper" },
  { n:"8.2", l:"CGPA" },         { n:"∞", l:"Curiosity" },
];

const FLOAT_BADGES = [
  { label:"React.js",  color:"#61dafb", top:"-14px",  right:"-56px", delay:"0s" },
  { label:"Node.js",   color:"#8cc84b", bottom:"50px", left:"-64px",  delay:"-1.4s" },
  { label:"MongoDB",   color:"#47a248", top:"55px",   left:"-72px",  delay:"-.7s" },
];

/* ─── COMPONENT ─── */
export default function Portfolio() {
  const dotRef      = useRef(null);
  const ringRef     = useRef(null);
  const parallaxRef = useRef(null);
  const heroRef     = useRef(null);

  /* cursor */
  useEffect(() => {
    const mv = (e) => {
      if (dotRef.current) {
        dotRef.current.style.left  = `${e.clientX - 5}px`;
        dotRef.current.style.top   = `${e.clientY - 5}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${e.clientX - 17}px`;
        ringRef.current.style.top  = `${e.clientY - 17}px`;
      }
    };
    window.addEventListener("mousemove", mv);
    return () => window.removeEventListener("mousemove", mv);
  }, []);

  /* parallax */
  useEffect(() => {
    const onScroll = () => {
      if (!parallaxRef.current || !heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const prog = -rect.top / window.innerHeight;
      parallaxRef.current.style.transform = `translateY(${prog * 110}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* scroll reveal */
  useEffect(() => {
    const els = document.querySelectorAll(".reveal,.reveal-l,.reveal-r");
    const io  = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.1 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (id) => (e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); };

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {/* noise + cursor */}
      <div className="noise" />
      <div className="cur-dot"  ref={dotRef} />
      <div className="cur-ring" ref={ringRef} />

      {/* ══════════════════ NAV ══════════════════ */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:500,
        background:"rgba(8,11,15,.88)", backdropFilter:"blur(18px)",
        borderBottom:"1px solid rgba(184,247,36,.12)",
        display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"1.4rem 4rem" }}>
        <span className="font-fraunces" style={{ color:"#b8f724", fontSize:"1.15rem", fontWeight:700, letterSpacing:"-.01em" }}>
          Meghana A R
        </span>
        <ul className="nav-links" style={{ display:"flex", gap:"2.5rem", listStyle:"none" }}>
          {["about","skills","experience","projects","contact"].map(s => (
            <li key={s}>
              <a href={`#${s}`} onClick={go(s)} className="nav-ul font-mono"
                style={{ fontSize:".68rem", letterSpacing:".15em", textTransform:"uppercase",
                  color:"#6b6b7a", textDecoration:"none", cursor:"none", transition:"color .2s" }}
                onMouseEnter={e=>e.target.style.color="#b8f724"}
                onMouseLeave={e=>e.target.style.color="#6b6b7a"}>
                {s}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ══════════════════ HERO ══════════════════ */}
      <section ref={heroRef} id="home" className="hero-grid"
        style={{ display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:"100vh",
          position:"relative", overflow:"hidden",
          borderBottom:"1px solid rgba(184,247,36,.12)" }}>

        {/* animated grid bg */}
        <div className="grid-bg" style={{ position:"absolute", inset:0, zIndex:0 }} />

        {/* orbs */}
        <div style={{ position:"absolute", width:420, height:420, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(184,247,36,.18),transparent 70%)",
          filter:"blur(75px)", top:-110, right:-110, zIndex:0,
          animation:"orbFloat 9s ease-in-out infinite" }} />
        <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(247,36,184,.13),transparent 70%)",
          filter:"blur(75px)", bottom:60, left:30, zIndex:0,
          animation:"orbFloat 9s ease-in-out infinite", animationDelay:"-4s" }} />

        {/* LEFT */}
        <div style={{ display:"flex", flexDirection:"column", justifyContent:"flex-end",
          padding:"5.5rem 4rem", position:"relative", zIndex:2 }}>

          <p className="fade-up fu1 font-mono s-label"
            style={{ fontSize:".68rem", letterSpacing:".22em", color:"#b8f724",
              textTransform:"uppercase", marginBottom:"1.4rem" }}>
            Full-Stack MERN Developer · Bengaluru, India
          </p>

          <h1 className="fade-up fu2 font-fraunces"
            style={{ fontSize:"clamp(3.8rem,8vw,7.2rem)", fontWeight:900,
              lineHeight:.88, marginBottom:"1.4rem", color:"#e8e4dd" }}>
            Meghana<br />
            <em style={{ color:"#b8f724", fontStyle:"italic" }}>A R</em>
          </h1>

          <p className="fade-up fu3 font-mono"
            style={{ fontSize:".82rem", letterSpacing:".14em", color:"#6b6b7a",
              textTransform:"uppercase", marginBottom:"3rem" }}>
            MERN Stack · REST APIs · Deep Learning
          </p>

          <div className="fade-up fu4" style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
            <a className="btn-lime" href="#projects" onClick={go("projects")}>View Projects</a>
            <a className="btn-ghost" href="#contact"  onClick={go("contact")}>Get In Touch</a>
          </div>
        </div>

        {/* RIGHT — parallax image */}
        <div className="hero-right-col"
          style={{ position:"relative", overflow:"hidden",
            display:"flex", alignItems:"center", justifyContent:"center" }}>

          {/* rotating ring text */}
          <svg style={{ position:"absolute", width:420, height:420, opacity:.13, zIndex:1,
            animation:"rotateSlow 22s linear infinite" }} viewBox="0 0 200 200">
            <defs><path id="cp" d="M100,100 m-75,0 a75,75 0 1,1 150,0 a75,75 0 1,1-150,0"/></defs>
            <text fill="#b8f724" fontSize="11.5" letterSpacing="3.5">
              <textPath href="#cp">MONGODB · EXPRESS · REACT · NODE.JS · </textPath>
            </text>
          </svg>

          {/* parallax wrapper */}
          <div ref={parallaxRef} className="parallax-el"
            style={{ position:"relative", zIndex:2, textAlign:"center" }}>

            {/* spinning conic glow */}
            <div style={{ position:"absolute", inset:"-28px", borderRadius:"50%",
              background:"conic-gradient(from 0deg,rgba(184,247,36,.3),rgba(247,36,184,.2),rgba(66,245,227,.15),rgba(184,247,36,.3))",
              filter:"blur(22px)", animation:"rotateSlow 10s linear infinite", zIndex:0 }} />

            {/* profile image */}
            <div style={{ position:"relative", zIndex:1,
              width:268, height:268, borderRadius:"50%", overflow:"hidden", margin:"0 auto",
              border:"2px solid rgba(184,247,36,.38)",
              boxShadow:"0 0 55px rgba(184,247,36,.2), 0 0 110px rgba(247,36,184,.1)" }}>
              <img
                src={profileImage}
                alt="Meghana A R"
                style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top" }}
              />
              <div style={{ position:"absolute", inset:0, background:"rgba(8,11,15,.1)" }} />
            </div>

            {/* status */}
            <div className="font-mono" style={{ marginTop:"1.4rem", fontSize:".62rem",
              letterSpacing:".22em", color:"#6b6b7a", textTransform:"uppercase" }}>
              Open to Opportunities
            </div>
            <div style={{ display:"inline-block", marginTop:".5rem",
              width:8, height:8, borderRadius:"50%",
              background:"#b8f724", animation:"pulseDot 2s ease-in-out infinite" }} />

            {/* floating tech badges */}
            {FLOAT_BADGES.map(b => (
              <div key={b.label} className="font-mono"
                style={{ position:"absolute", top:b.top, bottom:b.bottom,
                  left:b.left, right:b.right,
                  background:"#16161f", border:`1px solid ${b.color}44`,
                  color:b.color, fontSize:".58rem", letterSpacing:".14em",
                  padding:".3rem .72rem", textTransform:"uppercase",
                  boxShadow:`0 0 18px ${b.color}22`, whiteSpace:"nowrap",
                  animation:`orbFloat 3.2s ease-in-out infinite`,
                  animationDelay:b.delay }}>
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ ABOUT ══════════════════ */}
      <section id="about" style={{ background:"#080b0f", padding:"7rem 4rem" }}>
        <p className="reveal font-mono s-label" style={{ fontSize:".63rem", letterSpacing:".28em",
          textTransform:"uppercase", color:"#b8f724", marginBottom:".6rem" }}>About</p>

        <div className="about-grid" style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:"6rem", alignItems:"center" }}>
          <div className="reveal-l">
            <h2 className="font-fraunces" style={{ fontSize:"clamp(2.4rem,4.5vw,4.2rem)",
              fontWeight:300, lineHeight:1.05, marginBottom:"2.5rem", color:"#e8e4dd" }}>
              Building the web<br />
              <strong style={{ fontWeight:900, color:"#b8f724" }}>one layer at a time</strong>
            </h2>
            {[
              "I'm a Full-Stack MERN Developer with hands-on experience building secure, scalable web applications. From pixel-perfect React UIs to robust Node.js backends, I care deeply about every layer of the stack.",
              "My foundation in Electronics & Communication Engineering gave me an analytical mindset I now apply to software — architecting REST APIs, implementing JWT auth flows, and training deep learning models for computer vision.",
              "Driven by clean code, collaborative teams, and the constant pursuit of new technologies that push the boundaries of what's possible.",
            ].map((t,i) => (
              <p key={i} className="font-mono" style={{ fontSize:".88rem", lineHeight:1.9,
                color:"rgba(232,228,221,.65)", marginBottom:"1.4rem" }}>{t}</p>
            ))}
          </div>

          <div className="reveal-r" style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
            gap:"1px", background:"rgba(184,247,36,.12)" }}>
            {STATS.map(s => (
              <div key={s.l} style={{ background:"#111318", padding:"2.5rem 1.8rem",
                transition:"background .3s" }}
                onMouseEnter={e=>e.currentTarget.style.background="#181d22"}
                onMouseLeave={e=>e.currentTarget.style.background="#111318"}>
                <div className="font-fraunces" style={{ fontSize:"3rem", fontWeight:900,
                  color:"#b8f724", lineHeight:1, marginBottom:".45rem" }}>{s.n}</div>
                <div className="font-mono" style={{ fontSize:".6rem", letterSpacing:".2em",
                  textTransform:"uppercase", color:"#6b6b7a" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ SKILLS ══════════════════ */}
      <section id="skills" style={{ background:"#0d1016", padding:"7rem 4rem",
        borderTop:"1px solid rgba(184,247,36,.1)", borderBottom:"1px solid rgba(184,247,36,.1)" }}>
        <p className="reveal font-mono s-label" style={{ fontSize:".63rem", letterSpacing:".28em",
          textTransform:"uppercase", color:"#b8f724", marginBottom:".6rem" }}>Skills</p>
        <h2 className="reveal font-fraunces" style={{ fontSize:"clamp(2.4rem,4.5vw,4.2rem)",
          fontWeight:300, lineHeight:1.05, marginBottom:"4rem", color:"#e8e4dd" }}>
          The tools I <strong style={{ fontWeight:900, color:"#b8f724" }}>work with</strong>
        </h2>

        <div className="reveal" style={{ display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",
          gap:"1px", background:"rgba(184,247,36,.1)" }}>
          {SKILLS.map((s,i) => (
            <div key={s.cat} className={`skill-bar d${i+1}`}
              style={{ background:"#080b0f", padding:"2.4rem 2rem",
                position:"relative", overflow:"hidden", transition:"transform .3s" }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-4px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
              <div style={{ fontSize:"1.4rem", marginBottom:".9rem", color:"#b8f724" }}>{s.icon}</div>
              <div className="font-mono" style={{ fontSize:".62rem", letterSpacing:".2em",
                textTransform:"uppercase", color:"#b8f724", marginBottom:".7rem" }}>{s.cat}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:".45rem", marginTop:".9rem" }}>
                {s.tags.map(t => (
                  <span key={t} className="font-mono"
                    style={{ fontSize:".6rem", letterSpacing:".1em", padding:".28rem .68rem",
                      border:"1px solid rgba(184,247,36,.15)", color:"#6b6b7a",
                      textTransform:"uppercase", transition:"all .2s", cursor:"default" }}
                    onMouseEnter={e=>{e.target.style.borderColor="#b8f724";e.target.style.color="#b8f724";}}
                    onMouseLeave={e=>{e.target.style.borderColor="rgba(184,247,36,.15)";e.target.style.color="#6b6b7a";}}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════ EXPERIENCE ══════════════════ */}
      <section id="experience" style={{ background:"#080b0f", padding:"7rem 4rem" }}>
        <p className="reveal font-mono s-label" style={{ fontSize:".63rem", letterSpacing:".28em",
          textTransform:"uppercase", color:"#b8f724", marginBottom:".6rem" }}>Experience</p>
        <h2 className="reveal font-fraunces" style={{ fontSize:"clamp(2.4rem,4.5vw,4.2rem)",
          fontWeight:300, lineHeight:1.05, marginBottom:"4rem", color:"#e8e4dd" }}>
          Where I've <strong style={{ fontWeight:900, color:"#b8f724" }}>worked</strong>
        </h2>

        <div className="reveal exp-grid" style={{ display:"grid", gridTemplateColumns:"200px 1fr",
          gap:"3rem", padding:"3rem 0", borderBottom:"1px solid rgba(184,247,36,.1)" }}>
          <div className="font-mono" style={{ fontSize:".68rem", letterSpacing:".14em",
            color:"#6b6b7a", textTransform:"uppercase", paddingTop:".25rem" }}>
            Sep 2024 – Dec 2024
          </div>
          <div>
            <h3 className="font-fraunces" style={{ fontSize:"1.5rem", fontWeight:300,
              color:"#e8e4dd", marginBottom:".2rem" }}>Full Stack Intern</h3>
            <p className="font-mono" style={{ color:"#b8f724", fontSize:".72rem",
              letterSpacing:".14em", textTransform:"uppercase", marginBottom:"1.5rem" }}>
              TechCiti Software Consulting Pvt. Ltd. · Bengaluru
            </p>
            <ul style={{ listStyle:"none" }}>
              {[
                "Developed end-to-end full-stack POC applications using React (frontend) and Django/Node.js (backend) with SQLite/MongoDB for data persistence.",
                "Designed and consumed RESTful APIs, handling CRUD operations and secure data flow between client and server.",
                "Implemented authentication flows and backend logic for health-monitoring use cases.",
                "Collaborated in an Agile environment, using Git for version control and code management.",
              ].map((b,i) => (
                <li key={i} className="exp-li font-mono" style={{ fontSize:".82rem", lineHeight:1.85,
                  color:"rgba(232,228,221,.62)", paddingLeft:"1.5rem", position:"relative",
                  marginBottom:".5rem" }}>{b}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Education sub-section */}
        <div className="reveal" style={{ marginTop:"4rem" }}>
          <p className="font-mono s-label" style={{ fontSize:".63rem", letterSpacing:".28em",
            textTransform:"uppercase", color:"#b8f724", marginBottom:"2rem" }}>Education</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",
            gap:"1px", background:"rgba(184,247,36,.1)" }}>
            {[
              { deg:"BE · Electronics & Communication", inst:"Navkis College of Engineering", score:"CGPA 8.2 / 10" },
              { deg:"Pre-University Course (PUC)",      inst:"Students PU College",           score:"88.9%" },
              { deg:"SSLC",                             inst:"Sri CKS Girls High School",      score:"88.9%" },
            ].map(e => (
              <div key={e.inst} style={{ background:"#080b0f", padding:"2rem 1.8rem",
                transition:"background .3s" }}
                onMouseEnter={x=>x.currentTarget.style.background="#0d1016"}
                onMouseLeave={x=>x.currentTarget.style.background="#080b0f"}>
                <div className="font-fraunces" style={{ fontSize:"1.05rem", fontWeight:700,
                  color:"#e8e4dd", marginBottom:".35rem" }}>{e.deg}</div>
                <div className="font-mono" style={{ fontSize:".68rem", color:"#6b6b7a",
                  letterSpacing:".08em", marginBottom:".5rem" }}>{e.inst}</div>
                <div className="font-mono" style={{ fontSize:".65rem", color:"#b8f724",
                  letterSpacing:".12em" }}>{e.score}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ PROJECTS ══════════════════ */}
      <section id="projects" style={{ background:"#0d1016", padding:"7rem 4rem",
        borderTop:"1px solid rgba(184,247,36,.1)" }}>
        <p className="reveal font-mono s-label" style={{ fontSize:".63rem", letterSpacing:".28em",
          textTransform:"uppercase", color:"#b8f724", marginBottom:".6rem" }}>Projects</p>
        <h2 className="reveal font-fraunces" style={{ fontSize:"clamp(2.4rem,4.5vw,4.2rem)",
          fontWeight:300, lineHeight:1.05, marginBottom:"4rem", color:"#e8e4dd" }}>
          Things I've <strong style={{ fontWeight:900, color:"#b8f724" }}>built</strong>
        </h2>

        <div className="reveal" style={{ display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(310px,1fr))",
          gap:"1px", background:"rgba(184,247,36,.1)" }}>
          {PROJECTS.map(p => (
            <div key={p.n} className="proj-ghost" data-n={p.n}
              style={{ background:"#080b0f", padding:"3rem 2.4rem",
                position:"relative", overflow:"hidden", transition:"transform .3s" }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-5px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
              <div className="font-mono" style={{ fontSize:".62rem", letterSpacing:".2em",
                color:"#b8f724", textTransform:"uppercase", marginBottom:"1.4rem",
                display:"flex", alignItems:"center", gap:".75rem" }}>
                {p.n}
                <span style={{ flex:1, height:1, background:"rgba(184,247,36,.15)", display:"block" }} />
              </div>
              <h3 className="font-fraunces" style={{ fontSize:"1.45rem", fontWeight:700,
                color:"#e8e4dd", marginBottom:".3rem" }}>{p.title}</h3>
              <p className="font-mono" style={{ color:"#b8f724", fontSize:".65rem",
                letterSpacing:".1em", textTransform:"uppercase", marginBottom:".9rem" }}>{p.sub}</p>
              <p className="font-mono" style={{ fontSize:".78rem", lineHeight:1.82,
                color:"#6b6b7a", marginBottom:"1.5rem" }}>{p.desc}</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:".38rem" }}>
                {p.tech.map(t => (
                  <span key={t} className="font-mono"
                    style={{ fontSize:".58rem", letterSpacing:".1em", padding:".22rem .6rem",
                      background:"rgba(184,247,36,.07)", color:"#b8f724",
                      textTransform:"uppercase", border:"1px solid rgba(184,247,36,.18)" }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════ CONTACT ══════════════════ */}
      <section id="contact" style={{ background:"#080b0f", padding:"7rem 4rem",
        borderTop:"1px solid rgba(184,247,36,.1)" }}>
        <p className="reveal font-mono s-label" style={{ fontSize:".63rem", letterSpacing:".28em",
          textTransform:"uppercase", color:"#b8f724", marginBottom:".6rem" }}>Contact</p>

        <div className="contact-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
          gap:"6rem", alignItems:"start" }}>

          {/* left */}
          <div className="reveal-l">
            <h2 className="font-fraunces" style={{ fontSize:"clamp(2.4rem,4.5vw,4.2rem)",
              fontWeight:300, lineHeight:1.05, marginBottom:"2rem", color:"#e8e4dd" }}>
              Let's build<br />
              <strong style={{ fontWeight:900, color:"#b8f724" }}>something</strong><br />
              together
            </h2>
            <p className="font-mono" style={{ fontSize:".88rem", lineHeight:1.9,
              color:"rgba(232,228,221,.62)", marginBottom:"3rem" }}>
              I'm currently open to full-time roles and exciting projects. Whether you have a
              position in mind or just want to say hello — my inbox is always open.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:".8rem" }}>
              {CONTACT_LINKS.map(l => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                  style={{ display:"flex", alignItems:"center", gap:"1rem",
                    textDecoration:"none", padding:".7rem 0",
                    borderBottom:"1px solid rgba(184,247,36,.1)",
                    color:"#6b6b7a", transition:"color .2s" }}
                  onMouseEnter={e=>e.currentTarget.style.color="#b8f724"}
                  onMouseLeave={e=>e.currentTarget.style.color="#6b6b7a"}>
                  <span className="font-mono" style={{ fontSize:".58rem", color:"#b8f724",
                    letterSpacing:".2em", textTransform:"uppercase", minWidth:78 }}>{l.label}</span>
                  <span className="font-mono" style={{ fontSize:".72rem", letterSpacing:".08em",
                    textTransform:"uppercase" }}>{l.val}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer style={{ padding:"2.5rem 4rem",
        borderTop:"1px solid rgba(184,247,36,.1)",
        display:"flex", justifyContent:"space-between", alignItems:"center",
        flexWrap:"wrap", gap:"1rem" }}>
        <p className="font-mono" style={{ fontSize:".62rem", letterSpacing:".14em",
          color:"#6b6b7a", textTransform:"uppercase" }}>
          © 2025 <span style={{ color:"#b8f724" }}>Meghana A R</span> · Designed &amp; Built with ♥
        </p>
        <p className="font-mono" style={{ fontSize:".62rem", letterSpacing:".14em",
          color:"#6b6b7a", textTransform:"uppercase" }}>
          Full-Stack MERN Developer · <span style={{ color:"#b8f724" }}>Bengaluru</span>
        </p>
      </footer>
    </>
  );
}