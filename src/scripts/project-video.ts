export {};
const visibleVideos = new Set<HTMLVideoElement>();
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    const video = entry.target as HTMLVideoElement;
    if (entry.isIntersecting) { visibleVideos.add(video); if (!document.hidden) video.play().catch(() => { video.controls = true; }); }
    else { visibleVideos.delete(video); video.pause(); }
  }
}, { threshold: .2 });
for (const video of document.querySelectorAll<HTMLVideoElement>('[data-project-video]')) { video.muted = true; observer.observe(video); }
document.addEventListener('visibilitychange', () => { for (const video of visibleVideos) { if (document.hidden) video.pause(); else video.play().catch(() => { video.controls = true; }); } });
