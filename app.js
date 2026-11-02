/* CINEVA front-end. Configure Supabase below before launching. */
const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
const DEMO_MODE = !(SUPABASE_URL.startsWith("https://") && SUPABASE_ANON_KEY.length > 30);

const demoTitles = [
 {id:"demo-1",title:"Midnight Run",slug:"midnight-run",description:"A city never sleeps, and neither do the secrets hiding in its shadows. One decision turns an ordinary night into a race for survival.",poster_url:"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600",backdrop_url:"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1800",year:2026,genre:"Action",rating:"8.4",age_rating:"16+",content_type:"Movie",is_featured:true,created_at:new Date().toISOString()},
 {id:"demo-2",title:"The Last Door",slug:"the-last-door",description:"Some doors should never be opened. A group of friends discover that the abandoned house knows their names.",poster_url:"https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600",backdrop_url:"https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1800",year:2025,genre:"Horror",rating:"7.9",age_rating:"18+",content_type:"Movie"},
 {id:"demo-3",title:"After The Bell",slug:"after-the-bell",description:"Friendship, ambition and first love collide in the final year of high school.",poster_url:"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600",backdrop_url:"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1800",year:2026,genre:"High School",rating:"8.1",age_rating:"13+",content_type:"Series"},
 {id:"demo-4",title:"Parallel Hearts",slug:"parallel-hearts",description:"Two strangers find their lives crossing in ways neither could have imagined.",poster_url:"https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600",year:2025,genre:"Drama",rating:"8.0",age_rating:"13+",content_type:"Movie"},
 {id:"demo-5",title:"Laugh Track",slug:"laugh-track",description:"A chaotic group of neighbours turn every small problem into a big comedy.",poster_url:"https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600",year:2024,genre:"Comedy",rating:"7.6",age_rating:"13+",content_type:"Series"},
 {id:"demo-6",title:"Neon Legends",slug:"neon-legends",description:"An animated adventure across a glowing world where courage is the rarest power.",poster_url:"https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=600",year:2026,genre:"Animation",rating:"8.7",age_rating:"All Ages",content_type:"Movie"},
 {id:"demo-7",title:"Velvet Nights",slug:"velvet-nights",description:"A mature romantic drama about attraction, boundaries and the choices that shape relationships.",poster_url:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600",year:2026,genre:"Erotic",rating:"7.3",age_rating:"18+",content_type:"Movie"},
 {id:"demo-8",title:"Shaque",slug:"shaque",description:"Trust is fragile. When a family secret resurfaces, every relationship is put to the test.",poster_url:"https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600",year:2026,genre:"Drama",rating:"8.2",age_rating:"16+",content_type:"Series"}
];

let supabaseClient = null, titles = [], activeHero = 0, allLimit = 12, selectedGenre = "All";
const $ = id => document.getElementById(id);
const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function initSupabase(){
  if(!DEMO_MODE && window.supabase?.createClient) supabaseClient = window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
}
async function loadTitles(){
  initSupabase();
  if(supabaseClient){
    const {data,error} = await supabaseClient.from("movies").select("*").order("created_at",{ascending:false});
    if(error){console.error(error);notify("Could not load the catalogue. Check your Supabase table and policies.");titles=demoTitles;}
    else titles=data||[];
  } else titles=demoTitles;
  renderAll();
}
const featured = () => titles.filter(x=>x.is_featured);
function cardHTML(item){
  const image=item.poster_url||item.backdrop_url||"";
  return `<article class="poster-card" data-id="${escapeHTML(item.id)}" tabindex="0" role="button" aria-label="View ${escapeHTML(item.title)}">
    <div class="poster-image">${image?`<img loading="lazy" src="${escapeHTML(image)}" alt="${escapeHTML(item.title)} poster" onerror="this.style.display='none'">`:""}<span class="age-tag">${escapeHTML(item.age_rating||"ALL AGES")}</span></div>
    <div class="poster-info"><h3>${escapeHTML(item.title)}</h3><div class="poster-sub">${escapeHTML(item.year||"")} · ${escapeHTML(item.genre||"Drama")} · ${escapeHTML(item.content_type||"Movie")}</div><div class="poster-date">${item.rating?`★ ${escapeHTML(item.rating)}`:"Recently added"}</div></div>
  </article>`;
}
function renderRow(id,list){$(id).innerHTML=list.length?list.map(cardHTML).join(""):`<div class="loading-state">No titles here yet. Add content in your Supabase dashboard.</div>`;}
function renderHero(){
  const list=featured().length?featured():titles.slice(0,5);
  if(!list.length)return;
  activeHero=(activeHero+list.length)%list.length;
  const item=list[activeHero];
  $("heroTitle").innerHTML=escapeHTML(item.title).replace(/\s+/g,"<br>");
  $("heroDescription").textContent=item.description||"Discover your next favourite story on CINEVA.";
  $("heroMeta").innerHTML=[item.year,item.genre,item.age_rating||"HD"].filter(Boolean).map(v=>`<span>${escapeHTML(v)}</span>`).join("");
  $("hero").style.setProperty("--hero-image",`url("${(item.backdrop_url||item.poster_url||"").replace(/"/g,"%22")}")`);
  $("heroWatch").href=`watch.html?slug=${encodeURIComponent(item.slug||item.id)}`;
  $("heroInfo").dataset.id=item.id;
  $("heroCounter").textContent=`${String(activeHero+1).padStart(2,"0")} / ${String(list.length).padStart(2,"0")}`;
}
function renderGenreCollections(){
  const genres=["Action","Horror","Erotic","Drama","High School","Animation","Comedy"];
  $("genreCollections").innerHTML=genres.map(g=>{
    const list=titles.filter(t=>(t.genre||"").toLowerCase()===g.toLowerCase()).slice(0,8);
    return list.length?`<div class="genre-collection"><div class="section-heading"><div><span class="kicker">EXPLORE BY GENRE</span><h2>${escapeHTML(g.toUpperCase())}</h2></div><a class="see-all" href="#allContent" data-filter="${escapeHTML(g)}">View collection →</a></div><div class="poster-row">${list.map(cardHTML).join("")}</div></div>`:"";
  }).join("");
}
function renderAll(){
  renderHero();
  renderRow("latestRow",[...titles].sort((a,b)=>new Date(b.created_at||0)-new Date(a.created_at||0)).slice(0,12));
  renderRow("moviesRow",titles.filter(x=>(x.content_type||"Movie").toLowerCase()==="movie").slice(0,12));
  renderRow("seriesRow",titles.filter(x=>(x.content_type||"").toLowerCase()==="series").slice(0,12));
  renderGenreCollections(); renderGrid();
}
function renderGrid(){
  const filtered=titles.filter(t=>{
    const genreOK=selectedGenre==="All"||(t.genre||"").toLowerCase()===selectedGenre.toLowerCase();
    const query=($("searchInput").value||"").trim().toLowerCase();
    const searchOK=!query||[t.title,t.genre,t.description,t.content_type].join(" ").toLowerCase().includes(query);
    return genreOK&&searchOK;
  });
  $("allCount").textContent=`${filtered.length} title${filtered.length===1?"":"s"} in this collection.`;
  $("allGrid").innerHTML=filtered.slice(0,allLimit).map(cardHTML).join("")||`<p class="loading-state">No matching titles found.</p>`;
  $("loadMore").style.display=filtered.length>allLimit?"block":"none";
}
function showDetails(id){
  const item=titles.find(t=>String(t.id)===String(id));if(!item)return;
  $("modalTitle").textContent=item.title;$("modalDescription").textContent=item.description||"More details coming soon.";
  $("modalKicker").textContent=`${item.year||"CINEVA"} · ${item.genre||"FEATURED"}`;
  $("modalMeta").innerHTML=[item.age_rating,item.content_type,item.rating?`★ ${item.rating}`:""].filter(Boolean).map(v=>`<span>${escapeHTML(v)}</span>`).join("");
  $("modalBackdrop").style.backgroundImage=`url("${item.backdrop_url||item.poster_url||""}")`;
  $("modalWatch").href=`watch.html?slug=${encodeURIComponent(item.slug||item.id)}`;
  $("detailModal").classList.add("open");$("detailModal").setAttribute("aria-hidden","false");
}
function notify(message){const t=$("toast");t.textContent=message;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600);}
document.addEventListener("click",e=>{
  const card=e.target.closest(".poster-card");if(card)showDetails(card.dataset.id);
  const filter=e.target.closest("[data-filter]");if(filter){selectedGenre=filter.dataset.filter;renderGrid();}
  const pill=e.target.closest(".genre-pill");if(pill){selectedGenre=pill.dataset.genre;document.querySelectorAll(".genre-pill").forEach(p=>p.classList.toggle("selected",p===pill));renderGrid();$("allContent").scrollIntoView({behavior:"smooth"});}
});
document.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.classList.contains("poster-card"))showDetails(e.target.dataset.id);if(e.key==="Escape")$("detailModal").classList.remove("open");});
$("heroPrev").addEventListener("click",()=>{activeHero--;renderHero()});$("heroNext").addEventListener("click",()=>{activeHero++;renderHero()});
$("heroInfo").addEventListener("click",e=>showDetails(e.currentTarget.dataset.id));
$("modalClose").addEventListener("click",()=>$("detailModal").classList.remove("open"));
$("detailModal").addEventListener("click",e=>{if(e.target===$("detailModal"))$("detailModal").classList.remove("open")});
$("searchInput").addEventListener("input",renderGrid);
$("loadMore").addEventListener("click",()=>{allLimit+=12;renderGrid()});
$("mobileMenu").addEventListener("click",()=>$("mainNav").classList.toggle("open"));
$("accountBtn").addEventListener("click",()=>notify("Member accounts are not enabled yet. Connect Supabase Auth to add sign-in."));
document.querySelector(".search-box span").addEventListener("click",()=>{document.querySelector(".search-box").classList.toggle("expanded");$("searchInput").focus()});
$("yearNow").textContent=new Date().getFullYear();
loadTitles();
