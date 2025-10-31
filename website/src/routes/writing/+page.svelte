<script lang="ts">
  import Seo from "$lib/components/Seo.svelte";
  import WritingList from "./WritingList.svelte";
  import ReadingModal from "./ReadingModal.svelte";
  import writing from "./writing.yaml";

  let selectedWriting = null;
  let showModal = false;

  function openModal(writing) {
    selectedWriting = writing;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    selectedWriting = null;
  }
</script>

<Seo
  title="Ameya Ranade – Writing"
  description="Past writing: musings, essays, notes, and technical blog posts."
/>
<section class="layout-md py-4">
  <h3 class="heading3"> You can also read my essays on my Instagram <a class="link" href="https://www.instagram.com/ameyaranadee/"> here! </a> </h3>
</section>

<section class="layout-md py-4">
  <h2 class="heading2">Musings and essays</h2>
  <WritingList data={writing.notes} {openModal} />
</section>

<!--
<section class="layout-md py-4">
  <h2 class="heading2">Blogs</h2>
  <WritingList data={writing.technology} {openModal} />
</section>
-->

{#if showModal && selectedWriting}
  <ReadingModal 
    writing={selectedWriting} 
    on:close={closeModal}
  />
{/if}