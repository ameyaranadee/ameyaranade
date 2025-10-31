<script lang="ts">
    import {
      Home,
      BookOpen,
      Github,
      Linkedin,
      Mail,
      Sun,
      Moon,
      Twitter,
    } from "@lucide/svelte";
    import { page } from "$app/stores";
    import { browser } from "$app/environment";
  
    let darkMode = false;
  
    if (browser) {
      darkMode = document.documentElement.classList.contains("dark");
    }
  
    const socialLinks = [
      { icon: Home, href: "/", separator: false },
      { icon: BookOpen, href: "/writing", separator: true },
      { icon: Github, href: "https://github.com/ameyaranadee", separator: false },
      {
        icon: Linkedin,
        href: "https://www.linkedin.com/in/ameya-ranade/",
        separator: false,
      },
      { icon: Twitter, href: "https://x.com/ameyaranadee", separator: true },
      { icon: Mail, href: "mailto:ranadeamr@gmail.com", separator: true },
    ];
  
    function toggleTheme() {
      if (browser) {
        darkMode = !darkMode;
        document.documentElement.classList.toggle("dark", darkMode);
        localStorage.setItem("theme", darkMode ? "dark" : "light");
      }
    }
  
    if (browser) {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        darkMode = savedTheme === "dark";
        document.documentElement.classList.toggle("dark", darkMode);
      }
    }
  </script>
  
  <div class="social-bar">
    {#each socialLinks as item, index}
      <a
        href={item.href}
        class="social-link"
        class:active={!item.href.startsWith("http") && !item.href.startsWith("mailto:") && $page.url.pathname === item.href}
        target={item.href.startsWith("http") || item.href.startsWith("mailto:") ? "_blank" : undefined}
        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
        aria-label={item.href === "/" ? "Home" : item.href.includes("github") ? "GitHub" : item.href.includes("linkedin") ? "LinkedIn" : item.href.includes("x.com") || item.href.includes("twitter") ? "Twitter" : item.href.includes("mailto") ? "Email" : "Writing"}
      >
        <svelte:component this={item.icon} size={20} stroke-width={2} />
      </a>
      {#if item.separator && index < socialLinks.length - 1}
        <div class="separator"></div>
      {/if}
    {/each}
    <!-- <div class="separator"></div>
    <button
      class="social-link theme-toggle"
      on:click={toggleTheme}
      aria-label="Toggle theme"
    >
      {#if darkMode}
        <Sun size={20} stroke-width={2} />
      {:else}
        <Moon size={20} stroke-width={2} />
      {/if}
    </button> -->
  </div>
  
  <style lang="postcss">
    .social-bar {
      @apply fixed bottom-8 left-1/2 -translate-x-1/2 z-50;
      @apply flex items-center gap-1 px-4 py-3;
      @apply bg-white/90 backdrop-blur-sm rounded-full;
      @apply shadow-lg border border-neutral-200/50;
      @apply dark:bg-neutral-900/90 dark:border-neutral-700/50;
    }
  
    .social-link {
      @apply flex items-center justify-center;
      @apply w-10 h-10 rounded-full;
      @apply text-neutral-700 hover:text-black;
      @apply transition-colors duration-200;
      @apply dark:text-neutral-300 dark:hover:text-white;
    }
  
    .social-link:hover {
      @apply bg-neutral-100 dark:bg-neutral-800;
    }
  
    .social-link.active {
      @apply text-black dark:text-white;
      @apply bg-neutral-100 dark:bg-neutral-800;
    }
  
    .theme-toggle {
      @apply cursor-pointer;
    }
  
    .separator {
      @apply w-px h-6 bg-neutral-300 dark:bg-neutral-700;
      @apply mx-1;
    }
  
    @media (max-width: 640px) {
      .social-bar {
        @apply bottom-4 px-3 py-2;
      }
  
      .social-link {
        @apply w-9 h-9;
      }
  
      :global(.social-link svg) {
        @apply w-4 h-4;
      }
    }
  </style>