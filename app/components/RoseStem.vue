<script setup lang="ts">
withDefaults(defineProps<{ color?: string }>(), { color: '#7D8B74' })
</script>

<!-- A long-stemmed rose in line art, drawn in SVG so it needs no image files -->
<template>
  <svg viewBox="0 0 200 300" fill="none" :stroke="color" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <!-- Bloom: the curled heart, then the petals wrapped around it -->
    <path d="M104 58C98 53 89 57 90 64C91 71 101 72 104 66C106 62 102 58 98 61" />
    <path d="M90 64C86 55 91 46 100 45C110 44 117 51 114 60" />
    <path d="M85 57C81 70 88 81 100 81C112 81 121 72 118 59" />
    <path d="M85 57C78 53 71 58 70 66C68 80 80 92 99 93" />
    <path d="M118 59C126 54 133 60 133 68C133 82 119 92 101 93" />
    <path d="M88 47C93 37 111 35 119 43" opacity=".8" />
    <path d="M70 66C60 71 58 87 66 97C76 107 92 107 100 105" />
    <path d="M133 68C143 74 143 90 135 99C125 107 108 107 100 105" />
    <path d="M70 66C66 56 72 48 81 48" opacity=".8" />
    <path d="M133 68C137 58 131 50 122 48" opacity=".8" />
    <!-- Sepals and stem -->
    <path d="M92 104C86 112 77 115 68 112" opacity=".8" />
    <path d="M108 104C114 112 123 115 132 112" opacity=".8" />
    <path d="M100 106C98 160 105 222 97 300" />
    <!-- Thorns -->
    <path d="M101.2 146C105 144 108 141 110 137C108 143 105 148 101.6 152" opacity=".7" />
    <path d="M101.4 208C97 206 94 203 92 199C94 205 97 210 101.2 214" opacity=".7" />
    <path d="M99.4 262C103 260 106 257 108 253C106 259 103 264 99 268" opacity=".7" />
    <!-- Leaves, two leaflets to a stalk -->
    <g opacity=".75">
      <path d="M101 176C90 177 80 180 70 186" />
      <path d="M70 186C60 175 42 176 34 189C46 199 63 198 70 186Z" />
      <path d="M70 186C58 187 46 189 36 189" />
      <path d="M84 181C82 169 72 160 60 161C62 173 72 181 84 181Z" />
      <path d="M84 181C77 174 69 167 61 162" />
      <path d="M99 236C110 235 120 232 130 226" />
      <path d="M130 226C140 212 160 211 168 222C158 236 140 239 130 226Z" />
      <path d="M130 226C143 224 155 222 166 222" />
      <path d="M115 232C119 244 130 250 142 248C139 237 128 231 115 232Z" />
      <path d="M115 232C123 238 132 243 141 247" />
    </g>
  </svg>
</template>
