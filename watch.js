const SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY";
const demo=[
{id:"demo-1",title:"Midnight Run",slug:"midnight-run",description:"A city never sleeps, and neither do the secrets hiding in its shadows.",year:2026,genre:"Action",age_rating:"16+",content_type:"Movie"},
{id:"demo-2",title:"The Last Door",slug:"the-last-door",description:"Some doors should never be opened.",year:2025,genre:"Horror",age_rating:"18+",content_type:"Movie"}
];
const $=id=>document.getElementById(id);
async function init(){
 const slug=new URLSearchParams(location.search).get("slug");
 let item=null;
 if(SUPABASE_URL.startsWith("https://")&&SUPABASE_ANON_KEY.length>30){
  const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
  const {data}=await db.from("movies").select("*").eq("slug",slug).maybeSingle();item=data;
  if(!item){const byId=await db.from("movies").select("*").eq("id",slug).maybeSingle();item=byId.data;}
 }else item=demo.find(x=>x.slug===slug||x.id===slug);
 if(!item){$("watchTitle").textContent="Title not found";$("watchDescription").textContent="This title may have been removed or the link is incorrect. Return to browse the library.";return;}
 $("watchTitle").textContent=item.title;$("watchDescription").textContent=item.description||"";
 $("watchKicker").textContent=`${item.content_type||"MOVIE"} · CINEVA`;
 $("watchMeta").innerHTML=[item.year,item.genre,item.age_rating,item.rating?`★ ${item.rating}`:""].filter(Boolean).map(x=>`<span>${String(x).replace(/[&<>"']/g,"")}</span>`).join("");
 if(item.video_url){
  const video=$("videoPlayer");video.src=item.video_url;video.hidden=false;$("playerPlaceholder").hidden=true;
  video.addEventListener("error",()=>{$("playerMessage").hidden=false;$("playerMessage").textContent="The video could not be played. Check the video URL and file permissions in Supabase Storage."});
 }else{
  $("playerPlaceholder").innerHTML=`<div class="play-symbol">▶</div><p>${item.video_url?"":"COMING SOON"}</p><span>The video file has not been added to this title yet.</span>`;
 }
 document.title=`${item.title} — CINEVA`;
 $("shareBtn").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(location.href);$("shareBtn").textContent="✓ Link copied";}catch{ $("shareBtn").textContent="Copy URL from address bar";}});
}
$("yearNow").textContent=new Date().getFullYear();init();