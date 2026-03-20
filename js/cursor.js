if (window.matchMedia('(pointer: fine)').matches) {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
  });

  (function animateFollower() {
    fx += (mx - fx) * 0.11;
    fy += (my - fy) * 0.11;
    follower.style.transform = `translate(${fx - 15}px, ${fy - 15}px)`;
    requestAnimationFrame(animateFollower);
  })();

  document.querySelectorAll('a, button, [role="button"]').forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('hovered'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hovered'));
  });
}
