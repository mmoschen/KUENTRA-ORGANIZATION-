param(
  [string]$SourceDirectory = (Join-Path $PSScriptRoot "../../../docs/testimonios"),
  [string]$DestinationDirectory = (Join-Path $PSScriptRoot "../public/testimonials/cliente-02")
)

Add-Type -AssemblyName System.Drawing

$sources = @(
  "card2 1.png",
  "card2 2.png",
  "Car2 3.png"
)

New-Item -ItemType Directory -Path $DestinationDirectory -Force | Out-Null

for ($index = 0; $index -lt $sources.Count; $index++) {
  $sourcePath = Join-Path $SourceDirectory $sources[$index]
  $destinationPath = Join-Path $DestinationDirectory ("{0:D2}.png" -f ($index + 1))

  if ($index -ne 2) {
    [System.IO.File]::Copy($sourcePath, $destinationPath, $true)
    continue
  }

  # La tercera captura conserva el comprobante, pero oculta el importe antes de publicarse.
  $bitmap = [System.Drawing.Bitmap]::new($sourcePath)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $brush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
  $graphics.FillRectangle($brush, 55, 770, 190, 82)
  $brush.Dispose()
  $graphics.Dispose()
  $bitmap.Save($destinationPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $bitmap.Dispose()
}
