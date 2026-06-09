return {
  ["audio"] = function(args, kwargs, meta)
    local src = args[1] or ""
    if src == "" then
      return pandoc.Null()
    end

    local title = kwargs["title"] or "Audio Narration"

    local html = string.format([[
<div class="custom-audio-container" style="margin: 1rem 0; padding: 1rem; background: #1e293b; border-radius: 8px;">
  <p style="margin-top: 0; color: #38bdf8; font-weight: bold;">%s</p>
  <audio controls class="custom-audio-player" style="width: 100%%;">
    <source src="%s">
    Your browser does not support the audio element.
  </audio>
</div>
    ]], title, src)

    if quarto.doc.is_format("html") then
      return pandoc.RawBlock('html', html)
    else
      return pandoc.Null()
    end
  end
}
