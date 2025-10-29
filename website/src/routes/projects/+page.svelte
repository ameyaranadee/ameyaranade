<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  import Seo from "$lib/components/Seo.svelte";
  import Project from "./Project.svelte";

  const projects = import.meta.glob("../../projects/*.md", {
    eager: true,
  }) as any;
  const images = import.meta.glob("../../projects/*.{png,jpg,svg}", {
    eager: true,
  }) as any;

  function trimName(id: string) {
    return id.match(/\.\.\/\.\.\/projects\/(.*)\.md$/)?.[1];
  }

  $: projectsByDate = Object.keys(projects).sort(
    (a, b) => projects[b].date - projects[a].date
  );

  onMount(() => {
    // Hack: Fix the scroll position after the page loads, especially for mobile browsers.
    const selected = $page.url.hash.slice(1);
    if (selected) {
      setTimeout(() => {
        if ($page.url.hash.slice(1) === selected) {
          document.getElementById(selected)?.scrollIntoView();
        }
      }, 500);
    }
  });

  let stars: Record<string, number> | null = null;
  onMount(async () => {
    const resp = await fetch(
      "https://api.github.com/users/ameyaranadee/repos?per_page=100"
    );
    const repos = await resp.json();
    stars = {};
    for (const obj of repos) {
      stars[obj.full_name] = obj.stargazers_count;
    }
  });
</script>

<Seo
  title="Ameya Ranade – Projects"
  description="Open-source software projects in systems, web development, computer graphics, music, programming languages, machine learning, and more."
/>

<section class="layout-md py-12">
  <h2 class="heading2">Open Source</h2>

  <p class="text-lg mb-4">
    I view building software in the open as a mode of <em
      class="font-serif text-[110%] leading-[100%]">creative exploration</em
    >. It lets me quickly act on inspiration, delve into new topics, and make
    tools that improve people's lives.
  </p>

  <p class="text-lg mb-4">
    You'll see that I particularly like programming languages, distributed
    systems, machine learning, computer graphics, music, and art.
  </p>

  <p class="text-lg">
    If you find something interesting,
    <a class="link" href="mailto:your-email@example.com?subject=Software%20Projects"
      >let me know</a
    >!
  </p>
</section>

{#each projectsByDate as id (id)}
  <section class="py-10" id={trimName(id)}>
    <div class="mx-auto max-w-[1152px] px-4 sm:px-6">
      <Project data={projects[id]} {images} {stars} />
    </div>
  </section>
{/each}