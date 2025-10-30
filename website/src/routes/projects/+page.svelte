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

  <p class="text-lg mb-4">
    I love solving problems I find intereting and I do it through <em
      class="link font-serif text-[110%] leading-[100%]"> code and words </em
    >. It lets me explore, "tinker", dive into new topics, and understand the world a bit better while showing the world my view. 
  </p>

  <p class="text-lg mb-4">
    You'll see that I particularly like words, distributed
    systems, machine learning, football, and art.
    
    If you find something interesting,
    <a class="link" href="mailto:ranadeamr@gmail.com?subject=Hi!%20Reaching%20out!"
      >let me know</a
    >!
  </p>
</section>

{#each projectsByDate as id (id)}
  <section class="py-6" id={trimName(id)}>
    <div class="layout-md">
      <Project data={projects[id]} {images} {stars} />
    </div>
  </section>
{/each}