<script setup lang="ts">
interface Props {
  imageUrl: string
  beachName: string
  tag?: string
  heightClass?: string
  hasCork?: boolean
}

withDefaults(defineProps<Props>(), {
  tag: '',
  heightClass: 'h-64 sm:h-80',
  hasCork: true
})
</script>

<template>
  <div class="relative flex flex-col items-center justify-center group bottle-container select-none">
    <div v-if="hasCork" class="flex flex-col items-center z-20">
      <div class="w-6 h-3 bg-[#9A6B39] rounded-t-sm shadow-inner border border-[#7C4E1E]" />
      <div class="w-8 h-2 bg-[#B8860B] rounded-sm shadow-sm" />
    </div>

    <div
      :class="[
        heightClass,
        'relative w-28 sm:w-36 rounded-t-full rounded-b-3xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105 border-2 border-white/60'
      ]"
    >
      <img
        :src="imageUrl"
        :alt="beachName"
        class="w-full h-full object-cover object-center filter brightness-105 group-hover:brightness-110 transition-all duration-700"
      />

      <div class="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-white/10 pointer-events-none" />
      <div class="absolute left-2 top-0 bottom-0 w-2 bg-white/25 blur-[1px] pointer-events-none rounded-full" />

      <div class="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[84%] bg-white/95 backdrop-blur-sm px-2 py-2.5 rounded shadow-md border border-[#E8E2D5] text-center pointer-events-none">
        <div class="text-[7px] tracking-[0.2em] uppercase font-bold text-[#0A2B42]">LEVE O MAR</div>
        <div class="text-[5px] text-[#E86A58] italic scale-90">Destinos em uma Garrafa</div>
        <div class="w-6 h-[1px] bg-[#D6CFC0] mx-auto my-0.5" />
        <div class="text-[6px] tracking-widest text-[#5A738E] font-medium uppercase">{{ beachName }}</div>
      </div>

      <div class="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-[#D2B48C]/90 via-[#E8D8B0]/60 to-transparent pointer-events-none" />
    </div>

    <div
      v-if="tag"
      class="mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E5E0D5]/90 backdrop-blur-sm text-[11px] font-medium text-[#0A2B42] border border-[#D6CFC0] shadow-sm whitespace-nowrap"
    >
      <span>{{ tag }}</span>
    </div>
  </div>
</template>

<style scoped>
.bottle-container {
  filter: drop-shadow(0 15px 25px rgba(10, 43, 66, 0.15));
}
</style>
