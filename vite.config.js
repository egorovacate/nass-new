import { copyFileSync, cpSync } from 'node:fs';
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        association: resolve(import.meta.dirname, 'association.html'),
        activity: resolve(import.meta.dirname, 'activity.html'),
        documents: resolve(import.meta.dirname, 'documents.html'),
        coMentoring: resolve(import.meta.dirname, 'co-mentoring.html'),
        consulting: resolve(import.meta.dirname, 'consulting.html'),
        businessAiTransformation: resolve(import.meta.dirname, 'business-ai-transformation.html'),
        mentoring: resolve(import.meta.dirname, 'mentoring.html'),
        training: resolve(import.meta.dirname, 'training.html'),
        growthTechnology: resolve(import.meta.dirname, 'growth-technology.html'),
        webinarProbiotics: resolve(import.meta.dirname, 'webinar-probiotics.html'),
        webinarWater: resolve(import.meta.dirname, 'webinar-water.html'),
        webinarBreeding: resolve(import.meta.dirname, 'webinar-breeding.html'),
        webinarAntibiotics: resolve(import.meta.dirname, 'webinar-antibiotics.html'),
        experts: resolve(import.meta.dirname, 'experts.html'),
        news: resolve(import.meta.dirname, 'news.html'),
        indexEn: resolve(import.meta.dirname, 'index-en.html'),
        associationEn: resolve(import.meta.dirname, 'association-en.html'),
        activityEn: resolve(import.meta.dirname, 'activity-en.html'),
        expertsEn: resolve(import.meta.dirname, 'experts-en.html'),
        consultingEn: resolve(import.meta.dirname, 'consulting-en.html'),
        businessAiTransformationEn: resolve(import.meta.dirname, 'business-ai-transformation-en.html'),
        mentoringEn: resolve(import.meta.dirname, 'mentoring-en.html'),
        coMentoringEn: resolve(import.meta.dirname, 'co-mentoring-en.html'),
        trainingEn: resolve(import.meta.dirname, 'training-en.html'),
        newsEn: resolve(import.meta.dirname, 'news-en.html'),
        documentsEn: resolve(import.meta.dirname, 'documents-en.html'),
        growthTechnologyEn: resolve(import.meta.dirname, 'growth-technology-en.html'),
        webinarProbioticsEn: resolve(import.meta.dirname, 'webinar-probiotics-en.html'),
        webinarWaterEn: resolve(import.meta.dirname, 'webinar-water-en.html'),
        webinarBreedingEn: resolve(import.meta.dirname, 'webinar-breeding-en.html'),
        webinarAntibioticsEn: resolve(import.meta.dirname, 'webinar-antibiotics-en.html'),
      },
    },
  },
  plugins: [
    {
      name: 'copy-classic-script',
      closeBundle() {
        copyFileSync('main.js', 'dist/main.js');
        copyFileSync('site.js', 'dist/site.js');
        copyFileSync('experts-data.js', 'dist/experts-data.js');
        copyFileSync('experts-page.js', 'dist/experts-page.js');
        copyFileSync('english-pages.js', 'dist/english-pages.js');
        copyFileSync('experts-en.js', 'dist/experts-en.js');
        copyFileSync('webinars.js', 'dist/webinars.js');
        copyFileSync('responsive-fixes.css', 'dist/responsive-fixes.css');
        copyFileSync('assets/nass.svg', 'dist/assets/nass.svg');
        copyFileSync('assets/nass-logo-horizontal-white.svg', 'dist/assets/nass-logo-horizontal-white.svg');
        copyFileSync('assets/nass-logo-stacked-white.svg', 'dist/assets/nass-logo-stacked-white.svg');
        copyFileSync('assets/nass-mark.svg', 'dist/assets/nass-mark.svg');
        cpSync('assets/experts', 'dist/assets/experts', { recursive: true });
        cpSync('assets/expert-profiles', 'dist/assets/expert-profiles', { recursive: true });
      },
    },
  ],
});
