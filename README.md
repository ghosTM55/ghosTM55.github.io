## My Personal Website

Personal landing page hosted on GitHub Pages.

Still working on it.

---

### Social Links

The following social accounts are configured. To restore the social links nav section, refer to the implementation notes below.

| Platform  | Account       | URL |
|-----------|---------------|-----|
| Twitter   | @ghostm55     | https://twitter.com/ghostm55 |
| LinkedIn  | ghostm55      | https://www.linkedin.com/in/ghostm55/ |
| YouTube   | thomasyao     | https://www.youtube.com/thomasyao |
| 抖音       | ghosTM55      | https://www.douyin.com/user/MS4wLjABAAAARfYeU2Xp5Y0hXqHHEtnZgY3zG6wd3O_eGV90LWGTlig |
| Facebook  | ghosThomas    | https://www.facebook.com/ghosThomas |
| Instagram | ghostm55      | https://www.instagram.com/ghostm55 |
| TikTok    | @thomasyao90  | https://www.tiktok.com/@thomasyao90 |
| GitHub    | ghostm55      | https://github.com/ghostm55 |
| Blog      | Hashnode      | https://blog.thomasyao.wtf |

**Order:** Twitter → LinkedIn → YouTube → 抖音 → Facebook → Instagram → TikTok → GitHub → Blog

---

### Implementation Notes

**Dependencies (add to `<head>`):**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/css/all.min.css" />
```

**Nav HTML snippet:**
```html
<nav>
  <ul>
    <li><a href="https://twitter.com/ghostm55" class="icon fa-brands fa-twitter" target="_blank" rel="noopener noreferrer"><span class="label">Twitter</span></a></li>
    <li><a href="https://www.linkedin.com/in/ghostm55/" class="icon fa-brands fa-linkedin" target="_blank" rel="noopener noreferrer"><span class="label">LinkedIn</span></a></li>
    <li><a href="https://www.youtube.com/thomasyao" class="icon fa-brands fa-youtube" target="_blank" rel="noopener noreferrer"><span class="label">YouTube</span></a></li>
    <li><a href="https://www.douyin.com/user/MS4wLjABAAAARfYeU2Xp5Y0hXqHHEtnZgY3zG6wd3O_eGV90LWGTlig" class="icon fa-brands fa-tiktok" target="_blank" rel="noopener noreferrer"><span class="label">抖音</span></a></li>
    <li><a href="https://www.facebook.com/ghosThomas" class="icon fa-brands fa-facebook" target="_blank" rel="noopener noreferrer"><span class="label">Facebook</span></a></li>
    <li><a href="https://www.instagram.com/ghostm55" class="icon fa-brands fa-instagram" target="_blank" rel="noopener noreferrer"><span class="label">Instagram</span></a></li>
    <li><a href="https://www.tiktok.com/@thomasyao90" class="icon fa-brands fa-tiktok" target="_blank" rel="noopener noreferrer"><span class="label">TikTok</span></a></li>
    <li><a href="https://github.com/ghostm55" class="icon fa-brands fa-github" target="_blank" rel="noopener noreferrer"><span class="label">GitHub</span></a></li>
    <li><a href="https://blog.thomasyao.wtf" class="icon hashnode" target="_blank" rel="noopener noreferrer"><span class="label">Blog</span></a></li>
  </ul>
</nav>
```

**Icon notes:**
- All icons use Font Awesome 6 Free via jsdelivr CDN
- `fa-tiktok` is used for both 抖音 and TikTok (same logo, different regional brands)
- Hashnode uses a custom SVG `background-image` on `::before` (defined in `main.css` as `.icon.hashnode`)
- On hover, only 抖音 and TikTok show a label tooltip — targeted via `a[href*="douyin"]` and `a[href*="tiktok"]` attribute selectors in CSS
- Tooltip uses `system-ui` font
