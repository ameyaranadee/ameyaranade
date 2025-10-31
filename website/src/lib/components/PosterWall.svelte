<script lang="ts">
  import { onMount } from "svelte";
  import * as htmlToImage from "html-to-image";

  export type PosterItem = { id: string; src: string; w?: number; h?: number };
  export type Rect = { x: number; y: number; w?: number; h?: number; r?: number };
  export let formationScale: number = 0.25;
  
  export let items: PosterItem[] = [];
  export let storageKey = "poster-wall-v1";
  export let baseSize: { w: number; h: number } | null = null;
  export let formation: Rect[] | null = null;
  export let formationMap: Record<string, Rect> | null = null;
  export let defaultPositions: Record<string, { x: number; y: number; w: number; h: number; z: number; r: number }> | null = null;
  type Pos = { x: number; y: number; w: number; h: number; z: number; r: number };
  
  let positions = new Map<string, Pos>();
  let selectedId: string | null = null;
  let resizeMode: "none" | "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w" = "none";

  let container: HTMLDivElement;
  let captureEl: HTMLDivElement;
  let fileInput: HTMLInputElement;

  let cw = 0;
  let ch = 0;
  let draggingId: string | null = null;
  let dragOffset = { x: 0, y: 0 };
  let zCounter = 1;

  let uploads: PosterItem[] = [];
  $: localItems = [...items, ...uploads];

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  function load() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const data = JSON.parse(raw) as Record<string, Pos>;
        positions = new Map(Object.entries(data));
      }
    } catch {}
  }

  function save() {
    const obj: Record<string, Pos> = {};
    positions.forEach((v, k) => (obj[k] = v));
    localStorage.setItem(storageKey, JSON.stringify(obj));
  }

  function resetToFormation() {
  if (!baseSize || !formation?.length) return;
  const containerScale = cw / baseSize.w;
  ch = Math.max(baseSize.h * containerScale, 600);
  const ids = localItems.map((i) => i.id);
  
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const item = localItems.find(it => it.id === id);
    
    // First, check if we have default positions for this exact path
    if (defaultPositions && id && defaultPositions[id]) {
      const saved = defaultPositions[id];
      // Default positions are in pixels from a previous screen size
      // We need to scale them proportionally to current container width
      // Assuming they were captured at approximately BASE width (1200px)
      // Scale factor: current width / base width
      const scale = cw / baseSize.w;
      positions.set(id, {
        x: saved.x * scale,
        y: saved.y * scale,
        w: saved.w * scale,
        h: saved.h * scale,
        z: saved.z,
        r: saved.r
      });
      continue;
    }
    
    // Otherwise, try FORMATION_MAP by filename
    let filename = "";
    if (item?.id) {
      const match = item.id.match(/([^/]+)\.(jpg|jpeg|png|webp)$/i);
      if (match) {
        filename = match[1].toLowerCase();
      }
    }
    
    let rect: Rect | undefined;
    if (formationMap && filename && formationMap[filename]) {
      rect = formationMap[filename];
    } else if (formation && formation.length > 0) {
      rect = formation[i % formation.length];
    }
    
    if (!rect) continue;
    
    const x = rect.x * containerScale;
    const y = rect.y * containerScale;
    const prev = positions.get(id);
    const rotation = rect.r !== undefined ? rect.r : (prev?.r ?? 0);
    const w = prev?.w || 300;
    const h = prev?.h || 400;
    
    positions.set(id, { x, y, w, h, z: prev?.z ?? i + 1, r: rotation });
  }
  positions = new Map(positions);
}

  function resetAutoMasonry() {
    const colWidth = 240, gutter = 16;
    const cols = Math.max(1, Math.floor((cw + gutter) / (colWidth + gutter)));
    const colHeights = Array(cols).fill(0);
    for (const it of localItems) {
      const pos = positions.get(it.id);
      const w = pos?.w ?? it.w ?? colWidth;
      const h = pos?.h ?? it.h ?? colWidth * 1.2;
      let col = 0;
      for (let i = 1; i < cols; i++) if (colHeights[i] < colHeights[col]) col = i;
      const x = col * (colWidth + gutter);
      const y = colHeights[col];
      colHeights[col] += h + gutter;
      positions.set(it.id, { x, y, w, h, z: pos?.z ?? 1 + Math.random(), r: pos?.r ?? 0 });
    }
    ch = Math.max(...colHeights, 800);
    positions = new Map(positions);
  }

  function reset() {
  positions.clear();
  if (formation && baseSize) {
    resetToFormation();
  } else {
    resetAutoMasonry();
  }
  positions = new Map(positions); // Ensure reactivity update
  save();
}

  function ensureSize(img: HTMLImageElement, id: string) {
  const naturalW = img.naturalWidth;
  const naturalH = img.naturalHeight;
  const existing = positions.get(id);
  
  // Apply formation scale to natural dimensions
  const scale = formationScale || 0.25;
  let finalW = naturalW * scale;
  let finalH = naturalH * scale;
  
  // Cap at max width if still too large
  const maxWidth = Math.min(cw * 0.9, 1000);
  if (finalW > maxWidth) {
    const adjustScale = maxWidth / finalW;
    finalW *= adjustScale;
    finalH *= adjustScale;
  }
  
  if (!existing) {
    // New image - center it
    const centerX = (cw / 2) - finalW / 2;
    const centerY = (ch / 2) - finalH / 2;
    positions.set(id, { x: centerX, y: centerY, w: finalW, h: finalH, z: zCounter++, r: 0 });
  } else {
    // Keep position (from formation or user), update size
    positions.set(id, { ...existing, w: finalW, h: finalH });
  }
  positions = new Map(positions);
  save();
}

  function selectPoster(id: string) {
    selectedId = id;
    zCounter += 1;
    const pos = positions.get(id);
    if (pos) {
      positions.set(id, { ...pos, z: zCounter });
      positions = new Map(positions);
    }
  }

  function deselectPoster() {
    selectedId = null;
    resizeMode = "none";
  }

  function onCardPointerDown(e: PointerEvent, id: string) {
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    const pos = positions.get(id);
    if (!pos) return;
    
    selectPoster(id);
    draggingId = id;
    const rect = target.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    target.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent) {
    if (!draggingId) return;
    const pos = positions.get(draggingId);
    if (!pos) return;
    
    if (resizeMode !== "none") {
      // Resizing
      const bounds = container.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;
      
      let { x, y, w, h } = pos;
      const minSize = 50;
      
      if (resizeMode.includes("e")) w = Math.max(minSize, mouseX - x);
      if (resizeMode.includes("w")) {
        const newW = Math.max(minSize, x + w - mouseX);
        x = x + w - newW;
        w = newW;
      }
      if (resizeMode.includes("s")) h = Math.max(minSize, mouseY - y);
      if (resizeMode.includes("n")) {
        const newH = Math.max(minSize, y + h - mouseY);
        y = y + h - newH;
        h = newH;
      }
      
      positions.set(draggingId, { ...pos, x, y, w, h });
      positions = new Map(positions);
    } else {
      // Dragging
      const bounds = container.getBoundingClientRect();
      const nx = clamp(e.clientX - bounds.left - dragOffset.x, 0, Math.max(0, cw - pos.w));
      const ny = clamp(e.clientY - bounds.top - dragOffset.y, 0, Math.max(0, ch - pos.h));
      positions.set(draggingId, { ...pos, x: nx, y: ny });
      positions = new Map(positions);
    }
  }

  function onPointerUp(e: PointerEvent) {
    if (!draggingId) return;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    draggingId = null;
    if (resizeMode !== "none") {
      resizeMode = "none";
      save();
    } else {
      save();
    }
  }

  function onResizeHandleDown(e: PointerEvent, mode: typeof resizeMode) {
    e.stopPropagation();
    resizeMode = mode;
    draggingId = selectedId;
    if (draggingId) {
      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);
    }
  }

  function rotatePoster(degrees: number) {
    if (!selectedId) return;
    const pos = positions.get(selectedId);
    if (!pos) return;
    positions.set(selectedId, { ...pos, r: (pos.r + degrees) % 360 });
    positions = new Map(positions);
    save();
  }

  function onResize() {
    const rect = container.getBoundingClientRect();
    const newW = rect.width;
    if (Math.abs(newW - cw) > 10) {
      cw = newW;
      if (formation && baseSize) {
        resetToFormation();
        positions = new Map(positions);
        save();
      } else {
        const snapshot = new Map(positions);
        positions.clear();
        resetAutoMasonry();
        snapshot.forEach((oldPos, id) => {
          const p = positions.get(id);
          if (p) positions.set(id, { ...p, x: clamp(oldPos.x, 0, Math.max(0, cw - p.w)), y: p.y, z: oldPos.z, r: oldPos.r });
        });
        positions = new Map(positions);
        save();
      }
    }
  }

  function triggerFile() {
    fileInput?.click();
  }

  function onFilesSelected(e: Event) {
    const files = (e.currentTarget as HTMLInputElement).files;
    if (!files?.length) return;
    const centerX = (cw / 2) - 120, centerY = (ch / 2) - 160;

    const newlyAdded: PosterItem[] = [];
    Array.from(files).forEach((file, idx) => {
      const url = URL.createObjectURL(file);
      const id = `upload-${Date.now()}-${idx}`;
      newlyAdded.push({ id, src: url });
      // Temporary size - will be updated when image loads via ensureSize
      const x = centerX + (idx % 3) * 24;
      const y = centerY + Math.floor(idx / 3) * 24;
      positions.set(id, { x, y, w: 220, h: 300, z: zCounter++, r: 0 });
    });
    uploads = [...uploads, ...newlyAdded];
    positions = new Map(positions);
    ch = Math.max(ch, centerY + 360);
    save();
    (e.currentTarget as HTMLInputElement).value = "";
  }

  async function exportPng() {
    const node = captureEl;
    const blob = await htmlToImage.toBlob(node, { pixelRatio: 2, backgroundColor: "white" });
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "poster-wall.png";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!selectedId) return;
    if (e.key === "Delete" || e.key === "Backspace") {
      deselectPoster();
    } else if (e.key === "r" || e.key === "R") {
      rotatePoster(90);
    }
  }

  onMount(() => {
  // Initialize container width immediately
  cw = container.getBoundingClientRect().width;
  
  load();
  
  // Check if we have saved positions for all items
  const hasSavedData = positions.size > 0 && localItems.every(item => positions.has(item.id));
  
  // If no saved data OR if items don't match saved data, use formation/default positions
  if (!hasSavedData) {
    if (formation && baseSize) {
      resetToFormation();
      save();
    } else {
      resetAutoMasonry();
      save();
    }
  } else {
    // Use saved positions
    ch = Math.max(...Array.from(positions.values()).map((p) => p.y + p.h), 800);
  }
  
  const ro = new ResizeObserver(() => onResize());
  ro.observe(container);
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("click", (e) => {
    if (!(e.target as HTMLElement).closest(".card, .toolbar")) {
      deselectPoster();
    }
  });
  return () => {
    ro.disconnect();
    window.removeEventListener("keydown", handleKeydown);
  };
});

