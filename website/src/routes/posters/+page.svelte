<script lang="ts">
  import PosterWall from "$lib/components/PosterWall.svelte";
  import { FORMATION, BASE } from "./formation";

  // Load images
  const posterModules = import.meta.glob("$lib/assets/posters/*.{jpg,jpeg,png,webp}", {
    eager: true,
    as: "url"
  }) as Record<string, string>;

  const fallbackModules = import.meta.glob("/src/projects/*.{png,jpg,jpeg,webp}", {
    eager: true,
    as: "url"
  }) as Record<string, string>;
  const selected = Object.keys(posterModules).length ? posterModules : fallbackModules;

  const items = Object.entries(selected).map(([k, url]) => ({ id: k, src: url }));
</script>

<svelte:head>
  <title>Posters</title>
  <meta name="description" content="A draggable wall of posters." />
</svelte:head>

<section class="layout-md">
  <h2 class="heading2">Posters</h2>
</section>

<PosterWall {items} storageKey="poster-wall-v1" formation={FORMATION} baseSize={BASE}/>