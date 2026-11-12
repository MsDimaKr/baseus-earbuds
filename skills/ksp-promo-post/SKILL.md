---
name: ksp-promo-post
description: Turns a new "KSP Promotion Program" affiliate email (aff@ksp.co.il, Hotmail) into a ready-to-post Russian promo — a full post text in the user's own style, a short WhatsApp version on request, and a 1080×1350 promo image built from product photos the user sends in chat — then commits and pushes the image. Use this whenever the user says there's a new KSP mail ("יש מייל חדש", "הגיע מייל חדש", "מגיע מייל חדש"), sends KSP product pictures for a post, asks for the Russian text of a KSP deal ("תן את כל הטקסט", "את הטקסט אני צריך ברוסית"), asks to shorten it for WhatsApp ("תקצר לגרסת ווצאפ"), or asks to fix a price/product on an existing KSP promo image — even if they don't mention KSP by name.
---

# KSP promo post

The user runs Russian-language deal channels (WhatsApp/Telegram/Facebook) and earns KSP affiliate commission. KSP emails them each promotion in Hebrew; your job is to turn that email into a post their Russian-speaking audience will click: the text **and** an eye-catching image. The user talks to you in Hebrew; post content is always in Russian.

## 1. Find and read the email

Load the Hotmail tools (`ToolSearch` → `select:mcp__Hotmail__search_emails,mcp__Hotmail__read_email`), then search INBOX with `from: "aff@ksp.co.il"` and a `since` date a few days back. Take the newest one you haven't handled yet (check the repo for an existing `ksp-<topic>-promo/` folder if unsure). Read it fully.

Extract for every product: Hebrew name → what it actually is, final price ("ישלמו רק ₪X"), old price ("במקום ₪Y"), the affiliate item link (`https://ksp.co.il/appkey/17585/item/<ID>`), plus the category/"all products" link, extra-discount %, gifts, and the end date ("בתוקף עד").

Watch out for:
- **Never mention the commission** ("תגמול …% ממחיר המכירה") — that's the user's private income, not for followers.
- KSP's emails contain copy-paste errors (e.g. two different items both titled "Elvive"). If the photos the user sends contradict the email, trust the photos and tell the user what you assumed. If the user corrects a price, just apply it.

## 2. Write the full Russian post

Follow the user's established style (see `references/text-examples.md` — read it before writing the first post in a session):

- Opening line: emoji + brands + "дополнительная скидка N% в KSP!" Then one line of hook, and any gift line with 🎁.
- Group products by series/brand when the email does (e.g. 🟢 зелёная серия / 🔵 синяя серия).
- Each product: one emoji fitting the product, a short natural description (translate the meaning, don't transliterate Hebrew), then `Цена **X ₪** вместо Y ₪`, then the link **on its own line** after 👉.
- After the products: category link(s) with 👉 on their own line.
- Always end with exactly:
  `📅 Акции действуют до DD.MM.YYYY или до окончания запасов. Дополнительная скидка применяется при переходе по ссылкам и обновляется в корзине.`

Give the text in chat (no file needed) and ask for the product photos in the same message.

**WhatsApp version** (when asked to shorten): bold header line, gift line, then per product just `emoji Name — *X ₪* вместо Y ₪` + 👉 link, the all-products link, and a one-line `📅 До DD.MM.YYYY. Скидка — при переходе по ссылкам.` WhatsApp uses `*single asterisks*` for bold.

## 3. Get the product images

KSP (ksp.co.il / img.ksp.co.il) returns Cloudflare 403 to this cloud environment (US datacenter IP), so you can't download photos — don't spend time retrying. The user sends them in chat; they're saved as `/tmp/claude-0/<project>/<session>/images/N.jpg`.

- List with `ls <images-dir> | sort -V | tail` and match each new file to a product by **looking at it** (Read the image) — order of sending isn't guaranteed and a photo shown in chat is sometimes not yet on disk. If one is missing, render without it and ask the user to resend.
- Copy into the promo's `src/` with descriptive names (`bosch-xline-173.jpg`). If a photo has a Hebrew badge/sticker, crop it out with PIL.

## 4. Build the image

Create `ksp-<topic>-promo/` in the repo root with `src/` (product photos + `ksp-logo.png` from this skill's `assets/`) and a `config.json`, then render:

```bash
NODE_PATH=$(npm root -g) node <skill-dir>/scripts/render.js ksp-<topic>-promo
```

Copy `scripts/render.js` into the promo folder too, so the folder is self-contained in the repo. Config format — see the two worked examples:
- `references/config-example.json` — **rows** layout: 2 labelled sections × 3 cards (two series/brands).
- `references/config-example-grid.json` — **grid** layout: flat 3-column grid, optional `wm` (brand wordmark) per card, optional `note` badge, optional `gift` tile.

Design rules that made past images work:
- Up to 6 products (+ gift tile). If the email has more, pick the biggest discounts / best-known items.
- Headline pattern: `<Тема><br>по <em>выгодной</em> цене` — short, 2 lines. Kicker: `emoji Тема в KSP`. Brands line: brand names or "+N% поверх акций".
- Pick a theme matching the category (pink ✿ for cosmetics, blue-grey ✦/⚙ for tools/shaving, etc.) — override only the theme keys you need.
- Card names must fit on one line, sizes ideally on one line: shorten ("Санскрин SPF50+", "Гель для бровей" + "Super Lock, 7 мл") and use `&nbsp;` to keep units with numbers.
- The red circle auto-computes the max discount; products with missing images are skipped automatically.

**Always look at the rendered PNG** (Read it) before delivering: check for wrapped names, clipped text, wrong photo on a card. Fix and re-render.

## 5. Deliver

1. `git add ksp-<topic>-promo && git commit` (descriptive message) and `git push -u origin <current branch>`. Don't open PRs unless asked.
2. Send the PNG with `SendUserFile` (display: render).
3. Reply briefly in Hebrew: what's on the image, anything assumed or missing, and offer the WhatsApp version if not given yet.

When the user later corrects something (price, name, a new product photo), update `config.json`, re-render, commit, push, resend — and fix the same detail in the text if you already gave it.
