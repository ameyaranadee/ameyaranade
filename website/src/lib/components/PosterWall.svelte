<script lang="ts">
  import { onMount } from "svelte";
  import * as htmlToImage from "html-to-image";

  export type PosterItem = { id: string; src: string; w?: number; h?: number };
  export type Rect = { x: number; y: number; w: number; h: number };

  export let items: PosterItem[] = [];
  export let storageKey = "poster-wall-v1";
  export let baseSize: { w: number; h: number } | null = null;
  export let formation: Rect[] | null = null;

  type Pos = { x: number; y: number; w: number; h: number; z: number ; r: number };
  let positions = new Map<string, Pos>();

  let container: HTMLDivElement;
  let captureEl: HTMLDivElement;
  let fileInput: HTMLInputElement;

  let cw = 0;
  let ch = 0;
  let draggingId: string | null = null;
  let dragOffset = { x: 0, y: 0 };
  let zCounter = 1;

  // Local items = initial images + user uploads
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
    const scale = cw / baseSize.w;
    ch = Math.max(baseSize.h * scale, 600);
    const ids = localItems.map((i) => i.id);
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const rect = formation[i % formation.length];
      const x = rect.x * scale;
      const y = rect.y * scale;
      const w = rect.w * scale;
      const h = rect.h * scale;
      const prev = positions.get(id);
      positions.set(id, { x, y, w, h, z: prev?.z ?? i + 1 });
    }
    positions = new Map(positions);
  }

  function resetAutoMasonry() {
    const colWidth = 240, gutter = 16;
    const cols = Math.max(1, Math.floor((cw + gutter) / (colWidth + gutter)));
    const colHeights = Array(cols).fill(0);
    for (const it of localItems) {
      const pos = positions.get(it.id);
      const w = Math.min(colWidth, pos?.w ?? it.w ?? colWidth);
      const h = pos?.h ?? it.h ?? colWidth * 1.2;
      let col = 0;
      for (let i = 1; i < cols; i++) if (colHeights[i] < colHeights[col]) col = i;
      const x = col * (colWidth + gutter);
      const y = colHeights[col];
      colHeights[col] += h + gutter;
      positions.set(it.id, { x, y, w, h, z: pos?.z ?? 1 + Math.random() });
    }
    ch = Math.max(...colHeights, 800);
    positions = new Map(positions);
  }

  function reset() {
    positions.clear();
    if (formation && baseSize) resetToFormation();
    else resetAutoMasonry();
    save();
  }

  function ensureSize(img: HTMLImageElement, id: string) {
    const baseW = Math.min(280, Math.max(140, img.naturalWidth));
    const scale = baseW / img.naturalWidth;
    const w = baseW;
    const h = img.naturalHeight * scale;
    const existing = positions.get(id);
    if (existing) {
      positions.set(id, { ...existing, w, h });
      positions = new Map(positions);
    }
  }

  function onPointerDown(e: PointerEvent, id: string) {
    const target = e.currentTarget as HTMLElement;
    const pos = positions.get(id);
    if (!pos) return;
    draggingId = id;
    zCounter += 1;
    positions.set(id, { ...pos, z: zCounter });
    positions = new Map(positions);
    const rect = target.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    target.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent) {
    if (!draggingId) return;
    const pos = positions.get(draggingId);
    if (!pos) return;
    const bounds = container.getBoundingClientRect();
    const nx = clamp(e.clientX - bounds.left - dragOffset.x, 0, Math.max(0, cw - pos.w));
    const ny = clamp(e.clientY - bounds.top - dragOffset.y, 0, Math.max(0, ch - pos.h));
    positions.set(draggingId, { ...pos, x: nx, y: ny });
    positions = new Map(positions);
  }

  function onPointerUp(e: PointerEvent) {
    if (!draggingId) return;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    draggingId = null;
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
          if (p) positions.set(id, { ...p, x: clamp(oldPos.x, 0, Math.max(0, cw - p.w)), y: p.y, z: oldPos.z });
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
    const scale = baseSize ? cw / baseSize.w : 1;
    const centerX = (cw / 2) - 120, centerY = (ch / 2) - 160;

    const newlyAdded: PosterItem[] = [];
    Array.from(files).forEach((file, idx) => {
      const url = URL.createObjectURL(file);
      const id = `upload-${Date.now()}-${idx}`;
      newlyAdded.push({ id, src: url });
      // place near center, slight offset per image
      const x = centerX + (idx % 3) * 24;
      const y = centerY + Math.floor(idx / 3) * 24;
      const w = 220 * scale;
      const h = 300 * scale;
      positions.set(id, { x, y, w, h, z: zCounter++ });
    });
    uploads = [...uploads, ...newlyAdded];
    positions = new Map(positions);
    ch = Math.max(ch, centerY + 360);
    save();
    (e.currentTarget as HTMLInputElement).value = "";
  }

  async function exportPng() {
    // Export only the posters' region
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

  onMount(() => {
    load();
    cw = container.getBoundingClientRect().width;
    if (positions.size === 0) {
      if (formation && baseSize) resetToFormation();
      else resetAutoMasonry();
      save();
    } else {
      ch = Math.max(...Array.from(positions.values()).map((p) => p.y + p.h), 800);
    }
    const ro = new ResizeObserver(() => onResize());
    ro.observe(container);
    return () => ro.disconnect();
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
  </div>
</div>

<div bind:this={container} class="wall" style={`height:${ch}px`}>
  <div bind:this={captureEl} class="capture">
    {#each localItems as it (it.id)}
      {#key it.id}
        <article
          class="card"
          style={`transform: translate(${positions.get(it.id)?.x ?? 0}px, ${positions.get(it.id)?.y ?? 0}px); width:${positions.get(it.id)?.w ?? 220}px; height:${positions.get(it.id)?.h ?? 280}px; z-index:${positions.get(it.id)?.z ?? 1}`}
          on:pointerdown={(e)=>onPointerDown(e, it.id)}
          on:pointermove={onPointerMove}
          on:pointerup={onPointerUp}
          on:pointercancel={onPointerUp}
          role="button"
          aria-label="Drag poster"
          tabindex="0"
        >
          <img src={it.src} alt="" draggable="false" on:load={(e)=>ensureSize(e.currentTarget as HTMLImageElement, it.id)} />
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
  }
  .card:active { cursor: grabbing; }
  .card img { @apply w-full h-full object-cover; user-select: none; pointer-events: none; }
  .hidden { display: none; }
</style>