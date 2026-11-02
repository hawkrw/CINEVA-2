# CINEVA — streaming website starter

A responsive, dark cinema-style movie/series catalogue inspired by your screenshots. It includes:
- Home page with featured hero, Latest Added, Movies, Series, genre collections and searchable All Titles grid.
- Watch page that loads a title by URL slug and plays its `video_url`.
- Supabase database integration using the browser Supabase JS client.
- Demo mode with sample cards until you configure Supabase.
- Mobile navigation, detail modal, genre filters and load-more behaviour.

## 1. Configure Supabase
1. Create a project at https://supabase.com.
2. Open **SQL Editor**, paste `supabase-schema.sql`, and run it.
3. In **Project Settings → API**, copy the Project URL and anon/public key.
4. In `app.js` and `watch.js`, replace:
   - `YOUR_SUPABASE_PROJECT_URL`
   - `YOUR_SUPABASE_ANON_KEY`
5. Keep the anon key in the browser only with Row Level Security enabled. Never put your `service_role` key in frontend code.

## 2. Add movie or series content
Insert rows into `public.movies` through Supabase Table Editor. Suggested fields:
- `title`: display title
- `slug`: unique URL-friendly title, e.g. `my-first-film`
- `description`
- `poster_url`: publicly accessible poster image URL
- `backdrop_url`: wide hero image URL
- `video_url`: direct playable MP4/HLS URL for content you own or are licensed to stream
- `year`, `genre`, `rating`, `age_rating`
- `content_type`: `Movie` or `Series`
- `is_featured`: turn on to include it in the home hero

New records automatically appear in Latest Added because the page sorts by `created_at` descending. Use a unique slug for every title.

## 3. Run locally
Because the project uses browser JavaScript modules/CDN assets and Supabase requests, serve it from a local web server rather than opening the HTML file directly.

Examples:
- VS Code: install **Live Server**, right-click `index.html` → Open with Live Server.
- Python: from this folder run `python -m http.server 5500`, then visit `http://localhost:5500`.

## 4. Publish
Upload the files to Netlify, Vercel static hosting, GitHub Pages, or your preferred static host. Add your production domain to Supabase Authentication URL settings if you later enable sign-in.

## 5. Important production upgrades
This is a polished front-end starter, not a complete paid streaming backend. Before accepting payments or distributing premium media:
- Add Supabase Auth and user profiles.
- Create subscription/payment verification on a trusted backend or Supabase Edge Function.
- Keep premium videos in a **private** Storage bucket; issue short-lived signed URLs only after checking entitlements.
- Do not expose the Supabase service-role key in HTML/JS.
- Add server-side admin-only upload/edit policies.
- Add episode tables and a season/episode selector if you want multi-episode series.
- Add real age-verification and moderation/legal compliance before enabling 18+ content. A simple front-end label is not age verification.
- Only upload and stream films/series for which you hold distribution rights. Respect copyright and local law.

## 6. Current limitations
The Sign in button is a placeholder. The series section currently lists rows with `content_type = 'Series'`; episodes/seasons and payment/subscription workflows need backend implementation. The demo artwork uses remote Unsplash photos and is only illustrative.
