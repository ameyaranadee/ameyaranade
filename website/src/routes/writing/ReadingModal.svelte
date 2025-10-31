<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { X, ChevronLeft, ChevronRight } from '@lucide/svelte';
  import { formatTime } from "$lib/utils";
  import { onMount } from 'svelte';

  type Writing = {
    title: string;
    date: Date;
    summary: string;
    link: string;
    content?: string;
  };

  export let writing: Writing;

  const dispatch = createEventDispatcher();

  let currentPage = 0;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let translateX = 0;
  let pages: string[] = [];
  let isTurning = false;
  let dragThreshold = 50; // Minimum distance to trigger page turn

    function splitContentIntoPages(content: string, wordsPerPage: number = 200): string[] {
    if (!content) return [];

    const tolerance = Math.floor(wordsPerPage * 0.18); // ~18% wiggle room

    const countWords = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);

    const splitIntoParagraphs = (text: string) =>
      text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

    const splitParagraphIntoSentences = (p: string) => {
      // Keep sentence-ending punctuation with sentence; handle ellipses/quotes
      const parts = p
        .replace(/\s+/g, ' ')
        .match(/[^.!?]+[.!?]+(?:["'’”)]*)|\S+(?=\s*$)/g) || [p];
      return parts.map((s) => s.trim());
    };

    // Build units as sentences, carrying paragraph boundaries
    type Unit = { text: string; words: number; breakBefore?: boolean; breakAfter?: boolean };
    const units: Unit[] = [];
    const paragraphs = splitIntoParagraphs(content);
    paragraphs.forEach((p, idx) => {
      const sentences = splitParagraphIntoSentences(p);
      sentences.forEach((s, i) => {
        units.push({
          text: s,
          words: countWords(s),
          breakBefore: i === 0, // paragraph start
          breakAfter: i === sentences.length - 1 // paragraph end
        });
      });
      if (idx < paragraphs.length - 1) {
        // marker that a blank line should be between paragraphs when rendering
        units.push({ text: '\n\n', words: 0 });
      }
    });

    const pages: string[] = [];
    let buff: string[] = [];
    let buffWords = 0;

    const flush = () => {
      const page = buff.join('').replace(/\n{3,}/g, '\n\n').trim();
      if (page) pages.push(page);
      buff = [];
      buffWords = 0;
    };

    const appendUnit = (u: Unit) => {
      if (u.text === '\n\n') {
        buff.push('\n\n');
        return;
      }
      // add paragraph spacing if needed
      if (u.breakBefore && buff.length && !/\n\n$/.test(buff.join(''))) buff.push('\n\n');
      buff.push(u.text.endsWith(' ') ? u.text : u.text + ' ');
      buffWords += u.words;
      if (u.breakAfter) buff.push('\n'); // soft line end within paragraph
    };

    // Greedy pack with tolerance; split very long sentences by words
    for (const u of units) {
      if (u.text === '\n\n') {
        appendUnit(u);
        continue;
      }

      const wouldBe = buffWords + u.words;
      const overHard = wouldBe > wordsPerPage + tolerance;

      if (overHard && buffWords > 0) {
        flush();
      }

      // If a single unit is too large for an empty page, split by words
      if (u.words > wordsPerPage + tolerance) {
        const words = u.text.split(/\s+/);
        let chunk: string[] = [];
        let chunkCount = 0;
        for (const w of words) {
          if (chunkCount + 1 > wordsPerPage + tolerance) {
            buff.push(chunk.join(' ') + ' ');
            pages.push(buff.join('').trim());
            buff = [];
            buffWords = 0;
            chunk = [];
            chunkCount = 0;
          }
          chunk.push(w);
          chunkCount += 1;
        }
        if (chunk.length) {
          const chunkText = chunk.join(' ');
          appendUnit({ text: chunkText, words: countWords(chunkText) });
        }
      } else {
        appendUnit(u);
        // If we're somewhat over target, and the next unit is likely a new paragraph, consider flushing
        if (buffWords >= wordsPerPage && /\n\n$/.test(buff.join(''))) {
          flush();
        }
      }
    }
    flush();

    // Light balancing pass between adjacent pages
    const pageWordCounts = pages.map((p) => countWords(p));
    const total = pageWordCounts.reduce((a, b) => a + b, 0);
    const avg = total / Math.max(1, pages.length);

    const rebalance = () => {
      for (let i = 0; i < pages.length - 1; i++) {
        if (pageWordCounts[i] > avg + tolerance && pageWordCounts[i + 1] < avg - tolerance) {
          // Move last sentence(s) from page i to i+1
          const left = pages[i];
          const right = pages[i + 1];
          const leftParts = left.match(/[^.!?]+[.!?]+(?:["'’”)]*)|\S+(?=\s*$)/g) || [left];
          if (leftParts.length > 1) {
            const moved = leftParts.pop()!.trim();
            const movedWords = countWords(moved);
            pages[i] = leftParts.join(' ').trim();
            pages[i + 1] = (moved + (right ? ' ' + right : '')).trim();
            pageWordCounts[i] -= movedWords;
            pageWordCounts[i + 1] += movedWords;
          }
        }
      }
    };

    rebalance();

    return pages;
  }

  
  function computeWordsPerPage(): number {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
    if (w >= 1280) return 280;
    if (w >= 1024) return 250;
    if (w >= 640)  return 220;
    return 180;
  }

  function repaginate() {
    if (writing?.content) {
      pages = splitContentIntoPages(writing.content, computeWordsPerPage());
      // Prepend title and date to first page
      if (pages.length > 0) {
        const titleHeader = `${writing.title}\n\n${formatTime("%B %-d, %Y", writing.date)}\n\n`;
        pages[0] = titleHeader + pages[0];
      } else {
        pages = [`${writing.title}\n\n${formatTime("%B %-d, %Y", writing.date)}\n\n${writing.content}`];
      }
      currentPage = Math.min(currentPage, Math.max(0, pages.length - 1));
    }
  }

  $: {
    if (writing?.content) {
      repaginate();
    } else {
       // Fallback: create pages from summary and title
       pages = [
         `${writing.title}\n\n${formatTime("%B %-d, %Y", writing.date)}\n\n${writing.summary}`,
         "This is a placeholder for the full content. In a real implementation, you would load the actual content here."
       ];
     }
   }

  onMount(() => {
    repaginate();
    const handler = () => repaginate();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  });

  function handleMouseDown(event: MouseEvent) {
    if (isTurning) return;
    event.preventDefault();
    isDragging = true;
    startX = event.clientX;
    currentX = event.clientX;
    translateX = 0;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseMove(event: MouseEvent) {
    if (!isDragging || isTurning) return;
    event.preventDefault();
    currentX = event.clientX;
    translateX = currentX - startX;
  }

  function handleMouseUp(event: MouseEvent) {
    if (!isDragging || isTurning) return;
    event.preventDefault();
    isDragging = false;
    
    if (Math.abs(translateX) > dragThreshold) {
      if (translateX > 0 && currentPage > 0) {
        goToPreviousPage();
      } else if (translateX < 0 && currentPage < pages.length - 1) {
        goToNextPage();
      }
    }
    
    translateX = 0;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }

  function handleTouchStart(event: TouchEvent) {
    if (isTurning) return;
    event.preventDefault();
    isDragging = true;
    startX = event.touches[0].clientX;
    currentX = event.touches[0].clientX;
    translateX = 0;
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  }

  function handleTouchMove(event: TouchEvent) {
    if (!isDragging || isTurning) return;
    event.preventDefault();
    currentX = event.touches[0].clientX;
    translateX = currentX - startX;
  }

  function handleTouchEnd(event: TouchEvent) {
    if (!isDragging || isTurning) return;
    event.preventDefault();
    isDragging = false;
    
    if (Math.abs(translateX) > dragThreshold) {
      if (translateX > 0 && currentPage > 0) {
        goToPreviousPage();
      } else if (translateX < 0 && currentPage < pages.length - 1) {
        goToNextPage();
      }
    }
    
    translateX = 0;
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  }

  function goToNextPage() {
    if (currentPage < pages.length - 1 && !isTurning) {
      isTurning = true;
      currentPage++;
      setTimeout(() => {
        isTurning = false;
      }, 600);
    }
  }

  function goToPreviousPage() {
    if (currentPage > 0 && !isTurning) {
      isTurning = true;
      currentPage--;
      setTimeout(() => {
        isTurning = false;
      }, 600);
    }
  }

  function closeModal() {
    dispatch('close');
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
    } else if (event.key === 'ArrowLeft') {
      goToPreviousPage();
    } else if (event.key === 'ArrowRight') {
      goToNextPage();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div 
  class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
  on:click={closeModal}
  on:keydown={handleKeydown}
  role="dialog"
  aria-modal="true"
  tabindex="-1"
>
  <div 
    class="relative bg-white shadow-2xl"
    style="width: 180mm; height: 300mm; max-width: 90vw; max-height: 90vh;"
    on:click|stopPropagation
  >
    
    <div class="relative z-10 h-full flex flex-col bg-white rounded-lg shadow-xl overflow-hidden">
      <!-- Close button positioned absolutely in top right -->
      <button 
        on:click={closeModal}
        class="absolute top-4 right-4 z-50 p-2 hover:bg-gray-200 rounded-full transition-colors bg-white bg-opacity-90 shadow-lg"
        aria-label="Close modal"
      >
        <X size={20} />
      </button>

      <div class="flex-1 relative overflow-hidden">
        <div 
          class="h-full flex transition-transform duration-600 ease-in-out"
          style="transform: translateX({-currentPage * 100}%);"
        >
          {#each pages as page, index}
            <div 
              class="w-full h-full flex-shrink-0 p-10 md:p-12 overflow-y-auto cursor-grab active:cursor-grabbing"
              on:mousedown={handleMouseDown}
              on:touchstart={handleTouchStart}
              style="user-select: none;"
            >
              <div class="prose prose-xl max-w-none h-full">
                {@html page.replace(/\n/g, '<br>')}
              </div>
            </div>
          {/each}
        </div>

        {#if currentPage > 0}
          <div class="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-gray-200 to-transparent pointer-events-none"></div>
        {/if}
        {#if currentPage < pages.length - 1}
          <div class="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-gray-200 to-transparent pointer-events-none"></div>
        {/if}

        {#if currentPage > 0}
          <button
            on:click={goToPreviousPage}
            class="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-lg transition-all border border-gray-300"
            aria-label="Previous page"
            disabled={isTurning}
          >
            <ChevronLeft size={24} class="text-gray-700" />
          </button>
        {/if}

        {#if currentPage < pages.length - 1}
          <button
            on:click={goToNextPage}
            class="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-lg transition-all border border-gray-300"
            aria-label="Next page"
            disabled={isTurning}
          >
            <ChevronRight size={24} class="text-gray-700" />
          </button>
        {/if}
      </div>

      <div class="flex items-center justify-between p-4 border-t bg-gray-50">
        <div class="text-sm text-gray-600 font-medium">
          Page {currentPage + 1} of {pages.length}
        </div>
        <div class="flex space-x-1">
          {#each pages as _, index}
            <div 
              class="w-2 h-2 rounded-full transition-all duration-300 {index === currentPage ? 'bg-blue-600 scale-110' : 'bg-gray-300'}"
            ></div>
          {/each}
        </div>
      </div>
    </div>

    <div class="absolute -right-1 top-2 w-full h-full bg-gray-300 rounded-lg transform rotate-1 scale-95 opacity-50"></div>
    <div class="absolute -right-2 top-4 w-full h-full bg-gray-400 rounded-lg transform rotate-2 scale-90 opacity-30"></div>
  </div>
</div>

<style>
  .prose {
    line-height: 1.7;
    font-family: 'Cardo', 'Times New Roman', serif;
  }
  
  .prose :global(strong:first-child) {
    font-size: 2.5rem;
    font-weight: bold;
    display: block;
    margin-bottom: 0.5rem;
    color: #1f2937;
  }
  
  .prose h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    color: #1f2937;
  }
  
  .prose h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 1.5rem 0 1rem 0;
    color: #374151;
  }
  
  .prose p {
    margin-bottom: 1.25rem;
    text-align: justify;
  }

  /* Page turning animation */
  @keyframes pageTurn {
    0% {
      transform: rotateY(0deg);
    }
    50% {
      transform: rotateY(-10deg);
    }
    100% {
      transform: rotateY(0deg);
    }
  }

  .page-turning {
    animation: pageTurn 0.6s ease-in-out;
  }

  /* A4 aspect ratio maintenance */
  @media (max-width: 768px) {
    .book-container {
      width: 95vw !important;
      height: calc(95vw * 1.414) !important; /* A4 ratio */
      max-height: 90vh !important;
    }
  }

  /* Custom scrollbar for the page content */
  .prose::-webkit-scrollbar {
    width: 6px;
  }

  .prose::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  .prose::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  .prose::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8; 
  }

  /* Prevent text selection during drag */
  .no-select {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>