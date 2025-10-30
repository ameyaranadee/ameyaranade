<script lang="ts">
  import { page } from "$app/stores";

  const links = [
    { name: "projects", href: "/projects" },
    { name: "writing", href: "/writing" },
    { name: "resume", href: "/resume" },
    { name: "posters", href: "/posters"}
  ];

  let pageTitle: string | null = null;
  $: {
    const link = links.find(({ href }) => href === $page.url.pathname);
    if (link) {
      pageTitle = link.name.charAt(0).toUpperCase() + link.name.slice(1);
    } else {
      pageTitle = null;
    }
  }
  let isHome = false;
  $: isHome = $page.url.pathname === "/";
</script>

<header
  class="layout-md flex justify-between items-start"
  data-sveltekit-noscroll
  data-sveltekit-preload-code="eager"
>
  <h1 class="font-bold text-black text-2xl mb-6">
    <a href="/">Ameya Ranade</a>
    {#if pageTitle}
      <span class="page-title">
        <span class="text-neutral-400">—</span>
        {pageTitle}
      </span>
    {/if}
  </h1>
  <nav>
  {#each links as link (link)}
    <a
      href={link.href}
      class="hover:text-black transition-colors"
      class:text-black={$page.url.pathname === link.href}
      class:relative={link.name === "posters" && isHome}
    >
      {link.name}

      {#if link.name === "posters" && isHome}
        <span class="attention-arrow text-black" aria-hidden="true">
          <svg width="56" height="26" viewBox="0 0 56 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 13H44" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
            <path d="M36 4L44 13L36 22" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      {/if}
    </a>
  {/each}
</nav>
</header>

<style lang="postcss">
  nav {
    @apply flex items-start text-neutral-500 justify-end space-x-6 text-lg py-0.5;
  }

  .page-title {
    @apply font-light;
  }

  @media (max-width: 580px) {
    .page-title {
      @apply block text-xl;
    }
    .page-title :first-child {
      @apply hidden;
    }
  }

  @media (max-width: 420px) {
    nav {
      @apply flex-col items-end space-x-0;
    }
  }

  /* NEW: attention arrow */
  .attention-arrow {
    position: absolute;
    left: -2.75rem; /* adjust to taste */
    top: -0.6rem;   /* adjust to taste */
    pointer-events: none;
    z-index: 1;
    animation: dance 1.4s ease-in-out infinite;
    transform-origin: 80% 50%;
  }

  @keyframes dance {
    0%, 100% {
      transform: translateX(0) rotate(-8deg) scaleX(1.25);
    }
    50% {
      transform: translateX(-8px) rotate(6deg) scaleX(1.4);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .attention-arrow {
      animation: none;
    }
  }
</style>