# Asset Placement Guide

## Overview

This guide explains how to place the 8 generated assets into the Dungeon Stack project.

---

## Asset List

You should have the following 8 images (3D-rendered style, PNG format):

### Items (4 images)
1. **sword.png** - Blue glowing magical sword
2. **shield.png** - Wooden shield with golden frame
3. **potion.png** - Red magical potion bottle
4. **coin.png** - Golden ornate coin

### Enemies (2 images)
5. **slime.png** - Green cute slime creature
6. **goblin.png** - Orange goblin warrior

### Hero (2 images)
7. **hero-idle.png** - Knight with sword and shield (idle state)
8. **hero-damaged.png** - Knight taking damage (damaged state)

---

## Placement Instructions

### Step 1: Navigate to the project directory

```bash
cd /home/user/dstack/DungeonStack
```

### Step 2: Place assets in the correct folders

Copy or move your generated PNG files to the following locations:

#### Items
```bash
# Place these 4 files in: assets/items/
assets/items/sword.png
assets/items/shield.png
assets/items/potion.png
assets/items/coin.png
```

#### Enemies
```bash
# Place these 2 files in: assets/enemies/
assets/enemies/slime.png
assets/enemies/goblin.png
```

#### Hero
```bash
# Place these 2 files in: assets/hero/
assets/hero/hero-idle.png
assets/hero/hero-damaged.png
```

---

## Verification

After placing all assets, verify the structure:

```bash
ls -la assets/items/
# Should show: sword.png, shield.png, potion.png, coin.png

ls -la assets/enemies/
# Should show: slime.png, goblin.png

ls -la assets/hero/
# Should show: hero-idle.png, hero-damaged.png
```

---

## Asset Specifications

All assets should meet these requirements:

- **Format**: PNG with transparent background
- **Recommended Size**: 256x256 pixels
- **Style**: 3D-rendered, consistent art style
- **Color Depth**: 32-bit RGBA

---

## Next Steps

Once all 8 assets are in place:

1. Commit the assets to git:
   ```bash
   git add assets/items/ assets/enemies/ assets/hero/
   git commit -m "Add 8 game assets (items, enemies, hero sprites)"
   git push
   ```

2. Phase 0 is complete! Ready to start Phase 1 (MVP development).

---

## Troubleshooting

### Assets not displaying in app?

- Check file names (must be exact: `sword.png`, not `Sword.png`)
- Verify file paths match the constants in `constants/Items.ts`
- Ensure images have transparent backgrounds
- Try restarting the Expo development server

### Need to regenerate assets?

Refer to `AI_ASSET_GENERATION_WORKFLOW.md` for the prompts used to generate these assets.

---

## Contact

If you encounter any issues with asset placement, refer to the main documentation or create an issue in the project repository.
