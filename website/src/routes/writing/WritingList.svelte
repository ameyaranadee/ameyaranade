<script lang="ts">
  import { ArrowUpRight } from '@lucide/svelte';
  import { formatTime } from "$lib/utils";

  type Writing = {
    title: string;
    date: Date;
    summary: string;
    link: string;
    content?: string;
  };

  export let data: Writing[];
  export let openModal: (writing: Writing) => void;
</script>

<div class="grid gap-y-4">
  {#each data as item}
    <button
      on:click={() => openModal(item)}
      class="block w-full text-left -mx-3 px-3 py-2 hover:bg-neutral-100 transition-colors"
    >
      <div class="flex flex-col sm:flex-row sm:items-end mb-1.5">
        <div class="text-lg text-black">
          {item.title}
          <ArrowUpRight size={18} class="inline text-neutral-400" />
        </div>
        <div class="sm:ml-auto mb-0.5 text-neutral-500">
          {formatTime("%B %-d, %Y", item.date)}
        </div>
      </div>
      <div class="text-lg leading-snug font-serif italic">
        {item.summary}
      </div>
    </button>
  {/each}
</div>