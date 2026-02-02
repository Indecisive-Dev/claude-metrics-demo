---
theme: default
title: Benefits of Tinybird
info: |
  A presentation on the benefits of using Tinybird
  for real-time analytics at scale.
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
fonts:
  sans: 'Inter'
  mono: 'Roboto Mono'
---

# Benefits of Tinybird

Real-time analytics at any scale

<div class="pt-12">
  <span class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space for next page <carbon:arrow-right class="inline"/>
  </span>
</div>

---
layout: default
---

# What is Tinybird?

<v-clicks>

- Managed Clickhouse (OLAP)

- Managed Analytics platform

- Primarily for end user analytics, but can be for any analytics

</v-clicks>

<ZoomableImage src="https://www.tinybird.co/_next/static/media/diagram.3b6f51c8.png" class="absolute bottom-4 left-1/2 -translate-x-1/2 h-[55%]" />

---

# Why not OLTP Databases?

<v-clicks>

- At a small scale, they can work great, but lots of tuning with larger volumes of data

- Often need to dig deep into internals to scale analytical usage

- Best designed for lookups and range queries using indices

</v-clicks>

---

# Developer Experience

<v-clicks>

- Allows for custom endpoints for applications to call

- Pipelines can be created via sql

- Can be done via a cli and can run in CI/CD for testing

- Can scale based on usage

</v-clicks>

---

# Cost Efficiency

<v-clicks>

- Closer to a pay for what you use rather then reserving intances

- Do not need to configure or manage clickhouse

- Can reduce the lift for teams to integrate analytics, reports, dashboards into applications

</v-clicks>

---

# Demo: Datasources

<div class="flex gap-4 mt-8 justify-center items-start">
  <ZoomableImage src="/images/tb_datasources.png" class="h-[70%] max-h-[400px]" />
  <ZoomableImage src="/images/tb_datasources_part2.png" class="h-[70%] max-h-[400px]" />
</div>

---

# Demo: Endpoints

<div class="flex gap-4 mt-8 justify-center items-start">
  <ZoomableImage src="/images/tb_endpoint_1.png" class="h-[70%] max-h-[400px]" />
  <ZoomableImage src="/images/tb_endpoint_2.png" class="h-[70%] max-h-[400px]" />
</div>

---

# Demo: Application

<ZoomableImage src="/images/tb_demo_app.png" class="mt-4 mx-auto max-h-[480px]" />

---

# Use Cases

<v-clicks>

- Analytics for small teams

- Run costly reports on a separate datastore/process that doesn't affect the OLTP database

- Can setup custom prometheus endpoints to trigger alerts based on usage, lack of usage, etc.

</v-clicks>

---
layout: end
---

# The End :)

<div class="text-2xl text-green mt-4">
  tinybird.co
</div>