</script>

<div class="toolbar layout-md">
  <div class="left">
    <button on:click={reset} class="btn">Reset layout</button>
    {#if baseSize}
      <button on:click={exportPng} class="btn">Export PNG</button>
    {/if}
    <button on:click={triggerFile} class="btn">Add images</button>
    <input bind:this={fileInput} type="file" accept="image/*" multiple class="hidden" on:change={onFilesSelected} />
    {#if selectedId}
      <button on:click={() => rotatePoster(90)} class="btn">Rotate</button>
    {/if}
  </div>
</div>
<div bind:this={container} class="wall" style={`height:${ch}px`}>
  <div bind:this={captureEl} class="capture">
    {#each localItems as it (it.id)}
      {#key it.id}
        {@const pos = positions.get(it.id)}
        {@const isSelected = selectedId === it.id}
        <article
          class="card"
          class:selected={isSelected}
          style={`transform: translate(${pos?.x ?? 0}px, ${pos?.y ?? 0}px) rotate(${pos?.r ?? 0}deg); width:${pos?.w ?? 220}px; height:${pos?.h ?? 280}px; z-index:${pos?.z ?? 1}`}
          on:pointerdown={(e)=>onCardPointerDown(e, it.id)}
          on:pointermove={onPointerMove}
          on:pointerup={onPointerUp}
          on:pointercancel={onPointerUp}
          role="button"
          aria-label="Drag poster"
          tabindex="0"
        >
          <img src={it.src} alt="" draggable="false" on:load={(e)=>ensureSize(e.currentTarget as HTMLImageElement, it.id)} />
          
          {#if isSelected}
            <!-- Resize handles -->
            <div class="resize-handle nw" on:pointerdown={(e)=>onResizeHandleDown(e, "nw")}></div>
            <div class="resize-handle ne" on:pointerdown={(e)=>onResizeHandleDown(e, "ne")}></div>
            <div class="resize-handle sw" on:pointerdown={(e)=>onResizeHandleDown(e, "sw")}></div>
            <div class="resize-handle se" on:pointerdown={(e)=>onResizeHandleDown(e, "se")}></div>
            <div class="resize-handle n" on:pointerdown={(e)=>onResizeHandleDown(e, "n")}></div>
            <div class="resize-handle s" on:pointerdown={(e)=>onResizeHandleDown(e, "s")}></div>
            <div class="resize-handle e" on:pointerdown={(e)=>onResizeHandleDown(e, "e")}></div>
            <div class="resize-handle w" on:pointerdown={(e)=>onResizeHandleDown(e, "w")}></div>
          {/if}
        </article>
      {/key}
    {/each}
  </div>
</div>

<style lang="postcss">
  .toolbar { @apply mb-4 flex justify-end; }
  .left { @apply flex gap-2; }
  .btn { @apply text-sm px-3 py-1 rounded border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition; }

  .wall { @apply relative mx-auto max-w-screen-xl; padding: 8px; }
  .capture { position: relative; width: 100%; height: 100%; background:
    radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 1px) 0 0/16px 16px;
  }

  .card {
    @apply absolute rounded-sm bg-white shadow-sm overflow-hidden border border-neutral-200;
    touch-action: none; will-change: transform; cursor: grab;
    transform-origin: center center;
  }
  .card:active { cursor: grabbing; }
  .card.selected {
    @apply border-blue-500 border-2 shadow-lg;
  }
  
  .card img { 
    @apply w-full h-full object-cover; 
    user-select: none; 
    pointer-events: none; 
  }
  
  .resize-handle {
    @apply absolute bg-blue-500 border border-white;
    width: 10px;
    height: 10px;
    z-index: 10;
  }
  .resize-handle.nw { top: -5px; left: -5px; cursor: nw-resize; }
  .resize-handle.ne { top: -5px; right: -5px; cursor: ne-resize; }
  .resize-handle.sw { bottom: -5px; left: -5px; cursor: sw-resize; }
  .resize-handle.se { bottom: -5px; right: -5px; cursor: se-resize; }
  .resize-handle.n { top: -5px; left: 50%; transform: translateX(-50%); cursor: n-resize; }
  .resize-handle.s { bottom: -5px; left: 50%; transform: translateX(-50%); cursor: s-resize; }
  .resize-handle.e { right: -5px; top: 50%; transform: translateY(-50%); cursor: e-resize; }
  .resize-handle.w { left: -5px; top: 50%; transform: translateY(-50%); cursor: w-resize; }
  
  .hidden { display: none; }
</style>