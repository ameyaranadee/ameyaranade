<script lang="ts">
  import Seo from "$lib/components/Seo.svelte";
  import Workplace from "./Workplace.svelte";
</script>

<Seo
  title="Ameya Ranade – Resume"
  description="Software engineer, researcher, and explorer."
/>

<section class="layout-md py-12">
  <h2 class="heading2">Experience</h2>

  <div class="timeline-container">
    <div class="timeline-line"></div>
    <div class="timeline-item">
      <div class="timeline-dot current"></div>
      <div class="timeline-content">
      <Workplace
        title="Software Engineer"
        company="Intellect Design Arena"
        url="https://thinkingmachines.ai/"
        dates="July 2025 – Current"
        location="NJ, USA"
      />
      <li> Engineered 4+ core features for Xponent, a commercial insurance underwriting workbench, using Java and Spring Boot to automate compliance checks, risk analysis, and premium calculations. </li>
      <li> Owned production reliability for MagicSubmission, an AI-powered insurance submission platform utilizing Kibana, Grafana, and Loki for log monitoring and RCA, ensuring 99%+ uptime for document ingestion and extraction. </li>
      <li> Built admin configuration screens using Typescript and Angular, implementing session-based caching to eliminate redundant database calls, slashing UI load times by 60%. </li>
      
    </div>
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
      <Workplace
        title="Founding Software Engineer"
        company="material.engineer (Stealth startup)"
        url="https://thinkingmachines.ai/"
        dates="June 2024 – Dec 2024"
        location="TX, USA"
      />
      <li> Built 10+ end-to-end features for SpecGenie, an AI-powered EPC workflow automation product for industrial engineering specifications, reducing processing time from weeks to under 4 hours. </li>
      <li> Architected document extraction leveraging AWS Textract and LLMs to convert unstructured piping specifications into structured enterprise data with 98% accuracy, processing 1000+ components in under 2 minutes. </li>
      <li> Designed compound AI systems combining LLM orchestration and rule-based validation to generate 35+ bulk-loadable specification and catalog Excel sheets, eliminating 95% of manual data entry. </li>
      <li> Architected document extraction leveraging AWS Textract and LLMs to convert unstructured piping specifications into structured enterprise data with 98% accuracy, processing 1000+ components in under 2 minutes. </li>
      <li> Developed dashboards with React and Material UI, integrating 15+ RESTful endpoints and CRUD support for specification lifecycle management and revision tracking.  </li>
    </div>
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
      <Workplace
        title="ML Research Intern"
        company="Center for Machine Intelligence and Data Science (CMInDS)"
        url="https://thinkingmachines.ai/"
        dates="Jan 2022 – July 2022"
        location="Mumbai, India"
      />
      <li> Developed Automatic Short Answer Grading system using stacked embeddings and ensemble models, improving benchmarks by 13% (0.667 Pearson) on Mohler dataset. </li>
      <li> Implemented custom spell correction, cosine similarity variants, and per-question training to improve semantic matching accuracy by 15%. </li>
    </div>
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
      <Workplace
        title="Software Engineer Intern"
        company="LokaVidya Technologies"
        url="https://thinkingmachines.ai/"
        dates="July 2021 – Jan 2022"
        location="Mumbai, India"
      />
      <li> Developed LokaVidya Meet, a video conferencing platform using Node.js and BigBlueButton APIs to deliver 6+ meeting features, supporting secure virtual meetings across educational institutions. </li>
      <li> Migrated RBAC from in-memory storage to Redis for session and role caching, reducing access latency by 87% and offloading Azure SQL queries on subsequent requests. </li>
    </div>
  </div>
</section>

