# Prompts de Génération des 4 Images de Présentation

## Important
Ces prompts décrivent uniquement **la scène et le contexte**, pas le bijou lui-même. Le bijou est fourni via l'image d'inspiration sélectionnée par le client dans l'API OpenAI `/v1/images/edits`.

---

## 🔷 BAGUES
*Alliance, Bague de Fiançailles, Chevalière, Bague autre*

### 1. Esquisse Artistique
```
Artistic watercolor sketch on textured paper, soft gouache painting style, delicate brushstrokes, cream background with subtle color washes, artistic jewelry illustration style
```

### 2. Bijou Porté
```
Elegant woman's hand wearing the ring, manicured nails with nude polish, soft natural lighting, luxurious setting, close-up shot, shallow depth of field, professional jewelry photography
```

### 3. Dans l'Écrin
```
Luxury jewelry box interior, deep navy velvet cushion, premium presentation case with gold accents, soft lighting highlighting the jewelry, opened box at perfect angle
```

### 4. Sur Surface
```
Jewelry on polished white marble surface with subtle gold veining, elegant composition, natural light creating beautiful reflections and shadows, minimalist luxury aesthetic
```

---

## 📿 COLLIERS

### 1. Esquisse Artistique
```
Artistic watercolor sketch on textured paper, soft gouache painting style with gold accents, delicate brushstrokes, ivory background with subtle color washes, haute couture jewelry illustration
```

### 2. Bijou Porté
```
Elegant woman wearing the necklace, graceful neckline, sophisticated black dress, soft studio lighting, luxurious ambiance, professional portrait style, focus on neck area
```

### 3. Dans l'Écrin
```
Premium jewelry presentation box, champagne silk lining, elegant display case with LED lighting, sophisticated presentation setup, luxury packaging
```

### 4. Sur Surface
```
Necklace displayed on dark walnut wood surface, artistic arrangement with soft curves, dramatic lighting creating depth and luxury feel, rich textures
```

---

## 💎 PENDENTIFS

### 1. Esquisse Artistique
```
Delicate watercolor illustration on fine art paper, soft gouache technique, subtle gradient washes, pearl white background, refined jewelry sketch style
```

### 2. Bijou Porté
```
Close-up of elegant décolletage wearing the pendant, soft skin tones, natural lighting, minimalist styling, professional fashion photography angle
```

### 3. Dans l'Écrin
```
Luxury pendant presentation box, cream velvet interior, compact elegant case, soft spotlight on the jewelry, premium packaging design
```

### 4. Sur Surface
```
Pendant on brushed gold surface, artistic composition with chain elegantly arranged, warm lighting creating soft shadows, luxurious presentation
```

---

## 🌟 BRACELETS

### 1. Esquisse Artistique
```
Artistic watercolor sketch on textured paper, flowing gouache strokes, cream and gold color palette, elegant jewelry illustration with movement
```

### 2. Bijou Porté
```
Elegant wrist wearing the bracelet, refined pose with hand resting gracefully, soft natural lighting, luxurious setting, close-up detail shot, professional styling
```

### 3. Dans l'Écrin
```
Luxury bracelet presentation box, taupe suede cushioning, elongated elegant case interior, sophisticated display lighting, premium presentation
```

### 4. Sur Surface
```
Bracelet on white marble surface with rose gold veining, curved elegant composition, natural light creating beautiful reflections, luxury minimalism
```

---

## 💫 BOUCLES D'OREILLES

### 1. Esquisse Artistique
```
Delicate watercolor illustration showing pair symmetry, soft gouache on textured paper, blush and gold tones, elegant fashion illustration style
```

### 2. Bijou Porté
```
Elegant woman wearing the earrings, profile view showing one ear, sophisticated updo hairstyle, soft studio lighting, luxurious ambiance, beauty photography style
```

### 3. Dans l'Écrin
```
Premium earring presentation box, dual velvet compartments in burgundy, elegant display case with mirror, refined lighting setup, luxury packaging
```

### 4. Sur Surface
```
Earrings on reflective black glass surface, symmetrical arrangement, soft lighting creating elegant shadows and highlights, modern luxury aesthetic
```

---

## ⚡ PERCINGS

### 1. Esquisse Artistique
```
Modern watercolor sketch on textured paper, contemporary gouache style, subtle metallic accents, minimalist artistic approach
```

### 2. Bijou Porté
```
Close-up of ear with the piercing, modern styling, natural skin tones, soft focused lighting, contemporary fashion photography
```

### 3. Dans l'Écrin
```
Modern jewelry presentation box, sleek black interior, minimalist case design, focused LED lighting, contemporary packaging
```

### 4. Sur Surface
```
Piercing on matte black slate, artistic minimalist composition, directional lighting for dramatic effect, modern aesthetic
```

---

## ✨ AUTRES BIJOUX

### 1. Esquisse Artistique
```
Artistic watercolor sketch on textured paper, versatile gouache painting style, neutral elegant tones, classic jewelry illustration approach
```

### 2. Bijou Porté
```
Elegant presentation of the jewelry piece being worn, sophisticated styling, professional photography lighting, adaptable to jewelry type
```

### 3. Dans l'Écrin
```
Luxury jewelry presentation box, premium materials in neutral tones, elegant case design, sophisticated display lighting, universal luxury packaging
```

### 4. Sur Surface
```
Jewelry on luxury surface mixing marble and wood, artistic composition, dramatic lighting creating depth and elegance, versatile presentation
```

---

## 📋 Notes Techniques

### Utilisation dans n8n
- Ces prompts sont utilisés avec l'endpoint OpenAI `/v1/images/edits`
- L'image sélectionnée par le client est passée en paramètre `image`
- Le prompt décrit uniquement la scène, pas le bijou
- Taille de génération : 1024x1024

### Naming Convention pour GitHub
Les images sont sauvegardées avec cette structure :
```
presentations/{projetId}/{type}-{timestamp}.png
```

Où `{type}` est :
- `esquisse` : Image 1
- `porte` : Image 2
- `ecrin` : Image 3
- `surface` : Image 4

### Champs Airtable
Les URLs des images générées sont stockées dans :
- `imagePres1` : Esquisse artistique
- `imagePres2` : Bijou porté
- `imagePres3` : Dans l'écrin
- `imagePres4` : Sur surface