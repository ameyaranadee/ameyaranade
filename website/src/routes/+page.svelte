<script lang="ts">
  import { ArrowUpRight } from "@lucide/svelte";
  import Seo from "$lib/components/Seo.svelte";

  const featuredProjects = [
    {
      name: "Salient Entity Linking for the Web",
      href: "/projects#project1",
      desc: "Description of your first project",
    },
    {
      name: "Project 2", 
      href: "/projects#project2",
      desc: "Description of your second project",
      aside: "Some notable achievement",
    },
    // Add more projects as needed
  ];
</script>

<Seo
  title="Ameya Ranade"
  description="Software Engineer. Making meaningful systems and interfaces for people."
/>

<p
  class="layout-md text-black text-xl leading-tight font-light mb-10"
  id="ameya-is">
  software engineer<span class="g">,</span><br />
  researcher<span class="g">, and</span><br />
  explorer<span class="g">.</span>
</p>

<div class="layout-md text-lg space-y-14">
  <div class="space-y-5">
    <p>
      I work in the <a class="link" href="https://www.intellectai.com"> IntellectAI org at Intellect Design Arena</a>
      and recently graduated from the
      <a class="link" href="https://www.umass.edu">University of Massachusetts Amherst</a>.
    </p>

    <p>
      I hope to develop a better <em>mental model</em> of the world by exploring how technology, reasoning, and creativity come together to make sense of the world and our place in it.
    </p>

    <p>
      Last summer, I worked at a stealth startup, building automation tools powered by LLMs. It was a deep dive into <em> systems </em> thinking and how language models can be shaped into practical, reliable products.
    </p>
  </div>

  <div class="leading-snug space-y-4">
    <p class="pb-2">Notable work:</p>

    {#each featuredProjects as project}
      <a class="project-pair" href={project.href}>
        <div class="text-black font-medium">
          {project.name}
          <ArrowUpRight size={18} class="inline text-neutral-400" />
        </div>
        <div>
          <p>{project.desc}</p>
          {#if project.aside}
            <aside>{project.aside}</aside>
          {/if}
        </div>
      </a>
    {/each}
  </div>

  <div class="space-y-5">
    <p>
      Previously, I worked at <a class="link" href="https://company1.com"
        >Priro</a
      >, <a class="link" href="https://company2.com">Company 2</a>,
      <a class="link" href="https://company3.com">Company 3</a>,
      <a class="link" href="https://company4.com">Company 4</a>, and
      <a class="link" href="https://company5.com">Company 5</a>. I've also
      independently published things in the past, like a
      <a
        class="link"
        href="https://your-publication.com"
        >research paper</a
      >,
      <a
        class="link"
        href="https://your-blog.com"
        >blog posts</a
      >, and
      <a class="link" href="https://github.com/ameyaranadee/your-repo"
        >open source projects</a
      >
      used by thousands.
    </p>

    <p>
      I had a lot of fun studying at a university in Amherst, where I first experienced living on campus, got deeper into ML, was a course grader for graduate-level CS classes, worked multiple part time jobs and now I'm on the way to publishing research with Apple!
    </p>
    <p>  
       I emjoy making playlists and you can find them <a class="link" target="_blank" href="https://open.spotify.com/user/4j9js6iek1qu53ypbhf1ddbvm?si=a4356fa730694cfe">here</a>. I also write sometimes. Mostly reflections and stories, and post them <a class="link" target="_blank" href="https://www.instagram.com/ameyaranadee/">here</a>. 
    </p>

    <p>Other interests: [football, reading, running, writing, math, physics, universe].</p>
  </div>

</div>