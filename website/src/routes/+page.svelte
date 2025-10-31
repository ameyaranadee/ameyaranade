<script lang="ts">
  import { ArrowUpRight } from "@lucide/svelte";
  import Seo from "$lib/components/Seo.svelte";

</script>

<Seo
  title="Ameya Ranade"
  description="Software Engineer. Making meaningful systems and interfaces for people."
/>

<p
  class="layout-md text-black text-xl leading-tight font-light mb-10"
  id="ameya-is">
  software engineer<span class="g">,</span><br />
  researcher<span class="g">, and</span>
  explorer<span class="g">.</span>
</p>

<div class="layout-md text-lg space-y-14">
  <div class="space-y-5">
    <p>
      Hi, I’m Ameya <em>(uh-may-ya)</em>. I’m 24, born and raised in Mumbai. A little over two years ago, I moved to the States to pursue a master’s in computer science - and I did it!  graduated from the University of Massachusetts Amherst earlier this year. Go Minutemen!
    </p>
    <p>
      I now live in New Jersey and work at <a class="link" href="https://www.intellectai.com"> IntellectAI </a>  where I build applied AI and full-stack solutions for insurance workflows. These days, I’m mainly interested in applied AI, systems and backend engineering space.
    </p>
    <p>  Last summer, I worked at a stealth startup, where I helped build an automation platform for workflows in the piping industry. It was an incredible experience that brought together two things I love most</p> <ul> <li> research, prototype and building ideas from scratch </li><li> collaborating in a lean team </li></ul> <p> I was one of the early members of the team when it was just 4 engineers trying to make sense of the EPC industry. It was chaotic, fun, and deeply rewarding. What I learned from that time was simple: access to niche data + AI = immense value. Since then, I’ve been eager to contribute to products and projects where AI genuinely makes a difference. You can explore more of my work <a class="link" href="/resume">here</a>. And if you’re building something similar, I’d love to hear about it (maybe there’s a way I can help)! </p>

    <p>My long-term dream is to one day work in football (or soccer, if you prefer). I’ve always been fascinated by how data and AI are transforming the sport. Every now and then, I tinker with football analytics just for fun. Eventually, I hope to work at the intersection of my two biggest passions - football and technology. As they say, math is everywhere. Check out my <a class="link" href="/projects">projects</a> to find out more!</p>
    <p>
      PS: This site is my little playground. Welcome to my corner of the internet :) The idea is to give you a sense of how I see the world. I also write sometimes. mostly reflections and short stories which I share on <a href="https://www.instagram.com/ameyaranadee/">Instagram</a>. If you’d like to read them in sequence, you can find them in the writing section. I also enjoy making playlists <a href="https://open.spotify.com/user/4j9js6iek1qu53ypbhf1ddbvm/playlists">here</a>, and I have a thing for posters; you can explore my poster wall here <a class="link" href="/posters">here</a>. Feel free to play around, add your own posters, and even download it as an image!
    </p>
  </div>
</div>

<style lang="postcss">
  .g {
    @apply text-neutral-400;
  }

  ul li::before {
    content: "— ";
  }

  em {
    @apply font-serif text-[110%] leading-[100%];
  }

  .project-pair {
    @apply grid sm:grid-cols-[1fr,2fr] gap-y-1 -mx-3 px-3 py-2 hover:bg-neutral-100 transition-colors;
  }

  aside {
    @apply mt-0.5 text-base text-neutral-500;
  }

  /* Correction for vertical navigation links on mobile. */
  @media (max-width: 420px) {
    #eric-is {
      @apply -mt-10;
    }
  }
</style>