<script setup lang="ts">
withDefaults(defineProps<{ color?: string }>(), { color: '#7D8B74' })
</script>

<!-- A long-stemmed rose in whimsical line art, drawn in SVG so it needs no image files -->
<template>
  <svg viewBox="0 0 200 300" fill="none" :stroke="color" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <!-- Bloom, tipped to one side: the curled heart, the petals around it, rolled-back lips and curly sepals -->
    <g transform="rotate(-8 100 72)">
      <path d="M104 58C98 53 89 57 90 64C91 71 101 72 104 66C106 62 102 58 98 61" />
      <path d="M90 64C86 55 91 46 100 45C110 44 117 51 114 60" />
      <path d="M85 57C81 70 88 81 100 81C112 81 121 72 118 59" />
      <path d="M85 57C78 53 71 58 70 66C68 80 80 92 99 93" />
      <path d="M118 59C126 54 133 60 133 68C133 82 119 92 101 93" />
      <path d="M88 47C93 37 111 35 119 43" opacity=".8" />
      <path d="M70 66C60 71 58 87 66 97C76 107 92 107 100 105" />
      <path d="M133 68C143 74 143 90 135 99C125 107 108 107 100 105" />
      <path d="M70 66C64 58 67 49 76 47C73 50 73 54 76 56" opacity=".8" />
      <path d="M133 68C139 60 136 51 127 49C130 52 130 56 127 58" opacity=".8" />
      <path d="M92 104C86 113 76 116 69 111C72 111 74 109 74 106" opacity=".8" />
      <path d="M108 104C114 113 124 116 131 111C128 111 126 109 126 106" opacity=".8" />
      <path d="M100 106C99 111 100 115 101 118" opacity=".8" />
    </g>
    <!-- A wavy stem with curling tendrils -->
    <path d="M105 106C97 140 116 168 106 200C97 230 112 262 102 300" />
    <path d="M109 158C124 150 140 154 140 168C140 178 128 181 125 173C123 167 130 163 133 168" opacity=".85" />
    <path d="M103 228C88 222 74 228 74 240C74 249 85 250 87 243C88 238 82 235 79 239" opacity=".85" />
    <!-- Leaves -->
    <g opacity=".8">
      <path d="M106 190C94 188 84 182 78 174" />
      <path d="M78 174C62 174 50 162 50 146C66 148 78 160 78 174Z" />
      <path d="M78 174C70 164 60 154 51 147" />
      <path d="M91 185C89 197 79 205 67 205C69 193 79 185 91 185Z" />
      <path d="M91 185C83 193 75 199 68 204" />
      <path d="M105 256C118 256 128 250 134 242" />
      <path d="M134 242C136 226 150 216 166 216C164 232 150 242 134 242Z" />
      <path d="M134 242C144 234 154 224 165 217" />
    </g>
    <!-- A few floating dots -->
    <g :fill="color" stroke="none">
      <circle cx="62" cy="38" r="1.8" />
      <circle cx="148" cy="30" r="1.4" />
      <circle cx="158" cy="94" r="2" />
      <circle cx="150" cy="136" r="1.4" />
      <circle cx="58" cy="226" r="1.5" />
      <circle cx="152" cy="286" r="1.3" />
    </g>
  </svg>
</template>
