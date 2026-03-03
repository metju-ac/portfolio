<template>
  <div class="text-xs md:text-header-window">
    <h3 class="mt-2 mb-2">{{ $t('common.context') }}</h3>
    <p>{{ $t('project.remembeer.contextFirstParagraph') }}</p>
    <br />
    <p>{{ $t('project.remembeer.contextSecondParagraph') }}</p>
    <br />
    <p>{{ $t('project.remembeer.contextThirdParagraph') }}</p>

    <h3 class="mt-5 mb-2">{{ $t('common.objectives') }}</h3>
    <ul class="list-disc ml-3">
      <li>{{ $t('project.remembeer.goalFirst') }}</li>
      <li>{{ $t('project.remembeer.goalSecond') }}</li>
      <li>{{ $t('project.remembeer.goalThird') }}</li>
      <li>{{ $t('project.remembeer.goalFourth') }}</li>
    </ul>

    <div class="flex flex-row items-center gap-0.5 mt-5 mb-2 cursor-pointer transition-all hover:underline hover:text-heroic-blue hover:fill-heroic-blue">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" class="fill-current">
        <path
          d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
        />
      </svg>
      <a rel="noopener" href="https://github.com/remembeer-app/remembeer" target="_blank" class="cursor-pointer">
        {{ $t('buttons.linkRepository') }}
      </a>
    </div>
  </div>
</template>
