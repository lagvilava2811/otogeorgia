const url = 'https://lagvilava2811.github.io/Premium-Photography-Studio/';
fetch(url).then(r => r.text()).then(html => {
  // Get inline styles
  const styleBlocks = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
  if (styleBlocks) {
    styleBlocks.forEach((s, i) => console.log(`STYLE ${i}:`, s.substring(0, 2000)));
  }
  // Get CSS file links
  const cssLinks = html.match(/href="([^"]*\.css)"/gi);
  console.log('CSS LINKS:', cssLinks);
  // Get body structure
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (body) console.log('BODY structure:', body[1].substring(0, 3000));
});
