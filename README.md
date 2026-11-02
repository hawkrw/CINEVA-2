
# HAWKMOVIES
### YOUR WORLD. YOUR CINEMA.

HAWKMOVIES is a modern movie and series streaming website built with HTML, CSS, JavaScript, and Supabase.

---

## 1. PROJECT STRUCTURE

Your project folder should look like this:

```text
HAWKMOVIES/
│
├── index.html
├── styles.css
├── script.js
│
├── watch.html
├── watch.css
├── watch.js
│
└── supabase-schema.sql
```

---

## 2. TECHNOLOGIES

- HTML5
- CSS3
- JavaScript
- Supabase Database
- Supabase Storage
- HTML5 Video Player

---

## 3. SUPABASE SETUP

1. Visit https://supabase.com/
2. Create an account.
3. Create a new project.
4. Open the SQL Editor.
5. Paste the contents of `supabase-schema.sql`.
6. Run the SQL script.

---

## 4. CONNECT YOUR WEBSITE

Open both:

- `script.js`
- `watch.js`

Find:

```javascript
const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
```

Replace the placeholders with your Supabase project URL and public anon/publishable key.

You can find your project API settings in the Supabase dashboard.

Never put your service-role or secret key in browser JavaScript.

---

## 5. ADDING MOVIES

Open Supabase:

1. Select Table Editor.
2. Open the `movies` table.
3. Add a new record.
4. Enter the movie details.

Example:

| Field | Example |
|---|---|
| title | Shadow Mission |
| slug | shadow-mission |
| description | An action adventure |
| poster_url | Your poster image URL |
| backdrop_url | Your background image URL |
| video_url | Your authorized video URL |
| year | 2026 |
| rating | 8.5 |
| age_rating | 16+ |
| genre | Action |
| content_type | Movie |
| is_featured | true |
| is_published | true |

Use a unique slug for every movie.

---

## 6. AVAILABLE GENRES

- Action
- Horror
- Erotic (18+)
- Drama
- High School
- Animation
- Comedy

Make sure the genre values match the names used by your website.

---

## 7. STORAGE

Recommended Supabase Storage buckets:

- `movie-posters`
- `movie-videos`

Posters can be public.

Keep full-length videos private and use a trusted server-side process to create temporary signed playback URLs.

Only upload content you own or are licensed to distribute.

---

## 8. RUNNING LOCALLY

You can use:

- Visual Studio Code
- Live Server extension
- A local development server

Open the project folder in VS Code.

Right-click `index.html` and choose:

Open with Live Server.

Avoid opening the files directly using `file://` when testing Supabase.

---

## 9. PUBLISHING ONLINE

Possible hosting platforms:

- https://pages.cloudflare.com/
- https://vercel.com/
- https://www.netlify.com/

Upload your project folder or connect your GitHub repository.

Configure your Supabase project and test the website after deployment.

---

## 10. IMPORTANT SECURITY

- Never expose your Supabase service-role key.
- Use Row Level Security.
- Protect admin access.
- Keep private video files in private storage.
- Use signed URLs for private video playback.
- Implement genuine age verification before allowing access to 18+ content.
- Follow copyright and content-distribution laws.

---

## 11. BRAND IDENTITY

Website: HAWKMOVIES

Tagline: YOUR WORLD. YOUR CINEMA.

Main background: #090817

Deep violet: #17132B

Electric violet: #8B5CF6

Neon cyan: #22D3EE

Soft white: #F5F3FF

---

HAWKMOVIES
YOUR WORLD. YOUR CINEMA.