<section class="layout-md py-2">
  <h2 class="heading2">Education</h2>

  <div class="mb-4">
    <div class="flex justify-between items-end">
      <h3 class="text-black text-lg">University of Massachusetts Amherst</h3>
      <div class="text-neutral-500 mb-0.5">2023 — 2025</div>
    </div>
    <p class="byline">M.S. in Computer Science</p>
  </div>

  <div class="mb-4">
    <div class="flex justify-between items-end">
      <h3 class="text-black text-lg">University of Mumbai</h3>
      <div class="text-neutral-500 mb-0.5">2019 — 2023</div>
    </div>
    <p class="byline">B.Tech in Computer Science with a Minors in Management</p>
  </div>

  <h4 class="font-medium mt-4 mb-1">Teaching:</h4>
  <ul>
    <li>
      Grader for CS 532 (Systems for Data Science), Spring 2025
    </li>
    <li>
      TA for CS 161 (Distributed Systems), Spring 2021
    </li>
  </ul>

  <h4 class="font-medium mt-4 mb-1">Graduate-level technical coursework:</h4>
  <ul>
    <li>Algorithms for Data Science (CS 514)</li>
    <li>Systems for Data Science (CS 532)</li>
    <li>Applied Information Retrieval (CS 546)</li>
    <li>Machine Learning (CS 589)</li>
    <li>Robotics (CS 603)</li>
    <li>Operating & Distributed Systems (CS 677)</li>
    <li>Neural Networks (CS 682)</li>
    <li>Advanced Natural Language Processing (CS 685)</li>
    <li>Systems for Deep Learning (CS 690AB)</li>
    <li>Independent Research (CS 696DS)</li>
  </ul>

  <h4 class="font-medium mt-4 mb-1">Undergraduate technical coursework:</h4>
  <ul>
    <li>Probability and Statistics (MA203)</li>
    <li>Discrete Structures and Graph Theory (IT201)</li>
    <li>Data Structures (IT202)</li>
    <li>Computer Architecture and Organization (IT203)</li>
    <li>Database Management Systems (IT204)</li>
    <li>Linear Algebra (MA201)</li>
    <li>Design and Analysis of Algorithms (IT205)</li>
    <li>Operating Systems (IT206)</li>
    <li>Computer Communications and Networks (IT207)</li>
    <li>Theory of Computation (IT301)</li>
    <li>Software Engineering (IT302)</li>
    <li>Distributed Computing (IT304)</li>
    <li>Object Oriented Programming (IT305B)</li>
    <li>Natural Language Processing (IT413)</li>
    <li>Soft Computing (IT312)</li>
    <li>Data Analytics (OEIT6)</li>
    <li>Blockchain Technology (IT424)</li>
    <li>Deep Learning (IT414)</li>
    <li>Human Machine Interaction (IT413)</li>
    <li>Advanced Database Systems (IT312)</li>
  </ul>
</section>

<section class="layout-md py-2">
  <h2 class="heading2">Leadership Roles:</h2>

  <div class="mb-4">
    <h3 class="font-medium mb-1">Chairperson of Computer Society of India, S.P.I.T chapter:</h3>
    <ul>
    <li>
      Led a team of <b>20+</b>, raising <b>$6k+</b> for <b>9</b> tech events including the S.P.I.T Hackathon (<b>150+</b> teams)
    </li>
    </ul>
   <h3 class="font-medium mb-1">Vice-Chairperson, Oculus:</h3>
    <ul>
    <li>
      Managed <b>100+</b> members, raised <b>$10k+</b>, and coordinated operations for <b>5000+</b> attendees
    </li>
  </ul>
  </div>
</section>

<section class="layout-md py-2">
  <h2 class="heading2">Awards and Honors</h2>

  <div class="mb-4">
    <h3 class="font-medium mb-1">Academic Achievements:</h3>
    <ul>
    <li>
      <b>State Scholarship Examination:</b> 9<sup>th</sup> in Maharashtra, 4<sup>th</sup> Grade (2011)
    </li>
    <li>
      <b>Pravinya Mathematics Examination:</b> 1<sup>st</sup> in Maharashtra (2012)
    </li>
    <li>
      <b>Homi Bhabha Examination:</b> Silver Medalist, 6<sup>th</sup> Grade (2013)
    </li>
    <li>
      <b>International Mathematics Olympiad (IMO):</b> Gold Medalist, 9<sup>th</sup> Grade (2016)
    </li>
  </ul>
  </div>
</section>

<style lang="postcss">
  b {
    @apply font-medium;
  }

  ul {
    @apply list-disc pl-7 marker:text-neutral-400;
  }

  .byline {
    @apply font-serif italic;
  }
</style>
