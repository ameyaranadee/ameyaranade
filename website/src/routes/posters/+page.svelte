<script lang="ts">
  import PosterWall from "$lib/components/PosterWall.svelte";
  import { FORMATION, BASE, FORMATION_SCALE, FORMATION_MAP, DEFAULT_POSITIONS } from "./formation";

  const posterModules = import.meta.glob("$lib/assets/posters/*.{jpg,jpeg,png,webp}", {
    eager: true,
    as: "url"
  }) as Record<string, string>;
  const selected = posterModules;

  const items = Object.entries(selected).map(([k, url]) => ({ id: k, src: url }));
</script>


<svelte:head>
  <title>Posters</title>
  <meta name="description" content="A draggable wall of posters." />
</svelte:head>

<section class="layout-md py-6">
  <p>Make your own!! <em>(Note: Click on reset layout to set them in a grid. Fix coming soon!) </em></p>
</section>

<PosterWall 
  {items} 
  storageKey="poster-wall-v1" 
  formation={FORMATION} 
  baseSize={BASE} 
  formationScale={FORMATION_SCALE}
  formationMap={FORMATION_MAP}
  defaultPositions={DEFAULT_POSITIONS}
/>

