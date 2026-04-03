-- Claude Artifact shortcode for Quarto
-- Usage: {{< claude-artifact file="artifact.html" height="400px" title="My Artifact" >}}
--
-- Embeds a self-contained HTML file (e.g. from Claude) in a sandboxed iframe.

return {
  ['claude-artifact'] = function(args, kwargs)
    local file = kwargs['file'] or args[1]
    local height = kwargs['height'] or '500px'
    local title = kwargs['title'] or 'Claude Artifact'

    if file == nil then
      return pandoc.Null()
    end

    local html = string.format(
      '<div class="claude-artifact-container">' ..
      '<div class="claude-artifact-header">' ..
      '<span class="claude-artifact-badge">Claude Artifact</span>' ..
      '<span class="claude-artifact-title">%s</span>' ..
      '</div>' ..
      '<iframe src="%s" ' ..
      'style="width:100%%;height:%s;border:none;border-radius:0 0 8px 8px;" ' ..
      'sandbox="allow-scripts allow-same-origin" ' ..
      'loading="lazy" ' ..
      'title="%s">' ..
      '</iframe>' ..
      '</div>',
      title, file, height, title
    )

    return pandoc.RawBlock('html', html)
  end
}
